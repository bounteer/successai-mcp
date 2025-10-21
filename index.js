import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(cors());
app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.SUCCESSAI_BASE_URL;
const API_KEY = process.env.SUCCESSAI_API_KEY;

if (!BASE_URL || !API_KEY) {
  console.error("❌ Missing SUCCESSAI_BASE_URL or SUCCESSAI_API_KEY in .env");
  process.exit(1);
}

/**
 * 🧩 Universal proxy endpoint
 * n8n can call this as:
 *   POST http://localhost:4000/proxy
 *   body: { "method":"GET", "path":"/v1/campaign/list", "params": { "limit": 10 } }
 */
app.post("/proxy", async (req, res) => {
  const { method = "GET", path, params = {}, body = {} } = req.body || {};

  if (!path) {
    return res.status(400).json({ error: "Missing 'path' in body" });
  }

  try {
    const config = {
      method: method.toLowerCase(),
      url: `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`,
      params: { ...params, apiKey: API_KEY },
      data: body,
      headers: { "Content-Type": "application/json" },
      timeout: 20000
    };

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("❌ Proxy error:", err.message);
    res.status(err.response?.status || 500).json({
      error: "Request failed",
      details: err.response?.data || err.message
    });
  }
});

/**
 * 🎯 Convenience: list campaigns
 */
app.get("/campaigns", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/v1/campaign/list`, {
      params: { ...req.query, apiKey: API_KEY }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: "Failed to fetch campaigns",
      details: err.response?.data || err.message
    });
  }
});

/**
 * 🎯 Convenience: add contact
 */
app.post("/contact/add", async (req, res) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/contact/add`,
      { ...req.body, apiKey: API_KEY },
      { headers: { "Content-Type": "application/json" } }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: "Failed to add contact",
      details: err.response?.data || err.message
    });
  }
});

/**
 * ✅ Health check
 **/
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Success.ai Wrapper",
    base_url: BASE_URL
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Success.ai wrapper running on http://localhost:${PORT}`)
);

