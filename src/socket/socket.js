import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket"], 
});

socket.on("connect", () => {
    console.log("Connected to Socket.IO server with ID:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server.");
});







export default socket;
