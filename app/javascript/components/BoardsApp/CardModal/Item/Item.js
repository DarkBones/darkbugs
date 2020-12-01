import Form             from '../../../shared/Form';
import Note             from './Note';
import PropTypes        from 'prop-types';
import React            from 'react';
import { CardItemApi }  from '../../../../api/InternalApi';

export default class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: props.item.uuid === 'new'
    }
  }

  createItem = async (data) => {
    const { addItem, cardUuid, deleteItem, item } = this.props;
    const { type } = item;

    const itemParams = {
      card_uuid: cardUuid,
      type: type,
      item: data
    };

    let response = await CardItemApi.createItem(itemParams)
      .catch(() => {
        deleteItem('new');
      });

    if (!response) return;
    if (response.status !== 200) return;

    const { params, uuid } = response.data;

    addItem(type, params, uuid);
  }

  formParams = () => {
    const { params, type } = this.props.item;
    
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

  handleSubmit = (data) => {
    const { createItem, props, updateItem } = this;

    props.item.uuid === 'new'
      ? createItem(data)
      : updateItem(data)
  }

  itemElement = () => {
    if (this.state.isEditing) return this.itemForm();

    const { params, type, uuid } = this.props.item;

    switch (type) {
      case 'note':
        return (
          <Note
            params= {params}
            uuid=   {uuid}
          />
        );
    }
  }

  itemForm = () => {
    const { handleSubmit } = this;
    const { deleteItem } = this.props;
    const { fieldOrder, fields } = this.formParams();

    return (
      <Form
        fieldOrder={fieldOrder}
        fields={fields}
        handleCancel={() => { deleteItem('new'); }}
        handleSubmit={(data) => { handleSubmit(data); }}
      />
    )
  }

  updateItem = data => {
    console.log('update item', data);
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
  addItem:    PropTypes.func.isRequired,
  cardUuid:   PropTypes.string.isRequired,
  deleteItem: PropTypes.func.isRequired,
  item:       PropTypes.object.isRequired
}