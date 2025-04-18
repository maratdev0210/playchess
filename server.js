import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("invitation", (invitation) => {
      console.log(`${invitation.from} invited ${invitation.to} to a game!`);
      //io.emit("invitation", invitation);
      socket.broadcast.emit("invitation", invitation);
    });

    // reply -> {answer: 'yes' or 'no'} -> either the invited player declines the game or plays the game
    socket.on("replyToInvitation", (reply) => {
      socket.broadcast.emit("replyToInvitation", reply);
    });

    // chess moves
    socket.on("whiteMove", (move) => {
      console.log("white made a move!");
      socket.broadcast.emit("whiteMove", move);
    });

    socket.on("blackMove", (move) => {
      console.log("black made a move");
      socket.broadcast.emit("blackMove", move);
    });

    socket.on("resignation", (from) => {
      console.log(`${from} has resigned!`);
      socket.emit("resignation", from);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
