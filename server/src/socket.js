import { Server } from "socket.io";

let io;

export const initializeSocket = (
  server
) => {
  io = new Server(server, {
    cors: {
      origin:
        process.env.CLIENT_URL ||
        "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(
      `Socket connected: ${socket.id}`
    );

    socket.on(
      "join-organization",
      (organizationId) => {
        socket.join(
          `organization:${organizationId}`
        );
      }
    );

    socket.on("disconnect", () => {
      console.log(
        `Socket disconnected: ${socket.id}`
      );
    });
  });

  return io;
};

export const emitToOrganization = (
  organizationId,
  event,
  data
) => {
  if (!io) return;

  io.to(
    `organization:${organizationId}`
  ).emit(event, data);
};