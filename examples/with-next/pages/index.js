import React from 'react'; // make next errors go away
import Federal, { connect } from 'federal';

import AddForm from '../components/AddForm';

const Page = ({ items }) => (
  <div>
    <h1>Current list</h1>

    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>

    <AddForm />

    <style jsx="true">{`
      h1 {
        font-size: 26px;
        color: blue;
        display: block;
        margin-bottom: 26px;
      }
    `}</style>
  </div>
);

const selector = store => ({
  items: store.items
});

const ConnectedPage = connect(selector)(Page);

const initialStore = {
  items: ['Apples', 'Bananas']
};

export default () => (
  <Federal store={initialStore}>
    <ConnectedPage />
  </Federal>
);
