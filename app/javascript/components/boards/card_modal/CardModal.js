import React      from 'react'
import Modal      from '../../shared/modal/Modal'
import PropTypes  from 'prop-types'

import {
  CardApi
} from '../../../api/InternalApi'

export default class CardModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fetchingData: false,
      cardNumber: '',
      data: ''
    }
  }

  handleClose = () => {
    this.props.handleClose()
  }

  handleSubmit = () => {
    alert('submit')
  }

  fetchCardData = async () => {
    this.setState({
      fetchingData: true
    })

    let response = await CardApi.getDetails(this.props.cardUuid)

    if (response) {
      this.setState({
        fetchingData: false,
        cardNumber: response.id,
        data: response
      })
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.show !== prevProps.show) {
      if (this.props.show) {
        this.fetchCardData()
      } else {
        this.setState({
          fetchingData: false,
          cardNumber: '',
          data: ''
        })
      }
    }
  }

  render() {
    const {
      show
    } = this.props

    const {
      cardNumber
    } = this.state

    return (
      <Modal
        body="body"
        close={this.handleClose}
        show={show}
        title={cardNumber}
      />
    )
  }
}

CardModal.propTypes = {
  cardUuid: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}