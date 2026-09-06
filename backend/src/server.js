const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`Caspian Motors Clinic backend running at http://localhost:${config.port}`);
  if (!config.adminEmail || !config.adminPassword) console.warn('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before logging into /admin/');
});
