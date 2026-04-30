const isProd = import.meta.env.PROD;

// ================= API BASE URL =================
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (isProd ? "https://hazalis.com/api" : "http://localhost:5000/api");

// ================= CLIENT BASE URL =================
export const CLIENT_BASE_URL =
  import.meta.env.VITE_CLIENT_BASE_URL ||
  (isProd ? "https://hazalis.com" : "http://localhost:5173");

// ================= WARNINGS =================
if (isProd && API_URL.includes("localhost")) {
  console.warn(
    "⚠️ Production mode detected but API_URL is still pointing to localhost. " +
      "Please set VITE_API_URL in environment variables."
  );
}
