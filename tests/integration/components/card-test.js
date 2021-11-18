import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Render unselected card:
    await render(hbs`
      <Card @image="images/diamond1solid_green.svg" @selected={{false}} @wrong={{false}} @hint={{false}}/>
    `);
    let img = this.element.querySelector('img');
    assert.dom(img).hasAttribute('src', 'images/diamond1solid_green.svg');
  });

  test('it replaces hint styling with selected styling', async function (assert) {
    // Render selected card that is hinted
    await render(hbs`
     <Card @image="images/diamond1solid_green.svg" @selected={{true}} @wrong={{false}} @hint={{true}}/>
   `);
    let img = this.element.querySelector('img');
    assert.dom(img).hasStyle({
      border: '3px solid rgb(255, 165, 0)',
    });
  });
});
