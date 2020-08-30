import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import i18n from '../../../i18n'

export default class CardModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: ''
    }
  }

  handleClose = () => {
    this.props.hideModal()
  }

  componentDidUpdate() {
    if (this.props.modal.show) {
      setTimeout(() => {
        this.inputRef.focus()
      }, 1)
    }
  }

  render() {
    const modal = this.props.modal

    return (
      <div>
        {modal.show &&
          <Modal show={modal.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {i18n.t('components.projects.cards.CardModal.title')}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label>
                {i18n.t('components.projects.cards.CardModal.form.name.label')}
                <abbr title={i18n.t('components.shared.form.required.title')}> *</abbr>
              </label>
              <input
                className='form-control'
                placeholder={i18n.t('components.projects.cards.CardModal.form.name.placeholder')}
                ref={(input) => {
                  this.inputRef = input
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                {i18n.t('components.projects.cards.CardModal.buttons.close')}
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                {i18n.t('components.projects.cards.CardModal.buttons.submit')}
              </Button>
            </Modal.Footer>
          </Modal>
        }
      </div>
    )
  }
}
