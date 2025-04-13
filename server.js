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
      console.log("invited: " + invitation.to);
      io.emit("invitation", invitation);
    });

    // reply -> {answer: 'yes' or 'no'} -> either the invited player declines the game or plays the game
    socket.on("replyToInvitation", (reply) => {
        console.log("replied to invitation with: " + reply);
        io.emit("replyToInvitation", reply)
    })
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
