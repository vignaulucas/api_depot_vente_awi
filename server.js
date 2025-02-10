require('dotenv').config();
const express = require('express');
const { db } = require('./app/models');
const cors = require('cors');
const app = express();
const sessionChecker = require("./app/sessionChecker")

const init = require('./init');

const allowedOrigins = [
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedOrigins
}));
app.use(express.json({ limit: '10mb' }));

db.sequelize
  .sync()
  .then(async () => {
    console.log('Synced db.');
  })
  .catch(err => {
    console.log('Failed to sync db: ' + err.message);
  });

app.get('/', function (req, res) {
  res.send('Server up');
});

require('./app/routes/user.routes')(app);
require('./app/routes/saleSession.routes')(app);
require('./app/routes/game.routes')(app);
require('./app/routes/temporarySeller.routes')(app);
require('./app/routes/temporaryBuyer.routes')(app);
require('./app/routes/fileCsv.routes')(app);
require('./app/routes/wishlist.routes')(app);
require('./app/routes/transaction.routes')(app);
require('./app/routes/particularFinancialSummary.routes')(app);
require('./app/routes/transaction.routes')(app);

sessionChecker.closeExpiredSessions();

const port = process.env.PORT || 8082;
app.listen(port, () => {
  console.log(`Serveur is running on port ${port}`);
});