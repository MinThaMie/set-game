import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import GameState from '../utils/game-state';

class Card {
  shape;
  amount;
  filling;
  color;
  image;
  @tracked selected = false;
  @tracked wrong = false;
  @tracked hint = false;
  constructor({ s, a, f, c }) {
    this.shape = s;
    this.amount = a;
    this.filling = f;
    this.color = c;
    this.image = `images/${s}${a}${f}_${c}.svg`;
  }
}

const colors = {
  red: 'red',
  green: 'green',
  purple: 'purple',
};
const fillings = {
  solid: 'solid',
  half: 'half',
  empty: 'empty',
};
const shapes = {
  diamond: 'diamond',
  oval: 'oval',
  wave: 'wave',
};
const amount = {
  1: 1,
  2: 2,
  3: 3,
};

export function getDeck() {
  let deck = [];
  for (let s in shapes) {
    for (let a in amount) {
      for (let f in fillings) {
        for (let c in colors) {
          let card = new Card({ s, a, f, c });
          deck.push(card);
        }
      }
    }
  }
  return deck;
}

export function getSimpleDeck() {
  let deck = [];
  for (let s in shapes) {
    for (let a in amount) {
      for (let c in colors) {
        let card = new Card({ s, a, f: 'solid', c });
        deck.push(card);
      }
    }
  }
  return deck;
}

export class StateService extends Service {
  @service user;
  @service router;
  @service socket;

  @tracked current = null;

  @task(function* () {
    const response = yield this.socket.roomSync(this.current.serialize());

    this.current = this.current.merge(response);
  })
  syncTask;

  async connect(room) {
    console.log("state connect")
    try {
      await this.socket.connect(room);
    } catch (err) {
      console.error('Error connecting', err);
    }
    //TODO: this does not resolve
    const data = await this.socket.roomRead();
    console.log(data, "in state")
    this.current = new GameState(data);
    this.assignPlayer();

    await this.syncTask.perform();

    this.subscribe();
  }

  subscribe() {
    this.socket.subscribe('room.sync', (data) => {
      console.log(date, "subscribe state")
      if (!data) {
        return;
      }

      this.current = this.current.merge(data);
      console.log(this.current, this.player, "statejs")
      if (!this.player) {
        this.current = null;
        this.socket.room = undefined;
        this.router.transitionTo('index');

        return;
      }
    });

    this.socket.primus.on('reconnected', () => {
      this.reconnect();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        return;
      }

      this.reconnect();
    });
  }

  async reconnect() {
    await this.socket.joinRoom();

    const response = await this.socket.roomRead();
    this.current = this.current.merge(response);
  }

  assignPlayer() {
    // Skip player assignment if the game has started
    if (this.cards.length > 0) {
      return;
    }
    console.log(this.user.data, "assign player")
    this.current.updatePlayer({...this.user.data});
  }

  async updatePlayer(player) {
    console.log(player, "update player state")
    this.current.updatePlayer(player);

    await this.syncTask.perform();
  }

  async kickPlayer(playerId) {
    this.current.removePlayer(playerId);
    this.syncTask.perform();
  }

  async startGame() {
    const cards = getDeck();

    this.current.cards.push(cards);

    this.syncTask.perform();
  }

  async changeCard() {
    console.log('Do something');
    return this.syncTask.perform();
  }

  async reset() {
    this.current.reset();
    await this.syncTask.perform();
  }
}

export default class GameStateService extends StateService {
  get player() {
    return this.current?.getPlayer(this.user.id);
  }

  get players() {
    return this.current?.players ?? [];
  }

  get cards() {
    return this.current?.cards ?? [];
  }

  get canStartGame() {
    return this.players && this.cards.length === 0;
  }

  get hasSet() {
    const combinations = this.k_combinations(this.field, 3);
    let foundSet = combinations.find((comb) => this.isSet(...comb));
    if (foundSet) {
      return true;
    } else {
      return false;
    }
  }

  get over() {
    return this.cards.length > 0 && !this.hasSet;
  }

  get statistics() {
    console.log('Stats');
  }
}
