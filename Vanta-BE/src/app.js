require('dotenv').config();
const express = require('express');
const app = express();
const { connect_db } = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const cors = require("cors");

app.use(
  cors({
  origin : "http://localhost:5173",
  credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


 

connect_db().then(() => {
  console.log("connection Established.");
  const Port = process.env.PORT;
  app.listen(Port, ()=>{
    console.log(`Server is listening on ${Port}`);
  })
}).catch((error) => {
  console.error("DataBase does not connected");
});