import React      from 'react'
import PropTypes  from 'prop-types'
import ToolBar    from './ToolBar'
import Item       from './item/Item'

export default function Body(props) {
  const {
    cancelNewItem,
    cardUuid,
    itemOrder,
    items,
    name,
    newItem,
    saveCardItem
  } = props

  const cardItems = () => {
    return (
      <div
        className="card-items"
      >
        {itemOrder.map((uuid, index) =>
          <Item
            cancelNewItem=  {cancelNewItem}
            cardUuid=       {cardUuid}
            item=           {items[uuid]}
            key=            {uuid}
            saveCardItem=   {saveCardItem}
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
  cancelNewItem:  PropTypes.func.isRequired,
  cardUuid:       PropTypes.string.isRequired,
  itemOrder:      PropTypes.array.isRequired,
  items:          PropTypes.object.isRequired,
  name:           PropTypes.string.isRequired,
  newItem:        PropTypes.func.isRequired,
  saveCardItem:   PropTypes.func.isRequired
}