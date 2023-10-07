import express,{Application} from 'express';
import http from 'http';
import routes from './framework/webServer/routes';
import connectDB from './framework/database/mongoDB/connection/connection';
import serverConfig from './framework/webServer/server';
import expressConfig from './framework/webServer/express';
import {v2 as cloudinary} from 'cloudinary';
import {Server} from 'socket.io';
import socketConfig from './framework/webSocket/socket'
import { configKeys } from './config';
// import errorHandler from './framework/webserver/middlewares/errorHandler';
// import AppError from './utilities/appError';


const app:Application = express()
const server = http.createServer(app)

// Socket CORS config
const io = new Server(server,{
    cors:{
        origin: configKeys.SOCKET_SERVER,
        methods:['GET','POST']
    }
})

// Socket.io connection
socketConfig(io)


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



// Error handling
// app.use(errorHandler);



// Catch error
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//     next(new AppError('Not found', HttpStatus.UNAUTHORIZED));
// });



// Start the server
serverConfig(server)
