import React      from 'react'
import Body       from './Body'
import Modal      from '../../shared/modal/Modal'
import PropTypes  from 'prop-types'

import {
  CardApi
} from '../../../api/InternalApi'

export default class CardModal extends React.Component {
  constructor(props) {
    super(props)

    this.default_card = {
      items: [],
      name: '',
      number: '',
      short_name: ''
    }

    this.default_note = {
      content: ''
    }

    this.state = {
      fetchingData: false,
      card: this.default_card
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.show !== prevProps.show) {
      if (this.props.show) {
        this.fetchCardData()
      } else {
        this.setState({
          fetchingData: false,
          card: this.default_card
        })
      }
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

  newItem = type => {
    console.log(`new ${type}`)
  }

  render() {
    const {
      show
    } = this.props

    const {
      card
    } = this.state

    const body = (
      <Body
        card={card}
        newItem={this.newItem}
      />
    )

    return (
      <React.Fragment>
        <Modal
          body={body}
          close={this.handleClose}
          show={show}
          includeFooter={false}
          title={`${card.number} - ${card.short_name}`}
        />
      </React.Fragment>
    )
  }
}

CardModal.propTypes = {
  cardUuid: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  includeFooter: PropTypes.bool,
  show: PropTypes.bool.isRequired
}