import WebSocket from 'ws';
import DB from './db';
import { RegDataType } from './types';
import { sendMessage } from './sendMessage';

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

    const data = {
      name: innerData.name,
      index,
      error: false,
      errorText: '',
    };

    sendMessage(webSocket, 'reg', data)

    this.updateRoom();
  }

  createRoom() {
    this.#db.addRoom(webSocket);
    this.updateRoom();
  }

  updateRoom() {
    sendMessage(webSocket, 'update_room', this.#db.getRooms())
  }

  createGame(index: string | number) {
    const room = this.#db.getRoom(index);
    const firstUser = this.#db.getUserByIndex(room[0].index);
    const secondUser = this.#db.getUser(webSocket);
    const data = {
            idGame: this.#db.getGameIndex(),  
            idPlayer: secondUser?.index,
        }

    const dataSecondUser = {
            idGame: 0,  
            idPlayer: firstUser[1],
        };

    sendMessage(webSocket, 'create_game', data);
    sendMessage(firstUser[0] as WebSocket, 'create_game', dataSecondUser);


    this.#db.removeRoom(index);
    this.updateRoom();
  }
}

export default WSController;
