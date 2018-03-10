const addItem = (store, { addition }) => {
  const items = store.items.slice()
  items.push(addition)

  return Object.assign({}, store, {
    items
  })
}

export default {
  addItem
}
