import express from "express";
import cors from "cors";
import "dotenv/config";
import boardsRoutes from "./routes/boards.js";
import columnsRoutes from "./routes/columns.js";
import cardsRoutes from "./routes/cards.js";
import usersRoutes from "./routes/users.js";
import devRoutes from "./routes/dev.js";
import { connectDB } from "./DB/db.js";

const port = process.env.PORT || 4000;
const mongouri = process.env.MONGOURI || "";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/dev", devRoutes);

app.use("/api/boards", boardsRoutes);
app.use("/api/columns", columnsRoutes);
app.use("/api/cards", cardsRoutes);
app.use("/api/users", usersRoutes);


const startServer = async () => {
  await connectDB(mongouri);
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
};

startServer();
