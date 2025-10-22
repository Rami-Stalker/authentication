import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";

export const setupSecurity = (app) => {
  app.use(helmet());
  const corsOptions = {
    origin: (origin, callback) => {
      const whitelist = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : [];
      if (process.env.NODE_ENV !== 'production' && !origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  };
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(compression());
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
  app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
};
