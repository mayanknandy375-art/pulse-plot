const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json({ limit: "25mb" }));
app.use(express.static(path.join(__dirname)));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "PulsePlot", realtime: true });
});

io.on("connection", (socket) => {
  socket.emit("pulseplot:connected", { ok: true });
  socket.on("pulseplot:point", (point) => {
    io.emit("pulseplot:point", point);
  });
});

app.get("*splat", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`PulsePlot running on port ${PORT}`);
});
