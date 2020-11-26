import i18n       from '../../../i18n'
import PropTypes  from 'prop-types';
import React      from 'react';

import {
  Modal as Mod,
  Button
} from 'react-bootstrap';

export default function Modal (props) {
  const {
    children,
    handleOnClose,
    handleSubmit,
    includeFooter,
    show,
    size,
    title
  } = props;

  return (
    <div>
      {show &&
        <Mod
          show={show}
          size={size}
          onHide={handleOnClose}
        >
          <Mod.Header closeButton>
            <Mod.Title>
              {title}
            </Mod.Title>
          </Mod.Header>
          <Mod.Body>
            {children}
          </Mod.Body>
          {includeFooter &&
            <Mod.Footer>
              <Button
                variant="secondary"
                onClick={handleOnClose}
              >
                {i18n.t('components.shared.Modal.buttons.close')}
              </Button>
              {handleSubmit &&
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                >
                  {submit}
                </Button>
              }
            </Mod.Footer>
          }
        </Mod>
      }
    </div>
  );
}

Modal.propTypes = {
  handleOnClose:  PropTypes.func.isRequired,
  includeFooter:  PropTypes.bool,
  show:           PropTypes.bool.isRequired,
  size:           PropTypes.string,
  title:          PropTypes.string
}

Modal.defaultProps = {
  includeFooter:  false,
  size:           'lg',
  title:          ''
}