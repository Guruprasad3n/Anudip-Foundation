const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('📊 Welcome to the PEARL API - Target Planning & Tracking System');
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: '🔍 API route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// const express = require('express');
// const cors = require('cors');
// const routes = require('./routes/routes');

// const app = express();
// const PORT = 3000;

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Welcome to the API');
// });

// app.use('/api', routes);

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });



// Example route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Node + Express + MySQL API!');
// });

// Example: Get all rows from a table
// app.get('/data', (req, res) => {

//   const getTablesQuery = `SHOW TABLES`;
//   const databaseName = 'anudip_cmis';
//   const key = `Tables_in_${databaseName}`;
//   db.query(getTablesQuery, async (err, tables) => {
//     if (err) {
//       console.error('Error fetching tables:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }

//     let allData = {};
//     try {
//       await Promise.all(
//         tables.map((tableObj) => {
//           const tableName = tableObj[key];
//           return new Promise((resolve, reject) => {
//             db.query(`SELECT * FROM \`${tableName}\`LIMIT 100`, (err, rows) => {
//               if (err) {
//                 reject(err);
//               } else {
//                 allData[tableName] = rows;
//                 resolve();
//               }
//             });
//           });
//         })
//       );

//       res.json(allData);
//     } catch (queryErr) {
//       console.error('Error querying tables:', queryErr);
//       res.status(500).json({ error: 'Error retrieving table data' });
//     }

//   });
// });