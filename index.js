import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router as authRouter } from './routes/auth.js';
import { router as userRouter } from "./routes/users.js";
import { router as postRouter } from "./routes/posts.js";

dotenv.config();

const app = express();

app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
// app.use(cors());
app.use(cors({ origin: true, credentials: true }));

// ROUTES

app.use("/auth", authRouter);
app.use("/users", userRouter)
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
    app.listen(port, () => console.log(`Server listening on port: ${port}`));
  })
  .catch((error) => console.log(error));
