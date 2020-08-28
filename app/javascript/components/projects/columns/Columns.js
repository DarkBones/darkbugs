import React from 'react'
import Column from './Column';
import AddColumnButton from './AddColumnButton';

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns
    }
  }

  addColumn = () => {
    alert('ADD COLUMN')
  }

  render() {
    return (
      <div id='columns'>
        {this.state.columns.map((column) =>
          <Column title={column.title} />
        )}
        <AddColumnButton handleClick={this.addColumn} />
      </div>
    )
  }
}
