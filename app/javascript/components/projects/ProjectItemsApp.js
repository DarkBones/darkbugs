import React from 'react'
import Columns from './columns/Columns'

export default class ProjectItemsApp extends React.Component {
  constructor(props) {
    super(props)

    console.log(props)
  }

  render () {
    return (
      <div id='project-items-app'>
        <Columns />
      </div>
    )
  }
}
