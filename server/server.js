const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connect = require('./db/config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');



app.get('/test', (req, res) => {
    res.send('success');
  });


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(authRoutes);
app.use(userRoutes);

  connect();

  app.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
});