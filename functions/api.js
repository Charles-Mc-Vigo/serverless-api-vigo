const express = require('express');
const serverless = require('serverless-http');
const router = require('./routes/author');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose
  .connect(process.env.cloudDB || process.env.localDB)
  .then(()=> console.log('Connected to MongoDB'))
  .catch((error)=>console.error('Failed to connect to MongoDB'));

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);