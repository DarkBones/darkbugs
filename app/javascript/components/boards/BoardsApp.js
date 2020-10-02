import React from 'react'
import PropTypes from 'prop-types'
import Title from './Title'

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      boardSlug,
      userIsAssigned
    } = this.props

    return (
      <div
        id="project-items-app"
      >
        <Title boardSlug={} handleAfterUpdate={} name={} />
      </div>
    )
  }
}