import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const PORT = ENV.PORT || 3000;

/* ----------------------- */
/*   MIDDLEWARE ORDER      */
/* ----------------------- */

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

/* ----------------------- */
/*   CORS CONFIG (FIXED)   */
/* ----------------------- */

const allowedOrigins = [
  ENV.CLIENT_URL,               // Production frontend
  "http://localhost:5173",      // Local frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* Handle preflight */
app.options("*", cors());

/* ----------------------- */
/*        ROUTES           */
/* ----------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* ----------------------- */
/*        SERVER           */
/* ----------------------- */

server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});