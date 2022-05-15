import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

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

export default class PlayingfieldComponent extends Component {
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
  @tracked highscores = [];
  @tracked isHighScore = false;

  get hasSet() {
    const combinations = this.k_combinations(this.field, 3);
    let foundSet = combinations.find((comb) => this.isSet(...comb));
    if (foundSet) {
      return true;
    } else {
      return false;
    }
  }

  get isWon() {
    return this.isStarted && this.cards.length == 0 && !this.hasSet;
  }

  get noHighScore() {
    return this.highscores.indexOf(this.finishTime) + 1;
  }

  getDeck() {
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

  getSimpleDeck() {
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

  isSet(a, b, c) {
    return (
      this.validateProps(a.shape, b.shape, c.shape) &&
      this.validateProps(a.amount, b.amount, c.amount) &&
      this.validateProps(a.filling, b.filling, c.filling) &&
      this.validateProps(a.color, b.color, c.color)
    );
  }

  validateProps(a, b, c) {
    return (a === b && b === c) || (a !== b && a !== c && b !== c);
  }

  k_combinations(set, k) {
    var i, j, combs, head, tailcombs;
    if (k > set.length || k <= 0) {
      return [];
    }
    if (k == set.length) {
      return [set];
    }
    if (k == 1) {
      combs = [];
      for (i = 0; i < set.length; i++) {
        combs.push([set[i]]);
      }
      return combs;
    }
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
      head = set.slice(i, i + 1);
      tailcombs = this.k_combinations(set.slice(i + 1), k - 1);
      for (j = 0; j < tailcombs.length; j++) {
        combs.push(head.concat(tailcombs[j]));
      }
    }
    return combs;
  }

  getRandomCard(cards) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    let randomCard = cards[randomIndex];
    cards.splice(randomIndex, 1);
    return { rc: randomCard, cards: cards };
  }

  getCards(amount) {
    let drawn = [];
    for (let i = 1; i <= amount; i++) {
      let { rc, cards } = this.getRandomCard(this.cards);
      drawn.push(rc);
      this.cards = cards;
    }
    return drawn;
  }

  updateHighScores() {
    if (this.highscores.length < 5) {
      this.highscores = [...this.highscores, this.finishTime].sort(
        (a, b) => a > b
      );
      this.isHighScore = true;
    } else if (this.finishTime < this.highscores[4]) {
      this.highscores.pop();
      this.highscores = [...this.highscores, this.finishTime].sort(
        (a, b) => a > b
      );
      this.isHighScore = true;
    }
    localStorage.setItem('highscores', JSON.stringify(this.highscores));
  }

  @action clearHighScores() {
    localStorage.clear();
    this.highscores = [];
  }

  checkPotentialSet() {
    const picked = this.field.filter((c) => c.selected);
    this.selected = [];
    if (this.isSet(...picked)) {
      if (this.cards.length > 0 && this.field.length <= 12) {
        this.field = this.field.map((c) => {
          if (c.selected) {
            return this.getCards(1)[0];
          } else {
            return c;
          }
        });
      } else {
        this.field = this.field.filter((c) => !c.selected);
      }
      while (!this.hasSet && this.cards.length > 0) {
        this.field = [...this.field, ...this.getCards(3)];
      }
      if (this.isWon) {
        this.finishTime = this.time;
        this.updateHighScores();
      }
      this.count += 1;
      this.hintsActive = 0;
    } else {
      picked.forEach((p) => {
        p.wrong = true;
        setTimeout(() => {
          p.wrong = false;
        }, 820);
      });
      this.field.forEach((card) => (card.selected = false));
    }
  }

  @action startGame() {
    if (this.args.easy) {
      this.cards = this.getSimpleDeck();
      this.field = [...this.getCards(9)];
      while (!this.hasSet) {
        this.cards = this.getSimpleDeck();
        this.field = [...this.getCards(9)];
      }
    } else {
      this.cards = this.getDeck();
      this.field = [...this.getCards(12)];
      while (!this.hasSet) {
        this.cards = this.getDeck();
        this.field = [...this.getCards(12)];
      }
    }
    this.startTime = Date.now();
    this.hintCounter = 0;
    this.hintsActive = 0;
    this.count = 0;
    this.isHighScore = false;
    this.timerTask.perform();
    this.isStarted = true;
    let highscoresString = localStorage.getItem('highscores');
    this.highscores = JSON.parse(highscoresString)?.sort((a, b) => a > b) ?? [];
  }

  @action selectCard(id) {
    if (this.selected.includes(id)) {
      this.selected.splice(this.selected.indexOf(id), 1);
      this.field.find((x) => x.image === id).selected = false;
    } else {
      this.selected.push(id);
      this.field.find((x) => x.image === id).selected = true;
    }
    if (this.selected.length === 3) {
      this.checkPotentialSet();
    }
    this.field = [...this.field];
  }

  @action getHint() {
    const combinations = this.k_combinations(this.field, 3);
    let foundSet = combinations.find((comb) => this.isSet(...comb));
    foundSet[Math.floor(Math.random() * 3)].hint = true;
    if (this.hintsActive < 3) {
      this.hintCounter++;
      this.hintsActive++;
    }
  }

  @task *timerTask() {
    while (true) {
      yield new Promise((resolve) => setTimeout(resolve, 1000));
      this.time = Math.floor((Date.now() - this.startTime) / 1000);
    }
  }
}
