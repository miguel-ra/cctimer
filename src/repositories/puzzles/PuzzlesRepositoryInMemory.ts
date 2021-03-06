import { openDB, IDBPDatabase } from "idb";
import { PuzzleId, PuzzleKey, UserPuzzle } from "models/puzzles/Puzzle";
import { PuzzlesRepository } from "models/puzzles/PuzzlesRepository";

type PuzzlesDB = {
  puzzles: {
    key: number;
    value: UserPuzzle;
  };
};

const DB_NAME = "puzzles";
const DB_VERSION = 1;

class PuzzlesRepositoryInMemory implements PuzzlesRepository {
  private dbPromise: Promise<IDBPDatabase<PuzzlesDB>> | undefined;

  private openDB() {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = openDB<PuzzlesDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("puzzles", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.add({ key: "cube3" } as UserPuzzle);
      },
      terminated: () => {
        this.dbPromise = undefined;
      },
    });

    return this.dbPromise;
  }

  async add(puzzleKey: PuzzleKey): Promise<UserPuzzle> {
    const db = await this.openDB();
    const addedId = await db.add("puzzles", { key: puzzleKey } as UserPuzzle);
    return { key: puzzleKey, id: addedId };
  }

  async delete(puzzleId: PuzzleId) {
    const db = await this.openDB();
    await db.delete("puzzles", puzzleId);
  }

  async getAll() {
    const db = await this.openDB();
    return db.getAll("puzzles");
  }
}

export default PuzzlesRepositoryInMemory;
