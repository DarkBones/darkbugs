import CardModalState     from './CardModalState';
import i18n               from '../../../i18n';
import Item               from './Item';
import MainContext        from '../MainContext';
import Modal              from '../../shared/Modal';
import PropTypes          from 'prop-types';
import React              from 'react';
import StringTransformer  from '../../shared/StringTransformer';
import ToggleInput        from '../../shared/ToggleInput';
import Toolbar            from './Toolbar';
import ToolbarButton      from './ToolbarButton';
import { CardApi }        from '../../../api/InternalApi';

export default class CardModal extends React.Component {
  constructor(props) {
    super(props);

    this.defaultState = {
      cardUuid:   '',
      isFetching: false,
      itemOrder:  [],
      items:      {},
      title:      '',
      name:       '',
      number:     ''
    };

    this.state = {
      ...this.defaultState
    };
  }

  addItem = (type, data, uuid = 'new') => {
    this.setState(CardModalState.addItem(this.state, type, data, uuid));
  }

  closeModal = () => {
    this.context.setCardModalId();
  }

  componentDidUpdate = prevProps => {
    const {
      fetchCardData,
      props: { cardUuid, show },
      state: { cardUuid: stateCardUuid }
    } = this

    if (!prevProps.show && show) {
      fetchCardData(cardUuid, cardUuid !== stateCardUuid);
    }
  }

  deleteCard = async () => {
    const {
      closeModal,
      context,
      state: { cardUuid, itemOrder, isFetching }
    } = this;

    if ( isFetching || cardUuid.length === 0 ) return;

    if (itemOrder.length > 0) {
      let r = confirm(
        i18n.t('components.BoardsApp.CardModal.Toolbar.delete_confirm')
      );

      if (!r) return;
    }

    await CardApi.deleteCard(cardUuid);

    closeModal();
    context.deleteCard(cardUuid);
  }

  deleteItem = uuid => {
    this.setState(CardModalState.deleteItem(this.state, uuid));
  }

  fetchCardData = async (cardUuid, resetState) => {
    if (this.state.isFetching) return;

    if (resetState) {
      this.setState({
        ...this.defaultState,
        cardUuid: cardUuid,
        isFetching: true
      });
    }

    let response = await CardApi.getDetails(cardUuid);
    if (!response) return;
    if (response.status !== 200) return;

    const { item_order: itemOrder, items, name, number } = response.data;

    this.setState({
      isFetching: false,
      itemOrder:  itemOrder,
      items:      items,
      name:       name,
      number:     number
    })
  }

  title = name => {
    return `${this.state.number} - ${name}`;
  }

  updateCardName = async (name) => {
    const {
      context: { setCardName },
      state: { cardUuid }
    } = this;

    let response = await CardApi.updateCard(cardUuid, { name: name });

    if (!response) return;
    if (response.status !== 200) return;

    this.setState({
      name: name
    })

    setCardName(cardUuid, name);
  }

  updateItem = (uuid, params) => {
    this.setState({
      items: {
        ...this.state.items,
        [uuid]: {
          ...this.state.items[uuid],
          params: params
        }
      }
    });
  }

  render() {
    const {
      addItem, closeModal, deleteCard, deleteItem, updateCardName, updateItem,
      props: { cardUuid, show },
      state: { itemOrder, items, name, number }
    } = this;

    return (
      <MainContext.Consumer>
        {context =>
          <Modal
            handleOnClose={closeModal}
            show={show}
            title={StringTransformer.shortenWidth(`${number} - ${name}`, 5800)}
          >
            <ToggleInput
              handleOnSubmit={updateCardName}
              value={name}
              isEnabled={context.userIsAssigned}
            >
              <h1 style={{wordBreak: 'break-all'}}>
                {StringTransformer.shortenWidth(name, 9400)}
              </h1>
            </ToggleInput>

            {itemOrder.map((uuid, index) =>
              <Item
                addItem=      {addItem}
                cardUuid=     {cardUuid}
                deleteItem=   {deleteItem}
                key=          {uuid}
                item=         {items[uuid]}
                previousItem= {items[itemOrder[index - 1]]}
                updateItem=   {updateItem}
              />
            )}

            {context.userIsAssigned &&
              <Toolbar>
                <ToolbarButton
                  faIconClass="fa fa-sticky-note"
                  buttonText={i18n.t('components.BoardsApp.CardModal.Toolbar.new_note')}
                  onClick={() => { addItem('note', { content: '' }); }}
                />
                <ToolbarButton
                  faIconClass="fa fa-trash"
                  buttonText={i18n.t('components.BoardsApp.CardModal.Toolbar.delete_card')}
                  onClick={deleteCard}
                />
              </Toolbar>
            }
          </Modal>
        }
      </MainContext.Consumer>
    );
  }
}

CardModal.propTypes = {
  cardUuid: PropTypes.string.isRequired,
  show:     PropTypes.bool.isRequired
};

CardModal.contextType = MainContext;