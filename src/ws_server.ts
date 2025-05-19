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
    this.#server.on('connection', (socket) => {
      socket.on('message', (message) => {
        console.log(message.toString());
        this.#controller.chooseAction(message, socket);
      });

      socket.on('close', () => {
        console.log('Клиент отключился');
      });
    });
  }
}

export default WsServer;
