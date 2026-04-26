import express from "express";
import dbConnect from "./utils/dbConnection.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
// import xss from "xss-clean";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import indexRouter from "./routers/index.js";
import { appConfig } from "./config/appConfig.js";

const app = express();

const whitelist = [
  appConfig.whiteList,
  appConfig.frontendUrl,
  process.env.VERCEL ? "https://seva-kendra-frontend.vercel.app" : "",
]
  .flatMap((value) => value.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check if origin is in whitelist
    if (whitelist.includes(origin)) {
      callback(null, true);
      return;
    }

    // Always allow Vercel subdomains to prevent common deployment issues
    if (origin.endsWith(".vercel.app")) {
      callback(null, true);
      return;
    }

    // Allow localhost in development
    if (appConfig.nodeEnv !== "production" && (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1"))) {
      callback(null, true);
      return;
    }

    console.error(`CORS blocked for origin: ${origin}`);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
// app.use(helmet());
// app.use(xss());
app.use(morgan("tiny"));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Health check at root
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ngo_backend_root",
    vercel: !!process.env.VERCEL,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ngo_backend",
    environment: appConfig.nodeEnv || "development",
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState
  });
});

app.use("/api/v1", indexRouter);

app.use(notFound);
app.use(errorHandler);

const port = appConfig.port;

const startServer = async () => {
  try {
    await dbConnect();

    app.listen(port, () => {
      console.log(`Server Running on ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Vercel handles the listening, but we still need to connect to DB
if (process.env.VERCEL) {
  // Use a promise to ensure we only try to connect once per instance
  let cachedDb = null;
  app.use(async (req, res, next) => {
    try {
      if (!cachedDb) {
        cachedDb = dbConnect();
      }
      await cachedDb;
      next();
    } catch (err) {
      console.error("Database connection middleware error:", err.message);
      res.status(503).json({ error: "Database connection failed" });
    }
  });
} else {
  startServer();
}

export default app;