import express from "express";
import cors from "cors";
import authRoute from "./router/authRoute.js";
import fileRoute from "./router/fileRoute.js";
import shareRoute from "./router/shareRoute.js"

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/files", fileRoute);
app.use("/api/files", shareRoute);

app.use(express.static("public"));

app.use("/api", authRoute);

app.listen(5550, () => {
  console.log("Server is started at port", 5550);
});
