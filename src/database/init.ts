import { SQLiteDatabase } from 'expo-sqlite';

export const initializeDatabase = async (database: SQLiteDatabase) => {
    try {
        await database.execAsync(
            `
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                budget REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            `
        );

        await database.execAsync(
            `
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            `
        );

        await database.execAsync(
            `
            CREATE TABLE IF NOT EXISTS receipts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                category_id INTEGER,
                name TEXT NOT NULL,
                amount REAL,
                issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects (id),
                FOREIGN KEY (category_id) REFERENCES categories (id)
            );
            `
        );
    } catch (error) {
        alert('An error occurred while initializing the database. Please try again later.');
    }
};


export const dropDatabase = async (database: SQLiteDatabase) => {
    try {
        await database.execAsync(`DROP TABLE IF EXISTS projects;`);
        await database.execAsync(`DROP TABLE IF EXISTS categories;`);
        await database.execAsync(`DROP TABLE IF EXISTS receipts;`);

    } catch (error) {
        alert('An error occurred while initializing the database. Please try again later.');
    }
};