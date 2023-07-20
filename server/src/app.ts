import express,{Application} from 'express';
import path from 'path';
import http from 'http';
import connectDB from './framework/database/mongoDB/connection/connection';
import serverConfig from './framework/webServer/server';
import expressConfig from './framework/webServer/express';

const app:Application = express();
const server = http.createServer(app);


// MongoDB connection
connectDB()

// Middleware configuration
expressConfig(app)

// adding public folder as static file
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));


app.get('/',(req,res)=>{
    res.send("Hai Sterin...")
})

// Start the server
serverConfig(server)
