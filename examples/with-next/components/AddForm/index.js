import React, { Component } from 'react'
import { connect } from 'federal'

import actions from './actions'

class AddForm extends Component {
  constructor(props) {
    super(props)

    this.input = null // will be set to input ref
  }

  submit() {
    const val = this.input.value.trim()

    if (!val) {
      return
    }

    const { dispatch } = this.props

    dispatch.addItem({
      addition: val
    }, () => {
      this.input.value = ''
    })
  }

  render() {
    return (
      <div>
        <input
          placeholder='New Item'
          ref={ref => this.input = ref}
        />

        <a
          href=''
          onClick={e => {
            e.preventDefault()
            this.submit()
          }}
        >
          Add New Item
        </a>
      </div>
    )
  }
}

const selector = store => ({
  items: store.items
})

export default connect(selector, actions)(AddForm)
