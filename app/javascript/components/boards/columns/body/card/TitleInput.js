import React      from 'react'
import ApiInput   from '../../../../shared/input/ApiInput'
import i18n       from '../../../../../i18n'
import PropTypes  from 'prop-types'

export default class TitleInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: props.value
    }
  }

  handleCancel = () => {
    this.props.deleteNewCard()
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = () => {
    const { name } = this.state

    if (name === '') {
      this.handleCancel()
      return
    }

    this.props.handleSubmit(name)
  }

  render() {
    const {
      handleCancel,
      handleSubmit,
      handleOnChange,
    } = this

    return (
      <React.Fragment>
        <ApiInput
          focus={true}
          handleCancel={handleCancel}
          handleOnChange={handleOnChange}
          handleSubmit={handleSubmit}
          name="name"
          placeholder={i18n.t('components.projects.cards.CardModal.form.name.placeholder')}
          value={this.state.name}
        />
      </React.Fragment>
    )
  }
}

TitleInput.propTypes = {
  deleteNewCard:  PropTypes.func.isRequired,
  handleSubmit:   PropTypes.func.isRequired,
  value:          PropTypes.string.isRequired
}