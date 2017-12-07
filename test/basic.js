import React from 'react';
import { test } from 'ava';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Federal from '../dist/federal';

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
