import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("server is running"));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
