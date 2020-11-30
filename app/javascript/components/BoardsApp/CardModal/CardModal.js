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

    this.state = {
      cardUuid:   '',
      isFetching: false,
      title: '',
      name: ''
    }
  }

  componentDidUpdate = prevProps => {
    const { show, cardUuid } = this.props;

    if (!prevProps.show && show && cardUuid !== this.state.cardUuid) {
      this.fetchCardData(cardUuid)
    }
  }

  fetchCardData = async (cardUuid) => {
    if (this.state.isFetching) return;

    this.setState({
      cardUuid: cardUuid,
      isFetching: true
    });

    let response = await CardApi.getDetails(cardUuid);
    if (!response) return;
    if (response.status !== 200) return;

    console.log(response.data);

    const { name, number } = response.data;

    this.setState({
      name: name,
      title: `${number} - ${name}`
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
            title={StringTransformer.shortenWidth(this.state.title, 5800)}
          >
            <ToggleInput
              handleOnSubmit={(data) => { console.log(data); }}
              value={this.state.name}
              triggerOn="mouseup"
            >
              <h1>
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