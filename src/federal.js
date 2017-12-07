import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

// marker used for invalid or unknown value, likely due to error
const problemMarker = {};

class Federal extends Component {
  constructor(props) {
    super(props);

    // getting props
    const { store, actions } = Object.assign({
      store: {},
      actions: {}
    }, props);

    // initial state
    this.state = {
      store,
      dispatch: actionsToDispatch(this, actions)
    };
  }

  getChildContext() {
    return {
      store: this.state.store,
      dispatch: this.state.dispatch,
      federalRoot: this
    };
  }

  render() {
    const { children } = this.props;

    return !children ? null :
      React.isValidElement(children) ? Children.only(children) :
      Array.isArray(children) ? (
        <span>{children}</span>
      ) :
      null;
  }

  // contextTypes needed or else context is not exposed
  static childContextTypes = {
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.object.isRequired,
    federalRoot: PropTypes.object.isRequired
  }
}

// method to 'connect'/bind a component to the Federal store
function connect(selector = store => store, actions = {}) {
  return function wrapper(InboundComponent) {
    // connecting a component wraps it with our own component, to enforce child contexts
    class FederalWrap extends Component {
      render() {
        const { store, dispatch, federalRoot } = this.context;

        // select will be used to reduce the number of props passed to the inbound component
        const storeSelected = typeof selector === 'function' ? selector(store) :
          Array.isArray(selector) ? selector.reduce((selection, currentSelector) => currentSelector(selection), store) :
          problemMarker;

        if (storeSelected === problemMarker) {
          throw new Error(`An invalid selector was passed to connect() for ${InboundComponent.displayName}`);
        }

        // dispatch may hav inherited or local actions
        const usedDispatch = Object.assign({}, dispatch, actionsToDispatch(federalRoot, actions));

        // props passed manually will override those in the store
        const usedProps = Object.assign({
          dispatch: usedDispatch
        }, storeSelected, this.props);

        // inbound component returned with overridden props, from the (selected) store
        return (
          <InboundComponent {...usedProps} />
        );
      }

      // contextTypes needed or else context is not exposed
      static contextTypes = {
        store: PropTypes.object.isRequired,
        dispatch: PropTypes.object.isRequired,
        federalRoot: PropTypes.object.isRequired
      }
    }

    return FederalWrap;
  };
}

const noOp = () => {};
function actionsToDispatch(parent, actions) {
  // building disptach methods, based on provided action methods
  return Object.keys(actions).reduce((mapping, actionName) => {
    // e.g. dispatch.setVal = ({ newVal: 12 }, () => { /* callback */ })
    mapping[actionName] = (data, callback = noOp) => {
      const state = parent.state;
      const oldStore = state.store;
      const newStore = actions[actionName](oldStore, data);

      // store value must change, or nothing is triggered
      if (newStore === oldStore) {
        return;
      }

      // state.store update will trigger children bound to context to update
      state.store = newStore;
      parent.setState(state, () => {
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
          prettyLog('Prev Store', oldStore);
          prettyLog('Federal Action', actionName);
          prettyLog('Next Store', newStore);
        }

        callback(oldStore, newStore);
      });
    };
    return mapping;
  }, {});
}

function prettyLog(label, data) {
  console.log(`%c ${padRight(label, 16)}`, 'color: #e4421e; font-style: italic; font-weight: bold', data);
}

function padRight(label, len) {
  return label.length >= len ? label : `${label}${' '.repeat(len - label.length)}`;
}

export default Federal;
export { connect };
