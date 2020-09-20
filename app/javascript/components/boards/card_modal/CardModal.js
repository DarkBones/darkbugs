import React      from 'react'
import Modal      from '../../shared/modal/Modal'
import PropTypes  from 'prop-types'

export default function CardModal(props) {
  const handleClose = () => {
    props.handleClose()
  }

  const handleSubmit = () => {
    alert('submit')
  }

  const {
    show
  } = props

  return (
    <Modal
      body="body"
      close={handleClose}
      handleSubmit={handleSubmit}
      show={show}
      submit={"SUBMIT PLACEHOLDER"}
      title={"TITLE PLACEHOLDER"}
    />
  )
}

CardModal.propTypes = {
  cardUuid: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}