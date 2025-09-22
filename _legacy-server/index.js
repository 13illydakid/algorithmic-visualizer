const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);

// Serve static files from src/public
app.use(express.static(path.join(__dirname, "../src/public")));

// Send index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

server.listen(1337, () => {
  console.log("🚀 Server running at http://localhost:1337");
});
