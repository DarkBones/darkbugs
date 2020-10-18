import React      from 'react'
import PropTypes  from 'prop-types'
import ToolBar    from './ToolBar'
import Item       from './item/Item'

export default function Body(props) {
  const {
    itemOrder,
    items,
    name,
    newItem
  } = props

  const cardItems = () => {
    return (
      <div
        className="card-items"
      >
        {itemOrder.map((uuid, index) =>
          <Item
            item={items[uuid]}
            key={uuid}
          />
        )}
      </div>
    )
  }

  return (
    <React.Fragment>
      <h1>
        {name}
      </h1>
      {cardItems()}
      <ToolBar newItem={newItem} />
    </React.Fragment>
  )
}

Body.propTypes = {
  itemOrder:  PropTypes.array.isRequired,
  items:      PropTypes.object.isRequired,
  name:       PropTypes.string.isRequired,
  newItem:    PropTypes.func.isRequired
}