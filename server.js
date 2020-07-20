const express = require("express");

const app = express();

const path = require("path");

const PORT = process.env.PORT || 5000;

const app_path = "./static";

app
  .use("/", express.static(path.join(__dirname, app_path)))
  .get("*", (req, res) =>
    res.sendFile(path.join(__dirname, app_path, "index.html"))
  )
  .listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
