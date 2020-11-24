import React      from 'react'
import PropTypes  from 'prop-types'
import Title      from './Title'
import ToolBar    from './ToolBar'
import Item       from './item/Item'
import CardBoard  from './card_board/CardBoard'

export default function Body(props) {
  const {
    boardOrder,
    boards,
    boardSlug,
    deleteCard,
    deleteItem,
    cardUuid,
    itemOrder,
    items,
    name,
    newBoard,
    newItem,
    saveCardItem,
    saveName,
    updateCardItem,
    userIsAssigned
  } = props

  const cardBoards = () => {
    return (
      <React.Fragment>
        {boardOrder.length > 0 &&
          <div
            className="card-boards"
          >
            <ul>
              {boardOrder.map((slug) =>
                <li
                  key={slug}
                >
                  <CardBoard
                    boardSlug=    {boardSlug}
                    cardUuid=     {cardUuid}
                    name=         {boards[slug].name}
                    newBoard=     {newBoard}
                    path=         {boards[slug].path}
                  />
                </li>
              )}
            </ul>
          </div>
        }
      </React.Fragment>
    )
  }

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
      {cardBoards()}
      {cardItems()}
      {userIsAssigned &&
        <ToolBar
          newItem=    {newItem}
          deleteCard= {deleteCard}
          newBoard=   {newBoard}
        />
      }
    </React.Fragment>
  )
}

Body.propTypes = {
  boardOrder:       PropTypes.array.isRequired,
  boards:           PropTypes.object.isRequired,
  cardUuid:         PropTypes.string.isRequired,
  deleteCard:       PropTypes.func.isRequired,
  deleteItem:       PropTypes.func.isRequired,
  itemOrder:        PropTypes.array.isRequired,
  items:            PropTypes.object.isRequired,
  name:             PropTypes.string.isRequired,
  newBoard:         PropTypes.func.isRequired,
  newItem:          PropTypes.func.isRequired,
  saveCardItem:     PropTypes.func.isRequired,
  saveName:         PropTypes.func.isRequired,
  updateCardItem:   PropTypes.func.isRequired,
  userIsAssigned:   PropTypes.bool.isRequired
}