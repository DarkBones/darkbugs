import React        from 'react'
import PropTypes    from 'prop-types'
import ApiInput     from '../../../shared/input/ApiInput'
import i18n         from '../../../../i18n'
import { BoardApi } from '../../../../api/InternalApi'

export default class CardBoard extends React.Component {
  constructor(props) {
    super(props)

    const isNew = props.slug === ''

    this.state = {
      isNew: isNew,
      name: props.name,
      slug: props.slug
    }
  }

  handleSubmit = async () => {
    const params = {
      board_slug: this.props.boardSlug,
      component_type: 'Card',
      component_uuid: this.props.cardUuid,
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
      slug: response.data.slug
    })
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

    const cardBoard = this.state.name

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
  slug:         PropTypes.string.isRequired
}