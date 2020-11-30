import MainContext        from '../MainContext';
import Modal              from '../../shared/Modal';
import PropTypes          from 'prop-types';
import React              from 'react';
import StringTransformer  from '../../shared/StringTransformer';
import ToggleInput        from '../../shared/ToggleInput';
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

    this.setState({
      isFetching: false,
      name:       name,
      number:     number
    })
  }

  title = name => {
    return `${this.state.number} - ${name}`;
  }

  updateCardName = async (name) => {
    let response = await CardApi.updateCard(this.props.cardUuid, { name: name });

    if (!response) return;
    if (response.status !== 200) return;

    this.setState({
      name: name
    })
  }

  render() {
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
              handleOnSubmit={(data) => { this.updateCardName(data); }}
              value={this.state.name}
              isEnabled={context.userIsAssigned}
            >
              <h1 style={{wordBreak: 'break-all'}}>
                {StringTransformer.shortenWidth(this.state.name, 9400)}
              </h1>
            </ToggleInput>
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