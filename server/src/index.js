import { app } from './app.js'
import connectDB from './db/database.js'
import dotenv from 'dotenv'

dotenv.config({
    path: './env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`🤖 Server listening at PORT : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MONGO DB CONNECTION FAILED", error);
})