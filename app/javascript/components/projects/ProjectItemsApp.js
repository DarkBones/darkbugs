import React from 'react'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id='project-items-app'>
        <h1>
          {this.props.title}
        </h1>
        <div id='columns'>
          {this.props.columns.map((column) =>
            <div className='column rounded p-2 pb-5'>
              <h4 className='column-title'>
                {column.title}
              </h4>
            </div>
          )}
        </div>
      </div>
    )
  }
}
