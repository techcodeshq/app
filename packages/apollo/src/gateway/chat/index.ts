import { Server } from "socket.io";
import { Events } from "./events";

export const chatGateway = (io: Server) => {
  const chat = io.of("/chat");

  chat.on("connection", (socket) => {
    socket.on(Events.JOIN_ROOM, (id: string) => {
      socket.join(id);
    });
  });

  return chat;
};
