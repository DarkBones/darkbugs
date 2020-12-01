import Ellipsis         from '../../../shared/ellipsis/Ellipsis';
import Form             from '../../../shared/Form';
import i18n             from '../../../../i18n';
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
    const { addItem, cardUuid, deleteItem, item: { type } } = this.props;

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

  deleteItem = async () => {
    const { deleteItem, item: { uuid }} = this.props;

    if (uuid !== 'new') {
      let response = await CardItemApi.deleteItem(uuid);
      if (!response) return;
      if (response.status !== 200) return;
    }

    deleteItem(uuid);
  }

  editItem = () => {
    this.setState({
      isEditing: true
    });
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

  handleCancel = () => {
    this.setState({
      isEditing: false
    }, this.props.deleteItem('new'));
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
    const { handleCancel, handleSubmit } = this;
    const { fieldOrder, fields } = this.formParams();

    return (
      <Form
        fieldOrder={fieldOrder}
        fields={fields}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      />
    )
  }

  updateItem = async (data) => {
    const { uuid } = this.props.item;

    let response = await CardItemApi.updateItem(uuid, {item: data});
    if (!response) return;
    if (response.status !== 200) return;

    this.setState({
      isEditing: false
    });

    this.props.updateItem(uuid, data);
  }

  render() {
    const { itemElement } = this;
    const { user_is_author: userIsAuthor } = this.props.item;

    const links = [
      [i18n.t('components.projects.cards.CardModal.items.menu.edit'), this.editItem],
      [i18n.t('components.projects.cards.CardModal.items.menu.delete'), this.deleteItem]
    ];

    return (
      <React.Fragment>
        <div className="card-item">
          {!this.state.isEditing && userIsAuthor &&
            <Ellipsis
              links={links}
            />
          }
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
  item:       PropTypes.object.isRequired,
  updateItem: PropTypes.func.isRequired
}