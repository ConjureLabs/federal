import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

const problemMarker = {}; // marker used for invalid or unknown value, likely due to error

class Federal extends Component {
  constructor(props) {
    super(props);

    const { store, actions } = Object.assign({
      store: {},
      actions: {}
    }, props);

    const dispatch = Object.keys(actions).reduce((mapping, actionName) => {
      mapping[actionName] = (data, callback) => {
        const state = this.state;
        const oldStore = state.store;
        const newStore = actions[actionName](oldStore, data);

        if (newStore === oldStore) {
          return;
        }

        state.store = newStore;
        this.setState(state, () => {
          prettyLog('Prev Store', oldStore);
          prettyLog('Federal Action', actionName);
          prettyLog('Next Store', newStore);

          if (typeof callback === 'function') {
            callback(oldStore, newStore);
          }
        });
      };
      return mapping;
    }, {});

    this.state = {
      store,
      dispatch
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.store !== this.store) {
  //     throw new Error('Can not alter Federal.store data on the fly');
  //   }
  // }

  getChildContext() {
    return {
      store: this.state.store,
      dispatch: this.state.dispatch
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

  static childContextTypes = {
    store: PropTypes.object.isRequired,
    dispatch: PropTypes.object.isRequired
  }
}

function connect(selector = store => store) {
  return function wrapper(InboundComponent) {
    class FederalWrap extends Component {
      render() {
        const { store, dispatch } = this.context;

        const storeSelected = typeof selector === 'function' ? selector(store) :
          Array.isArray(selector) ? selector.reduce((selection, currentSelector) => {
            return currentSelector(selection);
          }, store) :
          problemMarker;

        if (storeSelected === problemMarker) {
          throw new Error(`An invalid selector was passed to connect() for ${InboundComponent.displayName}`);
        }

        // props passed manually will override those in the store
        const usedProps = Object.assign({
          dispatch
        }, storeSelected, this.props);

        return (
          <InboundComponent {...usedProps} />
        );
      }

      static contextTypes = {
        store: PropTypes.object.isRequired,
        dispatch: PropTypes.object.isRequired
      }
    }

    return FederalWrap;
  };
}

function prettyLog(label, data) {
  // todo: make this compatible with non-chrome browsers
  console.log(`%c ${padRight(label, 16)}`, [
    'color: #e4421e',
    'font-style: italic',
    'font-weight: bold'
  ].join(';'), data);
}

function padRight(label, len) {
  if (label.length >= len) {
    return label;
  }
  return padRight(label + ' ', len);
}

export default Federal;
export { connect };
