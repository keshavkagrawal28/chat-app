const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./route/userRoute');
const chatRoute = require('./route/chatRoute');
const messageRoute = require('./route/messageRoute');

const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

app.get('/', (req, res) => {
  res.status(200).send('Welcome to our chat App APIs');
});

const port = process.env.port || 3200;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`server running on port: ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB eonnection established'))
  .catch((error) => console.log('MongoDB connection failed', error));
