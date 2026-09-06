const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
const config = require('./config');

fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });
fs.mkdirSync(config.mediaDirectory, { recursive: true });

const db = new Database(config.databasePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
db.exec(schema);

const userColumns = db.prepare('PRAGMA table_info(admin_users)').all().map(column => column.name);
if (!userColumns.includes('role')) db.exec("ALTER TABLE admin_users ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'");
if (!userColumns.includes('is_active')) db.exec('ALTER TABLE admin_users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1');

module.exports = db;
