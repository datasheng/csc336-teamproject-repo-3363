export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export async function fetchJSON(path, options = {}) {
	const res = await fetch(`${API_BASE}${path}`, {
		headers: { "Content-Type": "application/json" },
		...options,
	});
	if (!res.ok) {
		let message = `HTTP ${res.status}`;
		try {
			const data = await res.json();
			if (data && data.error) message = data.error;
		} catch (_) {}
		throw new Error(message);
	}
	return res.json();
}




