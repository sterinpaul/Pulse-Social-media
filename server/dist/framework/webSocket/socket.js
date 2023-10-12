"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let activeUsers = [];
const socketConfig = (io) => {
    io.on('connection', (socket) => {
        socket.emit('me', socket.id);
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
            console.log(`Sending message to ${receiverId}`);
            if (user) {
                io.to(user.socketId).emit('notification', data);
                io.to(user.socketId).emit('receive-message', data);
            }
        });
        socket.on('call-started', (data) => {
            const { roomId, chatUserId } = data;
            const user = activeUsers.find((user) => user.userId === chatUserId);
            if (user) {
                io.to(user.socketId).emit('call-received', data);
            }
        });
        socket.on('join-room', (roomId, userId) => {
            console.log('roomId and userId', roomId, userId);
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
            // socket.to(userId).emit('user-connected',roomId)
        });
        socket.on('call-user', (data) => {
            io.to(data.userToCall).emit('call-user', { signal: data.signalData, from: data.from, name: data.name });
        });
        socket.on('answer-call', (data) => {
            io.to(data.to).emit('call-accepted', data.signal);
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
