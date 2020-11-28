import i18n           from '../../../i18n';
import MainContext    from '../MainContext';
import PropTypes      from 'prop-types';
import React          from 'react';
import ToggleInput    from '../../shared/ToggleInput';
import { ColumnApi }  from '../../../api/InternalApi';

export default function Title({cardCount, columnUuid, name}) {
  const handleUpdate = async (name, setColumnValue) => {
    let response = await ColumnApi.updateColumn(columnUuid, { name: name })

    if (!response) return;
    if (response.status !== 200) return;

    setColumnValue(columnUuid, 'name', name);
  }

  const handleDelete = async (deleteColumn) => {
    if (cardCount > 0) {
      let r = confirm(
        i18n.t('components.BoardsApp.Columns.Title.delete_warning')
      )

      if (!r) return;
    }

    if (columnUuid !== 'new') {
      let response = await ColumnApi.deleteColumn(columnUuid);
      if (!response) return;
      if (response.status !== 200) return;
    }

    deleteColumn(columnUuid);
  }

  return (
    <MainContext.Consumer>
      {context =>
        <div className="column-title">
          <div className="row">
            <div className="col-10">
              <ToggleInput
                handleOnCancel={() => handleDelete(context.deleteColumn)}
                handleOnSubmit={data => {handleUpdate(data, context.setColumnValue)}}
                isEnabled={context.userIsAssigned}
                isEditing={columnUuid === 'new'}
                value={name}
              >
                <h3>
                  {name}
                </h3>
              </ToggleInput>
            </div>
            {context.userIsAssigned &&
              <React.Fragment>
                <div
                  className="delete-column-btn clickable float-right"
                >
                  <i
                    className="fa fa-times-circle"
                    onClick={() => handleDelete(context.deleteColumn)}
                  />
                </div>
              </React.Fragment>
            }
          </div>
        </div>
      }
    </MainContext.Consumer>
  )
}

Title.propTypes = {
  cardCount:  PropTypes.number.isRequired,
  columnUuid: PropTypes.string.isRequired,
  name:       PropTypes.string.isRequired
}