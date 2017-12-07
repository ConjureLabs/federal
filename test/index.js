import 'jsdom-global/register'; // for enzyme .mount to work

import React, { Component } from 'react';
import { test } from 'ava';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Federal, { connect } from '../dist/federal';

Enzyme.configure({
  adapter: new Adapter()
});

test('<Federal /> should render children', t => {
  const content = shallow(
    <Federal>
      <div>hello world</div>
    </Federal>
  );

  t.true(content.contains(<div>hello world</div>));
});

test('connect() should carry down store attributes', t => {
  const initialStore = {
    a: 'x',
    b: 'y',
    c: 'z'
  };

  const ConnectedChild = connect(store => store)(
    ({ a, b, c }) => (<div id='child'>{c}{b}{a}</div>)
  );

  const content = mount(
    <Federal store={initialStore}>
      <ConnectedChild />
    </Federal>
  );

  t.true(content.find('#child').text() === 'zyx');
});
