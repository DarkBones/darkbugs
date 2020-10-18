import React      from 'react'
import Note       from './Note'
import PropTypes  from 'prop-types'

export default class Item extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: props.item.uuid === 'new'
    }
  }

  getItem = () => {
    const { params, type, uuid } = this.props.item

    switch (type) {
      case 'note':
        return (
          <Note
            isEditing={this.state.isEditing}
            params={params}
            uuid={uuid}
          />
        )
    }
  }

  render() {
    const item = this.getItem()

    return (
      <div className="card-item">
        {item}
      </div>
    )
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired
}