import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class Card {
  shape;
  amount;
  filling;
  color;
  image;
  @tracked selected = false;
  @tracked wrong = false;
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
let cards = [];

function getDeck() {
  for (let s in shapes) {
    for (let a in amount) {
      for (let f in fillings) {
        for (let c in colors) {
          let card = new Card({ s, a, f, c });
          cards.push(card);
        }
      }
    }
  }
}

function isSet(a, b, c) {
  return (
    validateProps(a.shape, b.shape, c.shape) &&
    validateProps(a.amount, b.amount, c.amount) &&
    validateProps(a.filling, b.filling, c.filling) &&
    validateProps(a.color, b.color, c.color)
  );
}

function validateProps(a, b, c) {
  return (a === b && b === c) || (a !== b && a !== c && b !== c);
}

function k_combinations(set, k) {
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
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

function getRandomCard() {
  const randomIndex = Math.floor(Math.random() * cards.length);
  let randomCard = cards[randomIndex];
  cards.splice(randomIndex, 1);
  return randomCard;
}

export default class PlayingfieldComponent extends Component {
  @tracked count = 0;
  @tracked isStarted = false;
  @tracked isWon = false;
  @tracked field = [];
  @tracked selected = [];

  get hasSet() {
    const combinations = k_combinations(this.field, 3);
    let foundSet = combinations.find((comb) => isSet(...comb));
    if (foundSet) {
      return true;
    } else {
      return false;
    }
  }

  @action startGame() {
    this.isStarted = true;
    this.isWon = false;
    this.field = [];
    getDeck();
    for (let i = 1; i <= 12; i++) {
      this.field.push(getRandomCard());
    }
    this.field = this.field;
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
      const picked = this.field.filter((c) => c.selected);
      this.selected = [];
      const isValidSet = isSet(...picked);
      if (isValidSet) {
        this.field = this.field.filter((c) => !c.selected);
        if (cards.length > 0 && this.field.length < 12) {
          for (let i = 1; i <= 3; i++) {
            this.field.push(getRandomCard());
          }
        }
        if (!this.hasSet && cards.length > 0) {
          for (let i = 1; i <= 3; i++) {
            this.field.push(getRandomCard());
          }
        }
        if (cards.length == 0) {
          this.isWon = true;
        }
        this.count += 3;
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
    this.field = [...this.field];
  }
}
