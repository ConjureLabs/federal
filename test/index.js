import 'jsdom-global/register' // for enzyme .mount to work

import React, { Component } from 'react'
import { test } from 'ava'
import Enzyme, { shallow, mount, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import Federal, { connect } from '../dist/federal'

Enzyme.configure({
  adapter: new Adapter()
})

test('<Federal /> should render children', t => {
  const content = shallow(
    <Federal>
      <div>hello world</div>
    </Federal>
  )

  t.true(content.contains(<div>hello world</div>))
})

test('connect() should carry down store attributes', t => {
  const initialStore = {
    a: 'x',
    b: 'y',
    c: 'z'
  }

  const ConnectedChild = connect()(
    ({ a, b, c }) => (<div id='child'>{c}{b}{a}</div>)
  )

  const content = mount(
    <Federal store={initialStore}>
      <ConnectedChild />
    </Federal>
  )

  t.true(content.find('#child').text() === 'zyx')
})

test('connect() should honor a selector', t => {
  const initialStore = {
    a: 'x',
    b: 'y',
    c: 'z'
  }

  const ConnectedChild = connect(store => ({
    a: store.a,
    // no .b
    c: store.c
  }))(
    ({ a, b, c }) => (<div id='child'>{c || '-'}{b || '-'}{a || '-'}</div>)
  )

  const content = mount(
    <Federal store={initialStore}>
      <ConnectedChild />
    </Federal>
  )

  t.true(content.find('#child').text() === 'z-x')
})

test('connect() should pass action dispatchers', t => {
  const onClick = sinon.spy()

  const Child = ({ dispatch, count }) => (
    <div>
      <a
        id='anchor'
        href=''
        onClick={e => {
          e.preventDefault()
          dispatch.increment()
        }}
      >link</a>

      <span id='track'>{count}</span>
    </div>
  )

  const ConnectedChild = connect()(Child)

  const initialStore = {
    count: 0
  }

  const actions = {
    increment: store => {
      return Object.assign({}, store, {
        count: store.count + 1
      })
    }
  }

  const content = mount(
    <Federal store={initialStore} actions={actions}>
      <ConnectedChild />
    </Federal>
  )

  t.true(content.find('#track').text() === '0')

  content.find('#anchor').simulate('click')
  t.true(content.find('#track').text() === '1')

  content.find('#anchor').simulate('click')
  content.find('#anchor').simulate('click')
  content.find('#anchor').simulate('click')
  t.true(content.find('#track').text() === '4')
})

test('connect() should allow custom actions', t => {
  const onClick = sinon.spy()

  const actions = {
    increment: store => {
      return Object.assign({}, store, {
        count: store.count + 1
      })
    }
  }

  const Child = ({ dispatch, count }) => (
    <div>
      <a
        id='anchor'
        href=''
        onClick={e => {
          e.preventDefault()
          dispatch.increment()
        }}
      >link</a>

      <span id='track'>{count}</span>
    </div>
  )

  const ConnectedChild = connect(store => store, actions)(Child)

  const initialStore = {
    count: 0
  }

  const content = mount(
    <Federal store={initialStore}>
      <ConnectedChild />
    </Federal>
  )

  t.true(content.find('#track').text() === '0')

  content.find('#anchor').simulate('click')
  content.find('#anchor').simulate('click')
  t.true(content.find('#track').text() === '2')

  content.find('#anchor').simulate('click')
  content.find('#anchor').simulate('click')
  content.find('#anchor').simulate('click')
  t.true(content.find('#track').text() === '5')
})
