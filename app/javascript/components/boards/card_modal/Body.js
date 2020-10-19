import React      from 'react'
import PropTypes  from 'prop-types'
import ToolBar    from './ToolBar'
import Item       from './item/Item'

export default function Body(props) {
  const {
    deleteItem,
    cardUuid,
    itemOrder,
    items,
    name,
    newItem,
    saveCardItem,
    updateCardItem
  } = props

  const cardItems = () => {
    return (
      <div
        className="card-items"
      >
        {itemOrder.map((uuid, index) =>
          <Item
            cardUuid=       {cardUuid}
            deleteItem=     {deleteItem}
            item=           {items[uuid]}
            previousItem=   {items[itemOrder[index - 1]]}
            key=            {uuid}
            saveCardItem=   {saveCardItem}
            updateCardItem= {updateCardItem}
            uuid=           {uuid}
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
  cardUuid:       PropTypes.string.isRequired,
  deleteItem:     PropTypes.func.isRequired,
  itemOrder:      PropTypes.array.isRequired,
  items:          PropTypes.object.isRequired,
  name:           PropTypes.string.isRequired,
  newItem:        PropTypes.func.isRequired,
  saveCardItem:   PropTypes.func.isRequired,
  updateCardItem: PropTypes.func.isRequired
}