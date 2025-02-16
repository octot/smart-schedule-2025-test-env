const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const cors = require("cors");
const routes = require("./routes/sessionsScheduleRoutes");
const { scheduleMessages } = require("./schedule/scheduleManager");
app.use(express.json());
app.use(routes);
app.use(cors());
scheduleMessages();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
mongoose.connect(
  "mongodb+srv://user:user@cluster0.syund4p.mongodb.net/smartschedule",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
