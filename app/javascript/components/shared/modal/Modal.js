import React from 'react'
import {Modal as Mod, Button} from 'react-bootstrap'
import i18n from "../../../i18n";

export default function Modal (props) {
  return (
    <div>
      {props.show &&
        <Mod show={props.show} onHide={props.close}>
          <Mod.Header closeButton>
            <Mod.Title>
              {props.title}
            </Mod.Title>
          </Mod.Header>
          <Mod.Body>
            {props.body}
          </Mod.Body>
          <Mod.Footer>
            <Button variant="secondary" onClick={props.close}>
              {i18n.t('components.shared.modal.Modal.buttons.close')}
            </Button>
            <Button variant="primary" onClick={props.close}>
              {props.submit}
            </Button>
          </Mod.Footer>
        </Mod>
      }
    </div>
  )
}
