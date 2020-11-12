import React        from 'react'
import ApiInput     from '../../shared/input/ApiInput'
import PropTypes    from 'prop-types'
import String       from '../../shared/string/String'
import { CardApi }  from '../../../api/InternalApi'

export default class Title extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      name: props.name
    }
  }

  cancelEdit = () => {
    this.setState({
      isEditing: false,
      name: this.props.name
    })
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleOnClick)
  }

  componentDidUpdate = prevProps => {
    if (prevProps.name !== this.props.name) {
      this.setState({
        name: this.props.name
      })
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleOnClick)
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleOnClick = e => {
    if (!this.name.contains(e.target)) this.cancelEdit()
  }

  handleSubmit = async () => {
    if (!this.props.userIsAssigned) return

    const name = this.state.name

    if (name === ''){
      this.cancelEdit()
      return
    }

    const params = {
      card: {
        name: name
      }
    }

    let response = await CardApi.updateCard(this.props.cardUuid, params)

    if (!response) return
    if (response.status !== 200) return

    this.props.saveName(name)

    this.setIsEditing(false)
  }

  setIsEditing = isEditing => {
    this.setState({
      isEditing: isEditing
    })
  }

  startEditing = () => {
    if (!this.props.userIsAssigned) return

    this.setIsEditing(true)
  }

  render() {
    const {
      cancelEdit,
      handleOnChange,
      handleSubmit,
      startEditing
    } = this

    const { isEditing, name } = this.state

    const shortName = String.shorten(this.props.name, 39)

    const header = (
      <h1 onClick={startEditing}>
        {shortName}
      </h1>
    )

    const input = (
      <ApiInput
        focus={true}
        handleCancel={cancelEdit}
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
        name="name"
        value={name}
      />
    )

    const element = isEditing ? input : header

    return (
      <div ref={name => this.name = name}>
        {element}
      </div>
    )
  }
}

Title.propTypes = {
  cardUuid:       PropTypes.string.isRequired,
  name:           PropTypes.string.isRequired,
  saveName:       PropTypes.func.isRequired,
  userIsAssigned: PropTypes.bool.isRequired
}