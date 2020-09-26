import React from 'react'
import Item from './item/Item'
import ToolBar from './ToolBar'
import PropTypes from 'prop-types'


export default class Body extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      name,
      item_order,
      items
    } = this.props.card

    const {
      card,
      defaultItems,
      newItem,
      removeItem
    } = this.props
    
    return (
      <React.Fragment>
        <div>
          <h1>
            {name}
          </h1>
          <p>
          </p>
          <div
            className="card-items"
          >
            {item_order.map((uuid, index) =>
              <Item
                cardUuid={card.uuid}
                key={uuid}
                item={items[uuid]}
                removeItem={removeItem}
                previousItem={items[item_order[index - 1]]}
              />
            )}
          </div>
        </div>
        <ToolBar
          defaultItems={defaultItems}
          newItem={newItem}
        />
      </React.Fragment>
    )
  }
}

Body.propTypes = {
  card:         PropTypes.object.isRequired,
  defaultItems: PropTypes.object.isRequired,
  newItem:      PropTypes.func.isRequired,
  removeItem:   PropTypes.func.isRequired
}