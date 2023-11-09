"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let activeUsers = [];
const socketConfig = (io) => {
    io.on('connection', (socket) => {
        // socket.emit('me',socket.id)
        // Socket.IO connection event: This function is executed when a new client connects to the server.
        socket.on('add-new-user', (newUserId) => {
            // Event handler for "add-new-user" event: Adds a new user to the list of active users.
            if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({ userId: newUserId, socketId: socket.id });
                console.log(`new user connected: ${newUserId}, ${socket.id}`);
            }
            io.emit('get-users', activeUsers);
        });
        socket.on('send-message', (data) => {
            const { receiverId } = data;
            const user = activeUsers.find((user) => user.userId === receiverId);
            if (user) {
                io.to(user.socketId).emit('notification', data);
                io.to(user.socketId).emit('receive-message', data);
            }
        });
        socket.on('block-user', (userId) => {
            const user = activeUsers.find((user) => user.userId === userId);
            if (user) {
                io.to(user.socketId).emit('user-blocked');
            }
        });
        socket.on('initialize-call', data => {
            const user = activeUsers.find((user) => user.userId === data.chatUserId);
            if (user) {
                io.to(user.socketId).emit('offer-received', data);
            }
        });
        socket.on('call-accepted', data => {
            const user = activeUsers.find((user) => user.userId === data.userId);
            if (user) {
                io.to(user.socketId).emit('offer-accepted', data.peerId);
            }
        });
        socket.on('another-call', id => {
            const user = activeUsers.find((user) => user.userId === id);
            if (user) {
                io.to(user.socketId).emit('another-caller');
            }
        });
        socket.on('cancel-call', id => {
            const user = activeUsers.find((user) => user.userId === id);
            if (user) {
                io.to(user.socketId).emit('call-cancelled');
            }
        });
        socket.on('call-started', (data) => {
            const { roomId, chatUserId } = data;
            const user = activeUsers.find((user) => user.userId === chatUserId);
            if (user) {
                io.to(user.socketId).emit('call-received', data);
            }
        });
        const rooms = {};
        socket.on('join-room', roomId => {
            if (rooms[roomId]) {
                rooms[roomId].push(socket.id);
            }
            else {
                rooms[roomId] = [socket.id];
            }
            const otherUser = rooms[roomId].find((id) => id !== socket.id);
            if (otherUser) {
                socket.emit('other-user', otherUser);
                socket.to(otherUser).emit('user-joined', socket.id);
            }
        });
        socket.on('disconnect', () => {
            socket.broadcast.emit('call-ended');
            // Event handler for "disconnect" event: Removes a user from the active users list when they disconnect.
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            console.log(`user disconnected: ${socket.id}`);
            io.emit("get-users", activeUsers);
        });
    });
};
exports.default = socketConfig;
