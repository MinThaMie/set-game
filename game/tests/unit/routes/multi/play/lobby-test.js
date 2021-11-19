import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | multi/play/lobby', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:multi/play/lobby');
    assert.ok(route);
  });
});
