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

  addItem = (type, params, uuid = 'new') => {
    this.setState(CardModalState.addItem(this.state, type, params, uuid));
  }

  componentDidUpdate = prevProps => {
    const { show, cardUuid } = this.props;

    if (!prevProps.show && show) {
      this.fetchCardData(cardUuid, cardUuid !== this.state.cardUuid);
    }
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
    const { setCardName } = this.context;
    let response = await CardApi.updateCard(this.props.cardUuid, { name: name });

    if (!response) return;
    if (response.status !== 200) return;

    this.setState({
      name: name
    })

    setCardName(this.state.cardUuid, name);
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
    const { addItem, deleteItem, updateCardName, updateItem } = this;
    const { cardUuid, show } = this.props;
    const { itemOrder, items } = this.state;

    return (
      <MainContext.Consumer>
        {context =>
          <Modal
            handleOnClose={() => { context.setCardModalId(); }}
            show={show}
            title={StringTransformer.shortenWidth(`${this.state.number} - ${this.state.name}`, 5800)}
          >
            <ToggleInput
              handleOnSubmit={updateCardName}
              value={this.state.name}
              isEnabled={context.userIsAssigned}
            >
              <h1 style={{wordBreak: 'break-all'}}>
                {StringTransformer.shortenWidth(this.state.name, 9400)}
              </h1>
            </ToggleInput>

            {itemOrder.map(uuid =>
              <Item
                addItem=      {addItem}
                cardUuid=     {cardUuid}
                deleteItem=   {deleteItem}
                key=          {uuid}
                item=         {items[uuid]}
                updateItem=   {updateItem}
              />
            )}

            <Toolbar>
              <ToolbarButton
                faIconClass="fa fa-sticky-note"
                buttonText={i18n.t('components.BoardsApp.CardModal.Toolbar.new_note')}
                onClick={() => { addItem('note', { content: '' }); }}
              />
            </Toolbar>
          </Modal>
        }
      </MainContext.Consumer>
    );
  }
}

CardModal.propTypes = {
  cardUuid: PropTypes.string.isRequired,
  show:     PropTypes.bool.isRequired
}

CardModal.contextType = MainContext;