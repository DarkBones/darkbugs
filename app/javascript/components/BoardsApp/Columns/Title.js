import MainContext    from '../MainContext';
import PropTypes      from 'prop-types';
import React          from 'react';
import ToggleInput    from '../../shared/ToggleInput';
import { ColumnApi }  from '../../../api/InternalApi';

export default function Title({columnUuid, name}) {
  const handleUpdate = async (name, setColumnValue) => {
    let response = await ColumnApi.updateColumn(columnUuid, { name: name })

    if (!response) return;
    if (response.status !== 200) return;

    setColumnValue(columnUuid, 'name', name);
  }

  return (
    <MainContext.Consumer>
      {context =>
        <div className="column-title">
          <div className="row">
            <div className="col-10">
              <ToggleInput
                handleOnSubmit={data => {handleUpdate(data, context.setColumnValue)}}
                value={name}
              >
                <h3>
                  {name}
                </h3>
              </ToggleInput>
            </div>
          </div>
        </div>
      }
    </MainContext.Consumer>
  )
}

Title.propTypes = {
  columnUuid: PropTypes.string.isRequired,
  name:       PropTypes.string.isRequired
}