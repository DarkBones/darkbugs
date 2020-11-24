import React        from 'react'
import PropTypes    from 'prop-types'
import ApiInput     from '../../../shared/input/ApiInput'
import i18n         from '../../../../i18n'
import { BoardApi } from '../../../../api/InternalApi'

export default class CardBoard extends React.Component {
  constructor(props) {
    super(props)

    const isNew = props.path === ''

    this.state = {
      isNew: isNew,
      name: props.name,
      path: props.path
    }
  }

  handleSubmit = async () => {
    const {
      boardSlug,
      cardUuid,
      newBoard
    } = this.props

    const params = {
      board_slug: boardSlug,
      component_type: 'Card',
      component_uuid: cardUuid,
      board: {
        name: this.state.name
      }
    }

    let response = await BoardApi.createBoard(params)

    if (!response) return
    if (response.status !== 200) return

    this.setState({
      isNew: false,
      name: response.data.name,
      path: response.data.path
    })

    newBoard(response.data.name, response.data.slug, response.data.path)
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { handleOnChange, handleSubmit } = this

    const input = (
      <ApiInput
        focus={true}
        handleSubmit={handleSubmit}
        handleOnChange={handleOnChange}
        name="name"
        value={this.state.name}
        placeholder={i18n.t('components.projects.newBoardModal.placeholder')}
      />
    )

    const cardBoard = (
      <a href={this.state.path}>
        {this.state.name}
      </a>
    )

    const element = this.state.isNew
      ? input
      : cardBoard

    return (
      <React.Fragment>
        {element}
      </React.Fragment>
    )
  }
}

CardBoard.propTypes = {
  boardSlug:    PropTypes.string.isRequired,
  cardUuid:     PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  name:         PropTypes.string.isRequired,
  newBoard:     PropTypes.func.isRequired,
  path:         PropTypes.string
}