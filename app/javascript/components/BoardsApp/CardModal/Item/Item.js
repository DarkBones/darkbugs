import Form       from '../../../shared/Form';
import Note       from './Note';
import PropTypes  from 'prop-types';
import React      from 'react';

export default class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: props.uuid === 'new'
    }
  }

  formParams = () => {
    const { params, type } = this.props;
    
    switch (type) {
      case 'note':
        return {
          fieldOrder: ['content'],
          fields: {
            content: {
              name: 'content',
              type: 'text',
              value: params.content,
              params: {
                rows: 10
              }
            }
          }
        };
    }
  }

  itemElement = () => {
    if (this.state.isEditing) return this.itemForm();

    const { params, type, uuid } = this.props;

    switch (type) {
      case 'note':
        return (
          <Note />
        );
    }
  }

  itemForm = () => {
    const { deleteItem } = this.props;
    const { fieldOrder, fields } = this.formParams();

    return (
      <Form
        fieldOrder={fieldOrder}
        fields={fields}
        handleCancel={() => { deleteItem('new'); }}
        handleSubmit={() => { console.log('handle submit'); }}
      />
    )
  }

  render() {
    const { itemElement } = this;

    return (
      <React.Fragment>
        <div className="card-item">
          {itemElement()}
        </div>
      </React.Fragment>
    );
  }
}

Item.propTypes = {
  deleteItem: PropTypes.func.isRequired,
  params:     PropTypes.object.isRequired,
  type:       PropTypes.string.isRequired,
  uuid:       PropTypes.string.isRequired
}