import express from "express";

const app = express();

app.listen(5550, () => {
  console.log("Server is started at port", 5550);
});
