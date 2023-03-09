import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router as authRouter } from "./routes/auth.js";
import { router as userRouter } from "./routes/users.js";
import { router as postRouter } from "./routes/posts.js";
import { getAppData } from "./controllers/app.js";

dotenv.config();

const app = express();

app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
const allowedOrigins = ["https://retrieve-api.onrender.com/"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ROUTES

app.use("/api/status", (req, res) => {
  res.status(200).json({ status: "live" });
});

app.use("/api/app/appdata", getAppData);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

// MONGOOSE SETUP
const port = process.env.PORT || 6001;
const mongoURI = process.env.MONGO_URI;

mongoose.set("strictQuery", true);
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`Server is Live`));
  })
  .catch((error) => console.log(error));
