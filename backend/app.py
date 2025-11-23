import os
import json
from typing import List, Dict, Any, Optional, Tuple

from flask import Flask, jsonify, request, render_template, redirect
from flask_cors import CORS
import pymysql


def create_app() -> Flask:
	app = Flask(__name__)
	CORS(app)

	app.config["DB_HOST"] = os.getenv("DB_HOST", "127.0.0.1")
	app.config["DB_USER"] = os.getenv("DB_USER", "root")
	app.config["DB_PASSWORD"] = os.getenv("DB_PASSWORD", "")
	app.config["DB_NAME"] = os.getenv("DB_NAME", "SnapEats")
	app.config["DB_CHARSET"] = os.getenv("DB_CHARSET", "utf8mb4")

	def get_db_connection():
		return pymysql.connect(
			host=app.config["DB_HOST"],
			user=app.config["DB_USER"],
			password=app.config["DB_PASSWORD"],
			database=app.config["DB_NAME"],
			charset=app.config["DB_CHARSET"],
			cursorclass=pymysql.cursors.DictCursor,
			autocommit=True,
		)

	def query_all(sql: str, params: Tuple = ()) -> List[Dict[str, Any]]:
		conn = get_db_connection()
		try:
			with conn.cursor() as cur:
				cur.execute(sql, params)
				return cur.fetchall()
		finally:
			conn.close()

	def query_one(sql: str, params: Tuple = ()) -> Optional[Dict[str, Any]]:
		rows = query_all(sql, params)
		return rows[0] if rows else None

	def execute(sql: str, params: Tuple = ()) -> int:
		conn = get_db_connection()
		try:
			with conn.cursor() as cur:
				cur.execute(sql, params)
				return cur.lastrowid
		finally:
			conn.close()

	# ------------- Admin Dashboard -------------
	@app.route("/")
	def dashboard():
		try:
			users = query_all("SELECT * FROM users")
			restaurants = query_all("SELECT * FROM restaurants")
			orders = query_all("SELECT * FROM orders ORDER BY orderID DESC LIMIT 50")
			items = query_all("SELECT * FROM items LIMIT 50")
			addresses = query_all("SELECT * FROM customerAddressBook LIMIT 50")
			payments = query_all("SELECT * FROM payments LIMIT 50")
			return render_template(
				"dashboard.html", 
				users=users, 
				restaurants=restaurants, 
				orders=orders, 
				items=items,
				addresses=addresses,
				payments=payments
			)
		except Exception as e:
			return f"Error connecting to DB: {str(e)}"

	@app.route("/admin/delete/<table_name>/<int:record_id>", methods=["POST"])
	def admin_delete(table_name, record_id):
		# Simple whitelist for security
		if table_name not in ["users", "restaurants", "orders", "items", "customerAddressBook", "payments"]:
			return "Invalid table", 400
		
		# ID column mapping
		id_col_map = {
			"users": "usrID",
			"restaurants": "restID",
			"orders": "orderID",
			"items": "itemID",
			"customerAddressBook": "addID",
			"payments": "paymentID"
		}
		col = id_col_map.get(table_name)
		if not col:
			return "Unknown ID column", 400

		try:
			execute(f"DELETE FROM {table_name} WHERE {col}=%s", (record_id,))
			return redirect("/")
		except Exception as e:
			return f"Error deleting: {str(e)}", 500

	@app.route("/admin/update_order_status/<int:order_id>", methods=["POST"])
	def admin_update_order_status(order_id):
		status = request.form.get("status")
		if status not in ["pending", "confirmed", "cancelled", "completed"]:
			return "Invalid status", 400
		try:
			execute("UPDATE orders SET orderStatus=%s WHERE orderID=%s", (status, order_id))
			return redirect("/")
		except Exception as e:
			return f"Error updating: {str(e)}", 500

	@app.route("/api/health", methods=["GET"])
	def health():
		return jsonify({"status": "ok"})

	# ------------- Restaurants -------------
	@app.route("/api/restaurants", methods=["GET"])
	def list_restaurants():
		rows = query_all(
			"""
			SELECT restID AS id, restName AS name, restTelNum AS tel, restLoc AS loc
			FROM restaurants
			ORDER BY restID
			"""
		)
		for i, r in enumerate(rows):
			r["rating"] = round(4.4 + (i % 6) * 0.1, 1)
		return jsonify(rows)

	@app.route("/api/restaurants/<int:rest_id>", methods=["GET"])
	def get_restaurant(rest_id: int):
		row = query_one(
			"""
			SELECT restID AS id, restName AS name, restTelNum AS tel, restLoc AS loc
			FROM restaurants WHERE restID=%s
			""",
			(rest_id,),
		)
		if not row:
			return jsonify({"error": "Restaurant not found"}), 404
		row["rating"] = 4.7
		return jsonify(row)

	@app.route("/api/restaurants/<int:rest_id>/menu", methods=["GET"])
	def get_restaurant_menu(rest_id: int):
		rows = query_all(
			"""
			SELECT i.itemID AS id,
				   i.itemName AS name,
				   i.itemDSC AS description,
				   i.itemPrice AS price
			FROM menus m
			JOIN menuItem mi ON mi.menuID = m.menuID
			JOIN items i ON i.itemID = mi.itemID
			WHERE m.restID = %s
			ORDER BY i.itemID
			""",
			(rest_id,),
		)
		return jsonify(rows)

	# ------------- Auth -------------
	@app.route("/api/auth/signup", methods=["POST"])
	def signup():
		data = request.get_json(force=True)
		email = (data.get("email") or "").strip()
		password = (data.get("password") or "").strip()
		first_name = (data.get("firstName") or "").strip()
		last_name = (data.get("lastName") or "").strip()
		if not (email and password and first_name and last_name):
			return jsonify({"error": "Missing required fields"}), 400

		existing = query_one("SELECT usrID FROM users WHERE emailAddr=%s", (email,))
		if existing:
			return jsonify({"error": "Email already registered"}), 409

		user_id = execute(
			"""
			INSERT INTO users (usrpwd, usrLastName, usrFirstName, usrRole, emailAddr)
			VALUES (%s, %s, %s, 'customer', %s)
			""",
			(password, last_name, first_name, email),
		)
		return jsonify(
			{
				"usrID": user_id,
				"email": email,
				"firstName": first_name,
				"lastName": last_name,
				"role": "customer",
			}
		), 201

	@app.route("/api/auth/login", methods=["POST"])
	def login():
		data = request.get_json(force=True)
		email = (data.get("email") or "").strip()
		password = (data.get("password") or "").strip()
		if not (email and password):
			return jsonify({"error": "Missing credentials"}), 400

		row = query_one(
			"""
			SELECT usrID, usrFirstName AS firstName, usrLastName AS lastName, usrRole AS role, emailAddr AS email
			FROM users WHERE emailAddr=%s AND usrpwd=%s
			""",
			(email, password),
		)
		if not row:
			return jsonify({"error": "Invalid email or password"}), 401
		return jsonify(row)
    
	# ------------- User Profile -------------
	@app.route("/api/users/<int:user_id>", methods=["GET"])
	def get_user(user_id):
		row = query_one(
			"SELECT usrID, usrFirstName AS firstName, usrLastName AS lastName, emailAddr AS email FROM users WHERE usrID=%s",
			(user_id,)
		)
		if not row:
			return jsonify({"error": "User not found"}), 404
		return jsonify(row)

	@app.route("/api/users/<int:user_id>", methods=["PUT"])
	def update_user(user_id):
		data = request.get_json(force=True)
		firstName = data.get("firstName")
		lastName = data.get("lastName")
		password = data.get("password") 

		if firstName and lastName:
			if password:
				execute(
					"UPDATE users SET usrFirstName=%s, usrLastName=%s, usrpwd=%s WHERE usrID=%s",
					(firstName, lastName, password, user_id)
				)
			else:
				execute(
					"UPDATE users SET usrFirstName=%s, usrLastName=%s WHERE usrID=%s",
					(firstName, lastName, user_id)
				)
			return jsonify({"status": "updated"})
		return jsonify({"error": "Missing fields"}), 400

	@app.route("/api/users/<int:user_id>", methods=["DELETE"])
	def delete_user(user_id):
		execute("DELETE FROM users WHERE usrID=%s", (user_id,))
		return jsonify({"status": "deleted"})

	# ------------- Payments -------------
	@app.route("/api/users/<int:user_id>/payments", methods=["GET"])
	def list_payments(user_id):
		rows = query_all("SELECT paymentID, cardNum FROM payments WHERE usrID=%s", (user_id,))
		for r in rows:
			num = r["cardNum"]
			if len(num) > 4:
				r["masked"] = "**** **** **** " + num[-4:]
			else:
				r["masked"] = num
		return jsonify(rows)

	@app.route("/api/users/<int:user_id>/payments", methods=["POST"])
	def add_payment(user_id):
		data = request.get_json(force=True)
		cardNum = (data.get("cardNum") or "").strip()
		if not cardNum:
			return jsonify({"error": "Card number required"}), 400
		
		try:
			pid = execute("INSERT INTO payments (usrID, cardNum) VALUES (%s, %s)", (user_id, cardNum))
			return jsonify({"paymentID": pid, "cardNum": cardNum}), 201
		except Exception as e:
			return jsonify({"error": str(e)}), 400

	@app.route("/api/payments/<int:payment_id>", methods=["DELETE"])
	def delete_payment(payment_id):
		execute("DELETE FROM payments WHERE paymentID=%s", (payment_id,))
		return jsonify({"status": "deleted"})

	# ------------- Addresses -------------
	@app.route("/api/users/<int:user_id>/addresses", methods=["GET"])
	def list_addresses(user_id):
		rows = query_all("SELECT addID, address, contactNum FROM customerAddressBook WHERE usrID=%s", (user_id,))
		return jsonify(rows)

	@app.route("/api/users/<int:user_id>/addresses", methods=["POST"])
	def add_address(user_id):
		data = request.get_json(force=True)
		address = (data.get("address") or "").strip()
		contact = (data.get("contactNum") or "").strip()
		if not address:
			return jsonify({"error": "Address required"}), 400
		
		aid = execute(
			"INSERT INTO customerAddressBook (usrID, address, contactNum) VALUES (%s, %s, %s)",
			(user_id, address, contact)
		)
		return jsonify({"addID": aid, "address": address, "contactNum": contact}), 201

	@app.route("/api/addresses/<int:address_id>", methods=["DELETE"])
	def delete_address(address_id):
		execute("DELETE FROM customerAddressBook WHERE addID=%s", (address_id,))
		return jsonify({"status": "deleted"})

	# ------------- Orders -------------
	@app.route("/api/orders", methods=["GET"])
	def list_orders():
		usr_id = request.args.get("usrID", type=int)
		if not usr_id:
			return jsonify({"error": "usrID required"}), 400
		orders = query_all(
			"""
			SELECT o.orderID AS id,
				   o.usrID,
				   o.restID,
				   r.restName AS restaurant,
				   o.orderTime,
				   o.orderStatus,
				   cab.address AS deliveryAddress
			FROM orders o
			JOIN restaurants r ON r.restID = o.restID
			LEFT JOIN deliveries d ON d.orderID = o.orderID
			LEFT JOIN customerAddressBook cab ON cab.addID = d.custAddrID
			WHERE o.usrID = %s
			ORDER BY o.orderTime DESC, o.orderID DESC
			""",
			(usr_id,),
		)
		for o in orders:
			items = query_all(
				"""
				SELECT i.itemID, i.itemName, oi.quantity, i.itemPrice
				FROM orderItems oi
				JOIN items i ON i.itemID = oi.itemID
				WHERE oi.orderID = %s
				""",
				(o["id"],),
			)
			o["items"] = [
				{"id": it["itemID"], "name": it["itemName"], "quantity": it["quantity"], "price": float(it["itemPrice"])}
			for it in items]
			o["total"] = round(sum(float(it["itemPrice"]) * it["quantity"] for it in items), 2)
		return jsonify(orders)

	@app.route("/api/orders", methods=["POST"])
	def create_order():
		data = request.get_json(force=True)
		usr_id = data.get("usrID")
		rest_id = data.get("restID")
		items = data.get("items", [])
		addr_id = data.get("custAddrID") 

		if not usr_id or not rest_id or not isinstance(items, list) or len(items) == 0:
			return jsonify({"error": "usrID, restID and items are required"}), 400

		resolved: List[Tuple[int, int]] = []
		for it in items:
			item_id = it.get("itemID")
			qty = int(it.get("quantity", 1))
			if not item_id and "name" in it:
				row = query_one("SELECT itemID FROM items WHERE itemName=%s", (it["name"],))
				if not row:
					return jsonify({"error": f"Unknown item '{it['name']}'"}), 400
				item_id = row["itemID"]
			if not item_id:
				return jsonify({"error": "Each item must provide itemID or name"}), 400
			resolved.append((item_id, qty))

		order_id = execute(
			"INSERT INTO orders (usrID, restID, orderStatus) VALUES (%s, %s, 'pending')",
			(usr_id, rest_id),
		)
		for item_id, qty in resolved:
			execute(
				"INSERT INTO orderItems (orderID, itemID, quantity) VALUES (%s, %s, %s)",
				(order_id, item_id, qty),
			)
		
		if addr_id:
			execute(
				"INSERT INTO deliveries (orderID, restID, custAddrID, deliveryStatus) VALUES (%s, %s, %s, 'pending')",
				(order_id, rest_id, addr_id)
			)

		created = query_one(
			"""
			SELECT o.orderID AS id, o.usrID, o.restID, r.restName AS restaurant, o.orderTime, o.orderStatus
			FROM orders o JOIN restaurants r ON r.restID=o.restID
			WHERE o.orderID=%s
			""",
			(order_id,),
		)
		return jsonify(created), 201

	@app.route("/api/orders/<int:order_id>/cancel", methods=["POST"])
	def cancel_order(order_id):
		try:
			row = query_one("SELECT orderStatus FROM orders WHERE orderID=%s", (order_id,))
			if not row:
				return jsonify({"error": "Order not found"}), 404
			
			if row["orderStatus"] not in ["pending", "confirmed"]:
				return jsonify({"error": "Cannot cancel order in current status"}), 400

			execute("UPDATE orders SET orderStatus='cancelled' WHERE orderID=%s", (order_id,))
			return jsonify({"status": "cancelled"})
		except Exception as e:
			print(f"Error cancelling order: {e}")
			return jsonify({"error": str(e)}), 500

	return app


app = create_app()
