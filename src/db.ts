import { RoomType, playerType } from './types';
import WebSocket from 'ws';

class DB {
  #players: Map<WebSocket, playerType>;
  #userIndex;
  #roomIndex;
  #rooms: RoomType[];
  constructor() {
    this.#players = new Map();
    this.#userIndex = 0;
    this.#roomIndex = 0;
    this.#rooms = [];
  }

  addPlayer(login: string, ws: WebSocket) {
    const user = { name: login, index: this.#userIndex };
    if (!this.#players.has(ws)) this.#players.set(ws, user);
    return this.#userIndex++;
  }

  getRooms() {
    console.log(JSON.stringify(this.#rooms, null, 2));
    return this.#rooms;
  }

  addRoom(ws: WebSocket) {
    const user = this.#players.get(ws);
    if (user)
      this.#rooms.push({
        roomId: this.#roomIndex++,
        roomUsers: [
          {
            ...user,
          },
        ],
      });
  }
}

export default DB;
