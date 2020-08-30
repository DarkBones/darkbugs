import React from 'react'
import i18n from '../../../i18n'
import Modal from '../../shared/modal/Modal'
import CreateCardForm from './CreateCardForm'

export default class CardModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      form: {
        name: ''
      }
    }
  }

  handleClose = () => {
    this.props.hideModal()
  }

  handleSubmit = () => {
    console.log("submit card")
    this.props.hideModal()
    this.setState({
      form: {
        name: ''
      }
    })
  }

  handleFormChange = (e) => {
    this.setState({
      form: {
        [event.target.name]: event.target.value
      }
    });
  }

  render() {
    const modal = this.props.modal

    const form = (
      <CreateCardForm
        handleChange={this.handleFormChange}
        form={this.state.form}
        handleSubmit={this.handleSubmit}
      />
    )

    return(
      <Modal
        show={modal.show}
        title={i18n.t('components.projects.cards.CardModal.title')}
        body={form}
        close={this.props.hideModal}
        submit={i18n.t('components.projects.cards.CardModal.buttons.submit')}
        handleSubmit={this.handleSubmit}
      />
    )
  }
}
