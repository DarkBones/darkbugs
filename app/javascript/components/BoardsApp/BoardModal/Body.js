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
    };

    this.state = {
      name: ''
    };
  }

  render() {
    const {
      formParams: { fieldOrder, fields },
      props: { handleClose, handleSubmit }
    } = this;

    return (
      <Form
        handleCancel= {handleClose}
        handleSubmit= {handleSubmit}
        fieldOrder=   {fieldOrder}
        fields=       {fields}
      />
    );
  }
}

Body.propTypes = {
  handleClose:  PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};