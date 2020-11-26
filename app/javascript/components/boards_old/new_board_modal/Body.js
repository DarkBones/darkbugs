import React      from 'react'
import i18n       from '../../../i18n'
import PropTypes  from 'prop-types'
// import Form       from '../../shared/input/Form'

export default class Body extends React.Component {
  constructor(props) {
    super(props)

    this.formParams = {
      fieldOrder: ['name'],
      fields: {
        name: {
          name: 'name',
          type: 'input',
          value: '',
          params: {
            placeholder: i18n.t('components.projects.newBoardModal.placeholder')
          }
        }
      }
    }

    this.state = {
      name: ''
    }
  }

  render() {
    const { fieldOrder, fields } = this.formParams
    const { handleClose, handleSubmit } = this.props

    return (
      <React.Fragment>
        {/*<Form*/}
        {/*  fieldOrder={fieldOrder}*/}
        {/*  fields={fields}*/}
        {/*  formId={'test form id'}*/}
        {/*  handleCancel={handleClose}*/}
        {/*  handleSubmit={handleSubmit}*/}
        {/*/>*/}
      </React.Fragment>
    )
  }
}

Body.propTypes = {
  handleClose:  PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}