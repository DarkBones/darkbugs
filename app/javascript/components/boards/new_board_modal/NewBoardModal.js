import React      from 'react'
import Modal      from '../../shared/modal/Modal'
import PropTypes  from 'prop-types'

export default class NewBoardModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      handleClose,
      show
    } = this.props

    return (
      <Modal
        body=   {'test body'}
        close=  {handleClose}
        show=   {show}
      />
    )
  }
}

NewBoardModal.propTypes = {
  handleClose:  PropTypes.func.isRequired,
  show:         PropTypes.bool.isRequired
}