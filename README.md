# Practical-12

Middleware Pipeline Architecture Demo (Express.js)
This project demonstrates a production-grade Express middleware pipeline where middleware order matters. It showcases how to properly design a secure, observable, and robust API using a single-file architecture.

The goal is to ensure:

✅ Request correlation
✅ High-precision timing
✅ Security hardening
✅ Schema validation
✅ RFC-7807 compliant error handling
✅ Zero unhandled rejections
✅ Guaranteed response headers
All implemented in one single file for clarity and demo purposes.

✅ Features Implemented
🔹 1. X-Request-Id Correlation
Every request is assigned a unique X-Request-Id
Included in all successful and error responses
🔹 2. High-Precision Response Timing
Uses process.hrtime.bigint() for nanosecond precision

Returns duration in:

X-Response-Time-ms
🔹 3. Body Size Limits & Safe JSON Parsing
JSON body limit: 10kb
Prevents large payload attacks
Enforces strict JSON parsing
🔹 4. Secure CORS (Whitelist Only)
Only allows requests from approved origins
Blocks all other origins
🔹 5. Per-Route Schema Validation
Validates incoming request bodies per route
Ensures correct data types before reaching business logic
🔹 6. Centralized RFC-7807 Error Handler
All errors return standardized problem+json format

Includes:

type
title
status
detail
instance
requestId
🔹 7. No Unhandled Promise Rejections
Global process-level rejection handler
Ensures the server never silently crashes
🔹 8. Order-Proof Demo Endpoint
A test endpoint to verify that:

Headers
Validation
Timing
Errors all execute in the correct order
📂 Project Structure
.
└── server.js   ✅ Single-file demo
🧠 Middleware Execution Order
Order	Middleware
1	X-Request-Id Injection
2	High-Precision Timer
3	JSON Body Parser + Size Limit
4	CORS Whitelist
5	Schema Validation
6	Route Handler
7	RFC-7807 Error Handler
✅ This order is strictly enforced.

🚀 Getting Started
1️⃣ Install Node.js
Download from:

https://nodejs.org
2️⃣ Initialize Project
npm init -y
npm install express cors
3️⃣ Run the Server
node server.js
Server will start on:

http://localhost:4000
✅ Testing the Middleware Pipeline
✅ Valid Request
curl -X POST http://localhost:4000/demo \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}'
✅ Successful Response:

Includes X-Request-Id
Includes X-Response-Time-ms
Returns validated input
❌ Invalid Schema (Triggers RFC-7807 Error)
curl -X POST http://localhost:4000/demo \
  -H "Content-Type: application/json" \
  -d '{"name":123}'
✅ Returns:

HTTP 400
RFC-7807 compliant error JSON
Request ID still attached
No server crash
🎯 Learning Outcomes
After completing this demo, you fully understand how to:

Design strict middleware execution order

Track requests across logs and services

Capture high-precision performance metrics

Secure APIs with:

CORS
Payload limits
Enforce per-route input validation

Centralize all errors into a single RFC-compliant handler

Prevent unhandled async failures

Build production-safe Express pipelines

🏗️ Use Cases
This architecture is suitable for:

✅ Microservices
✅ Public APIs
✅ Internal enterprise systems
✅ Interview system design demos
✅ Observability-first backends
