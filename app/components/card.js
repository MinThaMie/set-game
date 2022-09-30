import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CardComponent extends Component {
  @action
  handleClick() {
    this.args.onSelect?.(...arguments);
  }
  get times() {
    let array = [];
    for (let i = 0; i < this.args.amount; i++) {
      array.push(i);
    }
    return array;
  }
  get isWave() {
    return this.args.shape == 'wave';
  }
  get isOval() {
    return this.args.shape == 'oval';
  }
  get isDiamond() {
    return this.args.shape == 'diamond';
  }
  get isEmpty() {
    return this.args.filling == 'empty';
  }
  get isHalf() {
    return this.args.filling == 'half';
  }
  get isSolid() {
    return this.args.filling == 'solid';
  }
}
