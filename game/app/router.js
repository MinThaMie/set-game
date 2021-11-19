import EmberRouter from '@ember/routing/router';
import config from 'set-game/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('instructions');
  this.route('play');
  this.route('easy');
  this.route('multi', function () {
    this.route('play', { path: '/play/:play_id' }, function () {
      this.route('lobby');
    });
  });
});
