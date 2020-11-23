import React        from 'react'
import Body         from './Body'
import Modal        from '../../shared/modal/Modal'
import i18n         from '../../../i18n'
import PropTypes    from 'prop-types'
import { BoardApi } from '../../../api/InternalApi'

export default class NewBoardModal extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSubmit = async (data) => {
    const params = {
      board_slug: this.props.board_slug,
      board: data
    }

    let response = await BoardApi.createBoard(params)

    if (!response) return
    if (response.status !== 200) return

    window.location.reload() // TODO: Un-hack this
  }

  render() {
    const { handleSubmit } = this
    const {
      handleClose,
      show
    } = this.props

    const body = (
      <Body
        handleClose=  {handleClose}
        handleSubmit= {handleSubmit}
      />
    )

    return (
      <Modal
        title=          {i18n.t('components.projects.newBoardModal.title')}
        body=           {body}
        close=          {handleClose}
        show=           {show}
        includeFooter=  {false}
      />
    )
  }
}

NewBoardModal.propTypes = {
  board_slug:   PropTypes.string.isRequired,
  handleClose:  PropTypes.func.isRequired,
  show:         PropTypes.bool.isRequired
}