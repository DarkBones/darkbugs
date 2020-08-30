import React from 'react'
// import { Modal, Button } from 'react-bootstrap'
import i18n from '../../../i18n'
import Modal from '../../shared/modal/Modal'

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

    const form = (
      <React.Fragment>
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
      </React.Fragment>
    )

    return(
      <Modal
        show={modal.show}
        title={i18n.t('components.projects.cards.CardModal.title')}
        body={form}
        close={this.props.hideModal}
        submit={i18n.t('components.projects.cards.CardModal.buttons.submit')}
      />
    )
  }
}
