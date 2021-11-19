import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CardComponent extends Component {
  @action
  handleClick() {
    this.args.onSelect?.(...arguments);
  }
}
