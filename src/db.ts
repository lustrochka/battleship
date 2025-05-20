import { RoomsType, playerType } from './types';
import WebSocket from 'ws';

class DB {
  #players: Map<WebSocket, playerType>;
  #userIndex;
  #roomIndex;
  #gameIndex: number;
  #rooms: RoomsType;
  constructor() {
    this.#players = new Map();
    this.#userIndex = 0;
    this.#roomIndex = 0;
    this.#gameIndex = 0;
    this.#rooms = {};
  }

  addPlayer(login: string, ws: WebSocket) {
    const user = { name: login, index: this.#userIndex };
    if (!this.#players.has(ws)) this.#players.set(ws, user);
    return this.#userIndex++;
  }

  getRooms() {
    return Object.keys(this.#rooms).map((key) => ({roomId: key, roomUsers: this.#rooms[key]}))
  }

  getRoom(index: string | number) {
    return this.#rooms[index];
  }

  getUser(ws: WebSocket) {
    return this.#players.get(ws);
  }

  getGameIndex() {
    return this.#gameIndex++
  }

  getUserByIndex(index: string | number) {
    const result = [];
    for (const entry of this.#players) {
      if (entry[1].index == index) {
        result.push(entry[0], entry[1].index)
      }
    }

    return result;
  }

  addRoom(ws: WebSocket) {
    const user = this.#players.get(ws);
    if (user)
      this.#rooms[this.#roomIndex++] = [user]
  }

  removeRoom(index: number | string) {
    delete this.#rooms[index];
  }
}

export default DB;
