import React from 'react'
import { Modal, Button } from 'react-bootstrap';

export default class CardModal extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render() {
    const modal = this.props.modal

    return (
      <div>
        {modal.show &&
          <Modal show={modal.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>New Card</Modal.Title>
            </Modal.Header>
            <Modal.Body>New card form for column {modal.column}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                Create Card
              </Button>
            </Modal.Footer>
          </Modal>
        }
      </div>
    )
  }
}
