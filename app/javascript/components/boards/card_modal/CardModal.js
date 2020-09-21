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
      card: {}
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
        card: response.card
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
          card: {}
        })
      }
    }
  }

  render() {
    const {
      show
    } = this.props

    const {
      card
    } = this.state

    return (
      <Modal
        body="body"
        close={this.handleClose}
        show={show}
        includeFooter={false}
        title={`${card.card_number} - ${card.short_name}`}
      />
    )
  }
}

CardModal.propTypes = {
  cardUuid: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  includeFooter: PropTypes.bool,
  show: PropTypes.bool.isRequired
}