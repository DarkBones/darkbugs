import React      from 'react'
import ApiInput   from '../../../../shared/input/ApiInput'
import PropTypes  from 'prop-types'

export default class TitleInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: ''
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
    console.log('handle submit')
  }

  render() {
    const {
      handleCancel,
      handleOnChange,
      handleSubmit
    } = this

    return (
      <React.Fragment>
        <ApiInput
          focus={true}
          handleCancel={handleCancel}
          handleOnChange={handleOnChange}
          handleSubmit={handleSubmit}
          name="name"
          value={this.state.name}
        />
      </React.Fragment>
    )
  }
}

TitleInput.propTypes = {
  deleteNewCard: PropTypes.func.isRequired
}