import fs from "fs";
import { serverResponse } from "../utils/serverResponse.js";
import { User } from "../models/User.js";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";

const USERS = "./data/users.json";
const BOARDS = "./data/boards.json";
const COLUMNS = "./data/columns.json";
const CARDS = "./data/cards.json";

export const resetDB = async (req, res) => {
  try {
    const usersJson = fs.readFileSync(USERS, { encoding: "utf-8" });
    const users = JSON.parse(usersJson);

    const boardsJson = fs.readFileSync(BOARDS, { encoding: "utf-8" });
    const boards = JSON.parse(boardsJson);

    const columnsJson = fs.readFileSync(COLUMNS, { encoding: "utf-8" });
    const columns = JSON.parse(columnsJson);

    const cardsJson = fs.readFileSync(CARDS, { encoding: "utf-8" });
    const cards = JSON.parse(cardsJson);

    // wipe (dev only)
    await Promise.all([
      User.deleteMany({}),
      Board.deleteMany({}),
      Column.deleteMany({}),
      Card.deleteMany({}),
    ]);

    // seed in correct order
    await User.insertMany(users);
    await Board.insertMany(boards);
    await Column.insertMany(columns);
    await Card.insertMany(cards);

    return serverResponse(res, 200, {
      ok: true,
      inserted: {
        users: users.length,
        boards: boards.length,
        columns: columns.length,
        cards: cards.length,
      },
      ids: {
        demoUserId: users[0]?._id,
        demoBoardId: boards[0]?._id,
      },
    });
  } catch (err) {
    console.error("resetDb error:", err);
    return serverResponse(res, 500, "Internal server error");
  }
};
