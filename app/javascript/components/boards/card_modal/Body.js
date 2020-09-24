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
      newItem
    } = this.props

    return (
      <React.Fragment>
        <div>
          <h1>
            {name}
          </h1>
          <div
            className="card-items"
          >
            <ul>
                {item_order.map((uuid, index) =>
                  <Item
                    key={uuid}
                    item={items[uuid]}
                  />
                )}
            </ul>
          </div>
        </div>
        <ToolBar
          newItem={newItem}
        />
      </React.Fragment>
    )
  }
}

Body.propTypes = {
  card:     PropTypes.object.isRequired,
  newItem:  PropTypes.func.isRequired
}