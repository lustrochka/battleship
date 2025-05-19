import WebSocket from 'ws';
import DB from './db';
import { RegDataType } from './types';

let webSocket: WebSocket;

class WSController {
  #db;
  constructor() {
    this.#db = new DB();
  }

  chooseAction(message: WebSocket.RawData, socket: WebSocket) {
    webSocket = socket;
    try {
      const parsedMsg = JSON.parse(message.toString());
      const innerData = JSON.parse(parsedMsg.data || '{}');

      switch (parsedMsg.type) {
        case 'reg':
          this.register(innerData);
          break;
        case 'create_room':
          this.createRoom();
          break;
      }
    } catch (e) {
      console.error('error while parsing JSON:', e);
    }
  }

  register(innerData: RegDataType) {
    const index = this.#db.addPlayer(innerData.name, webSocket);

    const data = JSON.stringify({
      name: innerData.name,
      index,
      error: false,
      errorText: '',
    });

    webSocket.send(
      JSON.stringify({
        type: 'reg',
        data,
        id: 0,
      }),
    );

    this.updateRoom();
  }

  createRoom() {
    this.#db.addRoom(webSocket);
    this.updateRoom();
  }

  updateRoom() {
    webSocket.send(
      JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(this.#db.getRooms()),
        id: 0,
      }),
    );
  }
}

export default WSController;
