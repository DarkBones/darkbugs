import i18n               from '../../../i18n';
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
      title:      '',
      name:       '',
      number:     ''
    }

    this.state = {
      ...this.defaultState
    }
  }

  componentDidUpdate = prevProps => {
    const { show, cardUuid } = this.props;

    if (!prevProps.show && show) {
      this.fetchCardData(cardUuid, cardUuid !== this.state.cardUuid);
    }
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

    const { name, number } = response.data;

    console.log(response.data);

    this.setState({
      isFetching: false,
      name:       name,
      number:     number
    })
  }

  newItem = (type, params, uuid = 'new') => {
    // const item = {
    //   ...this.defaultItems[type],
    //   params: params
    // }
    //
    // const newState = CardModalState
    //   .deleteItem(this.state, 'new')
    //
    // const itemOrder = Array.from(newState.cardData.itemOrder)
    // itemOrder.push(uuid)
    //
    // this.setState({
    //   ...newState,
    //   cardData: {
    //     ...newState.cardData,
    //     itemOrder: itemOrder,
    //     items: {
    //       ...newState.cardData.items,
    //       [item.uuid]: item
    //     }
    //   }
    // })

    const item = {
      ...this.defaultItems[type],
      params: params
    };
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

  render() {
    const { updateCardName } = this;
    const { show } = this.props;

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

            <Toolbar>
              <ToolbarButton
                faIconClass="fa fa-sticky-note"
                buttonText={i18n.t('components.BoardsApp.CardModal.Toolbar.new_note')}
                onClick={() => { console.log('click'); }}
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