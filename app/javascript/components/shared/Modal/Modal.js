import i18n       from '../../../i18n';
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
    submitText,
    title
  } = props;

  return (
    <div>
      {show &&
        <Mod
          show=   {show}
          size=   {size}
          onHide= {handleOnClose}
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
                  {submitText}
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
  includeFooter:  PropTypes.bool.isRequired,
  show:           PropTypes.bool.isRequired,
  size:           PropTypes.string.isRequired,
  submitText:     PropTypes.string.isRequired,
  title:          PropTypes.string.isRequired
};

Modal.defaultProps = {
  includeFooter:  false,
  size:           'lg',
  submitText:     i18n.t('components.shared.Modal.buttons.submit'),
  title:          ''
};