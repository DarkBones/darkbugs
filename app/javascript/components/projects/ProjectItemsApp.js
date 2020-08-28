import React from 'react'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const json = {
      title: 'Issues',
      columns: [
        {
          title: 'Open'
        },
        {
          title: 'In Progress'
        },
        {
          title: 'Done'
        },
        {
          title: 'Archived'
        }
      ]
    }

    return (
      <div id='project-items-app'>
        <div>
          <h1>
            {json.title}
          </h1>
        </div>
        <div id='columns'>
          {json.columns.map((column) =>
            <div className='column rounded mr-5'>
              {column.title}
            </div>
          )}
        </div>
      </div>
    )
  }
}
