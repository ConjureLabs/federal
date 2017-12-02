# Federal

Minimalistic centralized React store

## Why?

Federal wraps your react components, creating a centralized data store. It's similar to [Redux](https://github.com/reactjs/react-redux), in a lot of ways.

Redux is great, and is often the right choice. But, sometimes it adds too much complexity to set up a simple page; As in [their todo list example](http://redux.js.org/docs/basics/ExampleTodoList.html), there's a main `index.js`, `actions/index.js`, `reducers/todo.js`, `reducers/visibilityFilter.js`, `reducers/index.js`, and finally the presentation components. All for a simple todo.

Federal takes the 'less is more' approach. In any file that uses Federal, you simply need to provide an intial store object, and an object of actions (e.g. `actions/index.js`). Then, you can `connect()` any component to the store, which will result in it receiving store `.props`, including `.props.dispatch` for each action method (e.g. `this.props.dispatch.setStatus('status')`).

## Setup

```bash
npm install --save federal
```

## Use

### Simple Example

This example uses Federal to wrap a page content with a centralized store, and then has a child component (`<Header />`) connect to the store, which allows it to render the user's name.

#### pages/dashboard/index.js

```jsx
import Federal from 'federal';
import Header from '../../components/Header';

// assume `account` is passed in as a prop
export default ({ account }) => {
  const initialStore = {
    account
  };

  return (
    <Federal store={initialStore}>
      <Header />
    </Federal>
  );
};
```

#### components/Header/index.js

```jsx
import { connect } from 'federal';

const Header = ({ account }) => (
  <header>
    <dl>
      <dt>User</dt>
      <dd>{account.name}</dd>
    </dl>
  </header>
);

// using `connect()` will bind `<Header />` to the full store object
export default connect()(Header);
```

### Selectors

Let's say the above example's `initialStore` changes to something like this:

```jsx
const initialStore = {
  account,
  products,
  notices
};
```

In this case, you don't want or need `products` or `notices` in order to render `<Header />`. You can use a selector to minimize the scope of the store changes passed to a component. Selectors are passed to `connect()`.

```jsx
const selector = store => ({
  account: store.account
});

export default connect(selector)(Header);
```

### Actions

Adding actions allows you to dispatch a change to the central store. A dispatch will then ripple and update to any subscribed components.

Actions must return a new object, or Federal will consider nothing to have changed.

#### pages/dashboard/index.js

```jsx
import Federal from 'federal';
import CountSummary from '../../components/CountSummary';
import CountInteractions from '../../components/CountInteractions'
import actions from './actions';

export default () => {
  const initialStore = {
    count: 0
  };

  return (
    <Federal store={initialStore} actions={actions}>
      <CountSummary />
      <CountInteractions />
    </Federal>
  );
};
```

#### pages/dashboard/actions/index.js

```jsx
const resetCount = store => {
  return Object.assign({}, store, {
    count: 0
  });
};

// second arg to each action is an object, that can be passed when dispatching
const addToCount = (store, { addition }) => {
  return Object.assign({}, store, {
    count: store.count + addition
  });
};

export default {
  resetCount,
  addToCount
};
```

#### components/CountSummary/index.js

```jsx
import { connect } from 'federal';

const CountSummary = ({ count }) => (
  <div>Current count is {count}</div>
);

export default connect()(CountSummary);
```

#### components/CountInteractions/index.js

```jsx
import { connect } from 'federal';

// `connect()` passed a `dispatch` prop that exposes all actions to the component
const CountInteractions = ({ dispatch }) => (
  <div>
    <div>
      <button
        type='button'
        onClick={() => {
          dispatch.addToCount({
            addition: 1 // can be modified to increment faster
          });
        }}
      >
        increment count
      </button>
    </div>
    <div>
      <button
        type='button'
        onClick={() => {
          dispatch.resetCount();
        }}
      >
        reset count
      </button>
    </div>
  </div>
);

export default connect()(CountInteractions);
```

### Action Callbacks

Actions have an optional callback.

```jsx
dispatch.addToCount({
  addition: 1
}, () => {
  // ...
});
```

### Actions via `connect()`

A component may have local actions, while `<Federal>` is rendered at a different level in the layout. You can append action handlers to the connected components.

```jsx
const removeFromCount = (store, { deduction }) => {
  return Object.assign({}, store, {
    count: store.count - deduction
  });
};

// action .removeFromCount() added to CountSummary.props.dispatch,
// while still including all root-level actions
export default connect(state => state, { removeFromCount })(CountSummary);
```
