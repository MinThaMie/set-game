import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Render unselected card:
    await render(hbs`
      <Card @id="diamond2solid_green" @shape="diamond" @amount="2" @filling="solid" @color="green" @selected={{false}} @wrong={{false}} @hint={{false}}/>
    `);
    assert.dom('[data-test-card-diamond-solid]').exists({count: 2});

  });

  test('it replaces hint styling with selected styling', async function (assert) {
    // Render selected card that is hinted
    await render(hbs`
    <Card @id="diamond2solid_green" @shape="diamond" @amount="2" @filling="solid" @color="green" @selected={{true}} @wrong={{false}} @hint={{true}}/>
  `);
    assert.dom('[data-test-card]').hasStyle({
      border: '3px solid rgb(255, 165, 0)',
      borderWidth: '3px',
    });
  });
});
