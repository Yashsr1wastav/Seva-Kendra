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

// Middleware: Ensure Database Connection for every request
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    console.error("Database connection failed in middleware:", error);
    res.status(500).json({ error: "Service unavailable: Database connection failed" });
  }
});

const whitelist = appConfig.whiteList.split(",");

app.set("trust proxy", 1);

// const corsOptions = {
//   origin(origin, callback) {
//     console.log(origin, "origin");

//     if (!origin) {
//       return callback(null, true); // for mobile app and postman client
//     }
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));
// allow all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: false,
    optionsSuccessStatus: 200,
  })
);
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
app.use(helmet());
// app.use(xss());
app.use(morgan("tiny"));

// Handle preflight requests
app.options("*", cors());

app.use("/api/v1", indexRouter);

app.use(notFound);
app.use(errorHandler);

const port = appConfig.port;

app.listen(port, () => {
  console.log(`Server Running on ${port}`);
  return true;
});