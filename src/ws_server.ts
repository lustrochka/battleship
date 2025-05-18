import { WebSocketServer } from 'ws';
import DB from './db';

class WsServer {
  #server;
  #db;
  constructor() {
    this.#server = new WebSocketServer({ port: 3000 });
    this.#db = new DB();
  }

  start() {
    this.#server.on('connection', (socket) => {
      socket.on('message', (message) => {
        console.log(message.toString());
        try {
          const parsedMsg = JSON.parse(message.toString());
          const innerData = JSON.parse(parsedMsg.data);

          if (parsedMsg.type === 'reg') {
            const data = JSON.stringify(innerData);

            socket.send(
              JSON.stringify({
                type: 'reg',
                data,
                id: 0,
              }),
            );

            this.#db.addPlayer(innerData.name, innerData.password);
          }
        } catch (e) {
          console.error('error while parsing JSON:', e);
        }
      });

      socket.on('close', () => {
        console.log('Клиент отключился');
      });
    });
  }
}

export default WsServer;
