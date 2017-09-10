# Federal

Minimalistic centralized React store

## Why?

Federal wraps your react components, creating a centralized state store. It's similar to [Redux](https://github.com/reactjs/react-redux), in a lot of ways.

Redux has is great, and is often the right choice. But, sometimes it adds too much complexity to set up a simple page; As in [their todo list example](http://redux.js.org/docs/basics/ExampleTodoList.html). You have a main `index.js`, `actions/index.js`, `reducers/todo.js`, `reducers/visibilityFilter.js`, `reducers/index.js`, and finally the presentation components. All for a simple todo. Redux has a lot of potential for engineers to set it up poorly, leading to overly bloated file structures.

Federal takes the 'less is more' approach. In any file that uses Federal, you simply need to provide an intial store object, and an object of actions (e.g. `actions/index.js`). Then, you can `connect()` any components to the store, which will result in them getting the bound `.props`, including a dispatch for each action method.

## Use

### Simple Example

This example uses Federal to wrap a page content with a centralized state, and then has a child component (`<Header />`) connect to the state, which allows it to render the user's name.

#### components/Header/index.js

```jsx
import { connect } from 'federal';

const Header = ({ account }) => {
  return (
    <header>
      <dl>
        <dt>User</dt>
        <dd>{account.name}</dd>
      </dl>
    </header>
  );
};

// using `connect()` will bind `<Header />` to the full state object
export default connect()(Header);
```

#### pages/dashboard/index.js

```jsx
import Federal from 'federal';
import Header from '../../components/Header';

// assume `account` is passed in as a prop
export default ({ account }) => {
  const initialState = {
    account
  };

  return (
    <Federal store={initialState}>
      <Header />
    </Federal>
  );
};
```
