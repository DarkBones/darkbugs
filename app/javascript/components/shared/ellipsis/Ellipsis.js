import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'

const EllipsisToggle = React.forwardRef(({ children, onClick}, ref) => (
  <i
    className="fas fa-ellipsis-h clickable"
    ref={ref}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
  />
))

export default function Ellipsis(props) {
  return (
    <Dropdown>
      <Dropdown.Toggle as={EllipsisToggle} id="dropdown-basic">
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {props.links.map((link) =>
          <Dropdown.Item onClick={link[1]}>
            {link[0]}
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

Ellipsis.propTypes = {
  links: PropTypes.array.isRequired
}