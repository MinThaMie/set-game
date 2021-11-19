import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | playingfield', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<Playingfield />`);
    assert.dom(this.element).includesText('You have not started a game');
  });

  test('it starts on click', async function (assert) {
    await render(hbs`<Playingfield />`);
    await click('[data-test-startbutton]');
    // await this.pauseTest();
    assert.dom('[data-test-card]').exists({ count: 12 });
  });

  test('it starts with 9 cards when easy', async function (assert) {
    await render(hbs`<Playingfield @easy={{true}} />`);
    await click('[data-test-startbutton]');
    assert.dom('[data-test-card]').exists({ count: 9 });
  });

  test('hints work', async function (assert) {
    await render(hbs`<Playingfield />`);
    await click('[data-test-startbutton]');
    assert.dom(this.element).includesText('used 0 hints');
    await click('[data-test-hint]');
    assert.dom(this.element).includesText('used 1 hints');
    await click('[data-test-hint]');
    assert.dom(this.element).includesText('used 2 hints');
    await click('[data-test-hint]');
    assert.dom(this.element).includesText('used 3 hints');
    // The counter does not increase after three and so removed set
    await click('[data-test-hint]');
    assert.dom(this.element).includesText('used 3 hints');
  });
});
