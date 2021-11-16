import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | easy', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:easy');
    assert.ok(route);
  });
});
