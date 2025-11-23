# SnapEats

The **SnapEats** project is developed to simulate a local food delivery system. It focuses on practicing relational database concepts using a **React** frontend, **Flask** backend, and a **MySQL** database, all containerized with Docker.

## Getting Started

This guide will help you set up and run the project environment on your local machine using Docker.

### Prerequisites
- Ensure **Docker Desktop** is installed and running on your machine.

### 1. Run the Application
Open your terminal/command prompt in the project root directory (`3363-SnapEats/`) and execute the following command to build and start the containers:

```bash
docker-compose up -d --build
```

- The `--build` flag ensures that the Docker images are built from scratch, including installing all necessary dependencies.
- The `-d` flag runs the containers in the background (detached mode).

### 2. Access the Application

Once the containers are running, you can access the different components of the system:

####  Frontend (Customer App)
- **URL**: [http://127.0.0.1:8081](http://127.0.0.1:8081)
- **Note**: We have mapped the frontend to port **8081** (instead of the default 5173) to avoid potential conflicts with other project / local services you might be running.

#### Backend Dashboard (DB Monitor)
- **URL**: [http://127.0.0.1:5000](http://127.0.0.1:5000)
- **Features**: This dashboard provides a real-time view of the database tables. It serves as a convenient interface to demonstrate data persistence and allows for some quick modifications (like updating order statuses or deleting records) without writing SQL queries manually.

### 3. Database Setup & Access

The MySQL container is configured to initialize automatically.

- **Auto-Initialization**: When the container starts for the first time, the `SnapEats_DB_ini.sql` file in the project root is automatically executed. This creates the `SnapEats` schema and populates it with seed data (restaurants, menu items, users, etc.).

#### Connecting via MySQL Workbench
If you want to inspect the database or run custom queries using **MySQL Workbench** on your host machine, use the following connection details:

- **Hostname**: `127.0.0.1`
- **Port**: `3307` (Mapped to avoid conflict with your local MySQL default port 3306)
- **Username**: `root`
- **Password**: `3363`
- **Default Schema**: `SnapEats`

## Project Scope & Limitations

Please note the following regarding the scope of this implementation:

- **Customer Focus**: This system currently focuses exclusively on **Customer** operations (Browsing, Ordering, Cart management, Profile management).
- **Out of Scope**: Due to time constraints, the **Restaurant Management** (menu editing, accepting orders) and **Delivery Management** interfaces were not implemented. These functions are either simulated or managed via the Backend Dashboard for demonstration purposes.

##  Troubleshooting

- **Stopping the Containers**: To stop the app, run:
  ```bash
  docker-compose down
  ```
- **Resetting the Database**: If you need to reset the database to its initial state (reload `SnapEats_DB_ini.sql`), run the following command to remove the data volume:
  ```bash
  docker-compose down -v
  docker-compose up -d --build
  ```
