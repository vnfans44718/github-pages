const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const cors = require("cors");

dotenv.config();   // .env 로드
connectDB();       // MongoDB 연결 실행

const app = express();

// ✅ Body 파서
app.use(express.json());


app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.use("/auth", authRoutes);
app.get("/", (req, res) => res.send("Hello MongoDB! 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
