import React from 'react'
import Name from './Name'
import PropTypes from 'prop-types'

export default function Title(props) {
  const {
    columnUuid,
    name,
    userIsAssigned
  } = props

  return (
    <div className="column-title">
      <div className="row">
        <div className="col-10">
          <Name
            columnUuid={columnUuid}
            name={name}
            userIsAssigned={userIsAssigned}
          />
        </div>
      </div>
    </div>
  )
}

Title.propTypes = {
  columnUuid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}