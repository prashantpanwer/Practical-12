/**
 * Middleware Pipeline Architecture Demo (Single File)
 * Run with: node server.js
 */

const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

/* ============================================================
   1️⃣ X-REQUEST-ID CORRELATION (MUST BE FIRST)
============================================================ */
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
});

/* ============================================================
   2️⃣ HIGH-PRECISION TIMING
============================================================ */
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    res.setHeader("X-Response-Time-ms", durationMs.toFixed(3));
  });

  next();
});

/* ============================================================
   3️⃣ BODY SIZE LIMITS + SAFE JSON PARSING
============================================================ */
app.use(
  express.json({
    limit: "10kb",
    strict: true,
  })
);

/* ============================================================
   4️⃣ CORS WITH WHITELIST
============================================================ */
const whitelist = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
  })
);

/* ============================================================
   5️⃣ PER-ROUTE SCHEMA VALIDATION
============================================================ */
function validateSchema(schema) {
  return (req, res, next) => {
    for (const key of Object.keys(schema)) {
      if (typeof req.body[key] !== schema[key]) {
        return next({
          status: 400,
          title: "Invalid Request",
          detail: `Expected '${key}' to be of type ${schema[key]}`,
        });
      }
    }
    next();
  };
}

/* ============================================================
   6️⃣ ORDER-PROOF ENDPOINT
============================================================ */
app.post(
  "/demo",
  validateSchema({ name: "string" }),
  async (req, res, next) => {
    try {
      res.json({
        message: "Middleware order works ✅",
        requestId: req.requestId,
        receivedName: req.body.name,
      });
    } catch (err) {
      next(err);
    }
  }
);

/* ============================================================
   7️⃣ CENTRALIZED RFC-7807 ERROR HANDLER
============================================================ */
app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.setHeader("X-Request-Id", req.requestId);
  res.setHeader("X-Response-Time-ms", "0");

  res.status(status).json({
    type: "about:blank",
    title: err.title || "Internal Server Error",
    status,
    detail: err.detail || err.message || "Unknown error",
    instance: req.originalUrl,
    requestId: req.requestId,
  });
});

/* ============================================================
   8️⃣ NO UNHANDLED REJECTIONS (GLOBAL SAFETY)
============================================================ */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

/* ============================================================
   SERVER START
============================================================ */
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
