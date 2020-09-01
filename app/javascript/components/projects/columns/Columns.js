import React from 'react'
import ColumnsList from './ColumnsList'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <ColumnsList
          columns={this.props.columns}
          cards={this.props.cards}
        />
      </React.Fragment>
    )
  }
}
