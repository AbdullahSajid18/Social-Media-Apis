import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'

const app = express(); 
const PORT = 8000;
dotenv.config()

// middleware  
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));


// calling Apis
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const connectDB = () => {
    mongoose
      .connect(process.env.Mongo_Url, { useNewUrlParser: true })
      .then(() => {
        console.log(`connected to db`);
      })
      .catch((err) => {
        throw err;
      });
  };




// just for sample

// app.get("/", (req ,res) => {
//     res.send("Welcome To HomePage")
// })
// app.get("/users", (req ,res) => {
//     res.send("Welcome To usersPage")
// })

app.listen(PORT, ()=>{
    connectDB()
    console.log('BackEnd Server Is Running!');
})