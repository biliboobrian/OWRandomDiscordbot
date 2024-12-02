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
            CREATE TABLE IF NOT EXISTS user_stats (
                user_id INTEGER,
                role TEXT,
                hero TEXT,
                count INTEGER,
                PRIMARY KEY (user_id, role, hero)
            );
        `;
    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error("Erreur lors de la création des tables:", err.message);
      }
    });
  }

  addCountOnHero(userId: string, role: string, hero: string): void {
    const insertQuery = `
            INSERT INTO user_stats (user_id, role, hero, count)
        VALUES (?, ?, ?, 1)
        ON CONFLICT(user_id, role, hero)
        DO UPDATE SET count = count + 1
        `;
    this.db.run(insertQuery, [userId, role, hero], (err) => {
      if (err) {
        console.error("Erreur lors de l'ajout des statistiques:", err.message);
      } else {
        console.log("Statistique ajoutée avec succès.");
      }
    });
  }

  getUserStatisticByRole(userId: string, role: string): Promise<UserStats[]> {
    return new Promise((resolve, reject) => {
      const selectQuery = `
        SELECT * FROM user_stats
        WHERE user_id = ? AND role = ? ORDER BY count DESC;
    `;
      this.db.all<UserStats>(selectQuery, [userId, role], (err, rows) => {
        if (err) {
          reject(
            `Erreur lors de la récupération des statistiques:\n ${err.message}`
          );
        } else {
          resolve(rows);
        }
      });
    });
  }

  getUserStatistic(userId: string): Promise<UserStats[]> {
    return new Promise((resolve, reject) => {
      const selectQuery = `
        SELECT * FROM user_stats
        WHERE user_id = ? ORDER BY count DESC;
    `;
      this.db.all<UserStats>(selectQuery, [userId], (err, rows) => {
        if (err) {
          reject(
            `Erreur lors de la récupération des statistiques:\n ${err.message}`
          );
        } else {
          resolve(rows);
        }
      });
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

export interface UserStats {
  userId: string;
  role: string;
  hero: string;
  count: number;
}
