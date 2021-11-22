import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MultiPlayRoute extends Route {
  @service router;
  @service socket;
  @service state;
  @service user;

  async model({ play_id }) {
    console.log("wooop")
    this.socket.room = play_id;
    await this.state.connect(play_id);

    return play_id;
  }

  activate() {
    this._onRoomSync = () => {
      if (!this.socket.room) {
        return;
      }

      if (this.state.over === true) {
        this.router.replaceWith('game.over');

        return;
      }
      this.router.replaceWith(
        this.state.cards.length > 0 ? 'multi' : 'multi.play.lobby'
      );
    };
    console.log("activate route")
    this.socket.subscribe('room.sync', this._onRoomSync);
  }

  deactivate() {
    this.socket.unsubscribe('room.sync', this._on );
  }
}
