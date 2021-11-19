import _merge from 'lodash-es/merge';
// import { TrackedMap } from 'tracked-built-ins';
import { tracked } from '@glimmer/tracking';

const mergeIntoNewObject = (...args) => _merge({}, ...args);

export default class GameState {
  @tracked _players = [];

  @tracked count = 0;
  @tracked isStarted = false;
  @tracked field = [];
  @tracked selected = [];
  @tracked cards = [];
  @tracked time = 0;
  @tracked startTime = 0;
  @tracked finishTime = 0;
  @tracked hintCounter = 0;
  @tracked hintsActive = 0; // Max 3 since a set contains 3 cards

  constructor(data) {
    const players = data?.players !== undefined ? [...data.players] : [];
    const cards = data?.cards !== undefined ? [...data.cards] : [];
    const field = data?.field !== undefined ? [...data.field] : [];

    this._players = [...players];
    this.cards = cards;
    this.field = field;
  }

  get players() {
    return [...this._players.values()];
  }

  get cards() {
    return this._cards;
  }

  getPlayer(id) {
    return this._players.get(id);
  }

  updatePlayer(data) {
    if (!data) {
      return;
    }

    this._players.set(
      data.id,
      mergeIntoNewObject(this._players.get(data.id) || {}, data)
    );
  }

  removePlayer(id) {
    this._players.delete(id);
  }

  merge(state) {
    if (!state) {
      return;
    }

    this.cards = state.cards;
    this.field = state.field;

    this._players.clear();
    state.players?.forEach(([, player]) => {
      this.updatePlayer(player);
    });

    return this;
  }

  serialize() {
    return {
      players: [...this._players.entries()],
      cards: this.cards,
      field: this.field,
    };
  }

  reset() {
    this.cards = [];
    this.field = [];
  }
}
