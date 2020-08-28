import React from 'react'

export default class Columns extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: props.columns
    }
  }

  render() {
    return (
      <div id='columns'>
        {this.state.columns.map((column) =>
          <div className='column rounded p-2 pb-5'>
            <h4 className='column-title'>
              {column.title}
            </h4>
          </div>
        )}
        <div className='add-column-btn-container'>
          <div className='add-column-btn clickable'>
            <i className='fa fa-plus-circle fa-3x' />
          </div>
        </div>
      </div>
    )
  }
}
