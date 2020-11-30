import MainContext  from '../MainContext';
import Modal        from '../../shared/Modal';
import PropTypes    from 'prop-types';
import React        from 'react';

export default class CardModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, cardId } = this.props;

    return (
      <MainContext.Consumer>
        {context =>
          <Modal
            handleOnClose={() => { context.setCardModalId(); }}
            show={show}
            title={cardId}
          >

          </Modal>
        }
      </MainContext.Consumer>
    );
  }
}

CardModal.propTypes = {
  cardId: PropTypes.string.isRequired,
  show:   PropTypes.bool.isRequired
}