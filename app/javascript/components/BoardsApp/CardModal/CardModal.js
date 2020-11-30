import MainContext  from '../MainContext';
import Modal        from '../../shared/Modal';
import PropTypes    from 'prop-types';
import React        from 'react';

export default class CardModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cardUuid: ''
    }
  }

  componentDidUpdate = prevProps => {
    const { show, cardUuid } = this.props;

    if (!prevProps.show && show && cardUuid !== this.state.cardUuid) {
      this.fetchCardData(cardUuid)
    }
  }

  fetchCardData = (cardUuid) => {
    this.setState({
      cardUuid: this.props.cardUuid
    });
  }


  render() {
    const { show, cardUuid } = this.props;

    return (
      <MainContext.Consumer>
        {context =>
          <Modal
            handleOnClose={() => { context.setCardModalId(); }}
            show={show}
            title={cardUuid}
          >

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