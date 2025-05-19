import { WebSocketServer } from 'ws';
import WSController from './ws_controller';

class WsServer {
  #server;
  #controller;

  constructor() {
    this.#server = new WebSocketServer({ port: 3000 });
    this.#controller = new WSController();
  }

  start() {
    this.#server.on('listening', () => {
      console.log('WebSocket server is listening on port 3000');
    });

    this.#server.on('connection', (socket) => {
      console.log('aaaaaaaa');
      socket.on('message', (message) => {
        console.log(message.toString());
        this.#controller.chooseAction(message, socket);
      });

      socket.on('close', () => {
        console.log('Client disconnected');
      });
    });

    this.#server.on('close', () => {
        console.log('WebSocket server closed');
    });

    process.on('SIGINT', () => {
      console.log("SIGINT received");
      this.#server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.close(1001, 'Server is shutting down');
        }
      });

      this.#server.close(() => {
        console.log('WebSocket server closed');
        process.exit(0);
      });
    });
  }
}

export default WsServer;
