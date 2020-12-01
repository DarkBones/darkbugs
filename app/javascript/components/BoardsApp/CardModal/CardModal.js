import Board              from './Board';
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
      boardOrder: [],
      boards:     {},
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

  addBoard = (name, slug, path) => {
    this.setState(CardModalState.addBoard(this.state, name, slug, path));
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

  deleteBoard = slug => {
    this.setState(CardModalState.deleteBoard(this.state, slug));
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

    const { board_order: boardOrder, boards, item_order: itemOrder, items, name, number } = response.data;

    this.setState({
      boardOrder: boardOrder,
      boards:     boards,
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
      addBoard,
      addItem,
      closeModal,
      deleteBoard,
      deleteCard,
      deleteItem,
      updateCardName,
      updateItem,
      props: { cardUuid, show },
      state: { boardOrder, boards, itemOrder, items, name, number }
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
              <h1 style={{wordBreak: 'break-all'}} className="mb-4">
                {StringTransformer.shortenWidth(name, 9400)}
              </h1>
            </ToggleInput>

            {boardOrder.length > 0 &&
              <React.Fragment>
                <h3>
                  {i18n.t('components.BoardsApp.CardModal.boards')}
                </h3>
                <ul className="list-unstyled">
                  {boardOrder.map(slug =>
                    <Board
                      addBoard=   {addBoard}
                      cardUuid=   {cardUuid}
                      deleteBoard={deleteBoard}
                      key=        {slug}
                      name=       {boards[slug].name}
                      path=       {boards[slug].path}
                      slug=       {slug}
                    />
                  )}
                </ul>
              </React.Fragment>
            }

            <div className="mt-3">
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
            </div>

            {context.userIsAssigned &&
              <Toolbar>
                <ToolbarButton
                  faIconClass="fa fa-columns"
                  buttonText={i18n.t('components.BoardsApp.CardModal.Toolbar.new_board')}
                  handleOnClick={() => { addBoard('', '', ''); }}
                />
                <ToolbarButton
                  faIconClass="fa fa-sticky-note"
                  buttonText={i18n.t('components.BoardsApp.CardModal.Toolbar.new_note')}
                  handleOnClick={() => { addItem('note', { content: '' }); }}
                />
                <ToolbarButton
                  faIconClass="fa fa-trash"
                  buttonText={i18n.t('components.BoardsApp.CardModal.Toolbar.delete_card')}
                  handleOnClick={deleteCard}
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