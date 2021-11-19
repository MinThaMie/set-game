import Service, { inject as service } from '@ember/service';
import { nanoid } from 'nanoid';

export default class UserService extends Service {
  @service state;

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  set name(value) {
    this.data = {
      ...this.data,
      name: value,
    };
  }

  create() {
    if (this.data.id) {
      return;
    }

    this.data = {
      id: nanoid(),
      name: '',
    };
  }

  restore() {
    this.create();
  }

  get data() {
    return JSON.parse(window.localStorage.getItem('decknamen.user') || '{}');
  }

  set data(value) {
    window.localStorage.setItem(
      'decknamen.user',
      JSON.stringify({
        ...this.user,
        ...value,
      })
    );
  }
}
