import sqlite3 from "sqlite3";

export class Stats {
  private db: sqlite3.Database;

  constructor(dbFilePath: string) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.error(
          "Erreur lors de l'ouverture de la base de données:",
          err.message
        );
      } else {
        console.log("Connexion à la base de données SQLite réussie.");
        this.initializeTables();
      }
    });
  }

  private initializeTables() {
    const createTableQuery = `
            CREATE TABLE IF NOT EXISTS statistics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                action TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error("Erreur lors de la création des tables:", err.message);
      }
    });
  }

  addStatistic(userId: string, action: string): void {
    const insertQuery = `
            INSERT INTO statistics (userId, action)
            VALUES (?, ?);
        `;
    this.db.run(insertQuery, [userId, action], (err) => {
      if (err) {
        console.error("Erreur lors de l'ajout des statistiques:", err.message);
      } else {
        console.log("Statistique ajoutée avec succès.");
      }
    });
  }

  getStatistics(userId: string, callback: (rows: any[]) => void): void {
    const selectQuery = `
            SELECT * FROM statistics
            WHERE userId = ?;
        `;
    this.db.all(selectQuery, [userId], (err, rows) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          err.message
        );
        callback([]);
      } else {
        callback(rows);
      }
    });
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error(
          "Erreur lors de la fermeture de la base de données:",
          err.message
        );
      } else {
        console.log("Base de données SQLite fermée.");
      }
    });
  }
}
