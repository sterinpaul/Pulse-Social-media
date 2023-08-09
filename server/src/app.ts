import express,{Application} from 'express';
import http from 'http';
import routes from './framework/webServer/routes';
import connectDB from './framework/database/mongoDB/connection/connection';
import serverConfig from './framework/webServer/server';
import expressConfig from './framework/webServer/express';
import {v2 as cloudinary} from 'cloudinary';

const app:Application = express();
const server = http.createServer(app);


// MongoDB connection
connectDB()

// Middleware configuration
expressConfig(app)

cloudinary.config({
    cloud_name: 'pulse-socialmedia', 
    api_key: '615616133356435', 
    api_secret: 'rfWuVkJzxUhlsMJhncX4zUSWWMA' 
})

routes(app)

// adding public folder as static file
// app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));


// Start the server
serverConfig(server)
