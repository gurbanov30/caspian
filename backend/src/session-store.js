const session = require('express-session');
const db = require('./db');

db.exec(`CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, expires INTEGER, sess TEXT NOT NULL)`);

class SQLiteSessionStore extends session.Store {
  constructor() {
    super();
    this.getStatement = db.prepare('SELECT sess, expires FROM sessions WHERE sid = ?');
    this.setStatement = db.prepare('INSERT INTO sessions (sid, expires, sess) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET expires = excluded.expires, sess = excluded.sess');
    this.destroyStatement = db.prepare('DELETE FROM sessions WHERE sid = ?');
    this.touchStatement = db.prepare('UPDATE sessions SET expires = ? WHERE sid = ?');
    this.cleanupStatement = db.prepare('DELETE FROM sessions WHERE expires IS NOT NULL AND expires < ?');
  }

  get(sid, callback) {
    try {
      const row = this.getStatement.get(sid);
      if (!row || (row.expires && row.expires < Date.now())) return callback(null, null);
      callback(null, JSON.parse(row.sess));
    } catch (error) { callback(error); }
  }

  set(sid, sess, callback) {
    try {
      const expires = sess.cookie?.expires ? new Date(sess.cookie.expires).getTime() : null;
      this.setStatement.run(sid, expires, JSON.stringify(sess));
      callback?.(null);
    } catch (error) { callback?.(error); }
  }

  destroy(sid, callback) {
    try { this.destroyStatement.run(sid); callback?.(null); } catch (error) { callback?.(error); }
  }

  touch(sid, sess, callback) {
    try {
      const expires = sess.cookie?.expires ? new Date(sess.cookie.expires).getTime() : null;
      this.touchStatement.run(expires, sid);
      callback?.(null);
    } catch (error) { callback?.(error); }
  }

  clearExpired() { this.cleanupStatement.run(Date.now()); }
}

module.exports = SQLiteSessionStore;
