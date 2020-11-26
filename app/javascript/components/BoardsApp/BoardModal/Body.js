import Form       from '../../shared/Form';
import i18n       from '../../../i18n';
import PropTypes  from 'prop-types';
import React      from 'react';

export default class Body extends React.Component {
  constructor(props) {
    super(props);

    this.formParams = {
      fieldOrder: ['name'],
      fields: {
        name: {
          name: 'name',
          type: 'input',
          value: '',
          params: {
            placeholder: i18n.t('components.BoardsApp.BoardModal.Body.placeholder')
          }
        }
      }
    }

    this.state = {
      name: ''
    }
  }

  render() {
    const { fieldOrder, fields } = this.formParams;
    const { handleClose, handleSubmit } = this.props;

    return (
      <Form
        handleCancel={handleClose}
        handleSubmit={handleSubmit}
        fieldOrder={fieldOrder}
        fields={fields}
      />
    )
  }
}

Body.propTypes = {
  handleClose:  PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}