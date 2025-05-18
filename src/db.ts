import { playersType } from './types';

class DB {
  #players: playersType;
  constructor() {
    this.#players = {};
  }

  addPlayer(login: string, password: string) {
    if (!(login in this.#players)) this.#players[login] = password;
  }
}

export default DB;
