import React      from 'react'
import i18n       from '../../../i18n'
import PropTypes  from 'prop-types'

import {
  Modal as Mod,
  Button
} from 'react-bootstrap'

export default function Modal (props) {
  const {
    body,
    close,
    handleSubmit,
    show,
    submit,
    title
  } = props

  return (
    <div>
      {show &&
        <Mod
          show={show}
          onHide={close}
        >
          <Mod.Header closeButton>
            <Mod.Title>
              {title}
            </Mod.Title>
          </Mod.Header>
          <Mod.Body>
            {body}
          </Mod.Body>
          <Mod.Footer>
            <Button
              variant="secondary"
              onClick={close}
            >
              {i18n.t('components.shared.modal.Modal.buttons.close')}
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              {submit}
            </Button>
          </Mod.Footer>
        </Mod>
      }
    </div>
  )
}

Modal.propTypes = {
  body:         PropTypes.string,
  close:        PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  show:         PropTypes.bool.isRequired,
  submit:       PropTypes.string.isRequired,
  title:        PropTypes.string.isRequired
}