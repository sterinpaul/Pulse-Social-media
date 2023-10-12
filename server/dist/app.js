"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const routes_1 = __importDefault(require("./framework/webServer/routes"));
const connection_1 = __importDefault(require("./framework/database/mongoDB/connection/connection"));
const server_1 = __importDefault(require("./framework/webServer/server"));
const express_2 = __importDefault(require("./framework/webServer/express"));
const cloudinary_1 = require("cloudinary");
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./framework/webSocket/socket"));
const config_1 = require("./config");
// import errorHandler from './framework/webserver/middlewares/errorHandler';
// import AppError from './utilities/appError';
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Socket CORS config
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [config_1.configKeys.CLIENT_URL],
        methods: ['GET', 'POST']
    }
});
// Socket.io connection
(0, socket_1.default)(io);
// Peer connection
// const peerServer = PeerServer({port:3001,path:'myapp'})
// app.use("/peerjs", peerServer)
// MongoDB connection
(0, connection_1.default)();
// Middleware configuration
(0, express_2.default)(app);
cloudinary_1.v2.config({
    cloud_name: 'pulse-socialmedia',
    api_key: '615616133356435',
    api_secret: 'rfWuVkJzxUhlsMJhncX4zUSWWMA'
});
(0, routes_1.default)(app);
// adding public folder as static file
// app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
// Error handling
// app.use(errorHandler);
// Catch error
// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//     next(new AppError('Not found', HttpStatus.UNAUTHORIZED));
// });
// Start the server
(0, server_1.default)(server);
