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
    const { type, uuid } = this.props.component

    const params = {
      board_slug: this.props.boardSlug,
      component_type: type,
      component_uuid: uuid,
      board: data
    }

    console.log(params)

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
  boardSlug:    PropTypes.string.isRequired,
  component:    PropTypes.object.isRequired,
  handleClose:  PropTypes.func.isRequired,
  show:         PropTypes.bool.isRequired
}