import React      from 'react'
import PropTypes  from 'prop-types'
import Title      from './Title'
import ToolBar    from './ToolBar'
import Item       from './item/Item'

export default function Body(props) {
  const {
    deleteCard,
    deleteItem,
    cardUuid,
    itemOrder,
    items,
    name,
    newItem,
    saveCardItem,
    saveName,
    updateCardItem,
    userIsAssigned
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
      <Title
        cardUuid=       {cardUuid}
        name=           {name}
        saveName=       {saveName}
        userIsAssigned= {userIsAssigned}
      />
      {cardItems()}
      {userIsAssigned &&
        <ToolBar
          newItem=    {newItem}
          deleteCard= {deleteCard}
        />
      }
    </React.Fragment>
  )
}

Body.propTypes = {
  cardUuid:       PropTypes.string.isRequired,
  deleteCard:     PropTypes.func.isRequired,
  deleteItem:     PropTypes.func.isRequired,
  itemOrder:      PropTypes.array.isRequired,
  items:          PropTypes.object.isRequired,
  name:           PropTypes.string.isRequired,
  newItem:        PropTypes.func.isRequired,
  saveCardItem:   PropTypes.func.isRequired,
  saveName:       PropTypes.func.isRequired,
  updateCardItem: PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}