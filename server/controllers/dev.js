import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serverResponse } from "../utils/serverResponse.js";
import { User } from "../models/User.js";
import { Board } from "../models/Board.js";
import { Column } from "../models/Column.js";
import { Card } from "../models/Card.js";
import { registerUserService } from "../services/users.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

// files contains seed data for default database
const USERS = path.join(dataDir, "users.json");
const BOARDS = path.join(dataDir, "boards.json");
const COLUMNS = path.join(dataDir, "columns.json"); // columns with nested cards
// const CARDS = "./data/cards.json";

export const resetDB = async (req, res) => {
  try {
    const userSeeds = JSON.parse(fs.readFileSync(USERS, "utf-8"));
    const boardSeeds = JSON.parse(fs.readFileSync(BOARDS, "utf-8"));
    const columnSeeds = JSON.parse(fs.readFileSync(COLUMNS, "utf-8"));

    // clear all collections
    await Promise.all([
      User.deleteMany({}),
      Board.deleteMany({}),
      Column.deleteMany({}),
      Card.deleteMany({}),
    ]);

    // register users (hashes passwords via registerUserService)
    const insertedUsers = [];
    for (const userSeed of userSeeds) {
      const result = await registerUserService(userSeed);
      insertedUsers.push(result.data.user);
    }
    const demoUserId = insertedUsers[0]._id;

    // insert boards, link to real user ID (empty columnIds for now)
    const boardDocs = boardSeeds.map((b) => ({
      ...b,
      ownerId: demoUserId,
      columnIds: [],
    }));
    const insertedBoards = await Board.insertMany(boardDocs);
    const demoBoardId = insertedBoards[0]._id;

    // insert columns and nested cards, link to real board ID
    const columnIds = [];

    for (const columnSeed of columnSeeds) {
      const { cards: cardSeeds = [], ...columnData } = columnSeed;

      // create column (empty cardIds for now)
      const column = await Column.create({
        ...columnData,
        boardId: demoBoardId,
        cardIds: [],
      });

      // create cards for this column
      const cardIds = [];
      for (const cardSeed of cardSeeds) {
        const card = await Card.create({
          ...cardSeed,
          boardId: demoBoardId,
          columnId: column._id,
        });
        cardIds.push(card._id);
      }

      // update column with real card IDs
      if (cardIds.length > 0) {
        column.cardIds = cardIds;
        await column.save();
      }

      columnIds.push(column._id);
    }

    // update board with real column IDs
    await Board.findByIdAndUpdate(demoBoardId, { columnIds });

    return serverResponse(res, 200, {
      ok: true,
      ids: {
        demoUserId,
        demoBoardId,
      },
    });
  } catch (err) {
    console.error("resetDb error:", err);
    return serverResponse(res, 500, "Internal server error");
  }
};
