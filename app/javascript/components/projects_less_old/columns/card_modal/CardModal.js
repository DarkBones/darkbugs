import React from 'react'
import i18n from '../../../../i18n'
import Modal from '../../../shared/modal/Modal'
import CreateCardForm from './CreateCardForm'
import {CardApi} from '../../../../api/InternalApi'

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

  handleSubmit = async () => {
    const params = {
      column_uuid: this.props.modal.currentColumn,
      above_card_uuid: this.props.modal.aboveCardId,
      card: {
        name: this.state.form.name
      }
    }

    let response = await CardApi
      .createCard(
        params
      )

    if (typeof (response) !== 'undefined') {
      this.props.updateCards(response.data)
    }

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
        column={this.props.column}
      />
    )

    return (
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
