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
        case "add_user_to_room":
            this.createGame(innerData.indexRoom);
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

  createGame(index: string | number) {
    const room = this.#db.getRoom(index);
    const firstUser = this.#db.getUserByIndex(room[0].index);
    const secondUser = this.#db.getUser(webSocket);

    webSocket.send(
      JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({
            idGame: this.#db.getGameIndex(),  
            idPlayer: secondUser?.index,
        }),
        id: 0,
      }),
    );

    (firstUser[0] as WebSocket).send(
      JSON.stringify({
        type: 'create_game',
        data: JSON.stringify({
            idGame: 0,  
            idPlayer: firstUser[1],
        }),
        id: 0,
      }),
    );

    this.#db.removeRoom(index);
    this.updateRoom();
  }
}

export default WSController;
