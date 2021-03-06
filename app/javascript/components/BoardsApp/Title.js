import i18n               from '../../i18n';
import MainContext        from './MainContext'
import PropTypes          from 'prop-types';
import StringTransformer  from '../shared/StringTransformer';
import React              from 'react';
import ToggleInput        from '../shared/ToggleInput';
import { BoardApi }       from '../../api/InternalApi';
import { Dropdown }       from 'react-bootstrap';

export default class Title extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameIsEditing: false
    };
  }

  updateBoardName = async (name) => {
    const params = {
      board: {
        name: name
      }
    };

    const { boardSlug, projectKey, setBoardName } = this.props;

    let response = await BoardApi.updateName(projectKey, boardSlug, params);

    if (!response) return;
    if (response.status !== 200) return;

    setBoardName(response.data.name);
  }

  render() {
    const {
      updateBoardName,
      props: {
        boardOrder,
        boards,
        name,
        showBoardModal,
        switchBoard
      },
      state: { nameIsEditing }
    } = this;

    return (
      <MainContext.Consumer>
        {context =>
          <div
            id="board-title"
          >
            <ToggleInput
              handleOnCancel= {() => { this.setState({ nameIsEditing: false }); }}
              handleOnSubmit= {data => { updateBoardName(data, context.updateBoardNameMain); }}
              isEditing=      {nameIsEditing}
              toggleOnClick=  {false}
              value=          {name}
            >
              <Dropdown>
                <Dropdown.Toggle
                  className=  "p-0"
                  variant=    "link"
                >
                  <h1>
                    {StringTransformer.shortenWidth(name, 3000)}
                  </h1>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {boardOrder.length > 0 &&
                    <React.Fragment>
                      {boardOrder.map((slug) =>
                        <Dropdown.Item
                          onClick={() => { switchBoard(boards[slug].path, slug); }}
                          key={slug}
                          slug={slug}
                        >
                          {StringTransformer.shortenWidth(boards[slug].name, 3000)}
                        </Dropdown.Item>
                      )}
                      <div className="dropdown-divider" />
                    </React.Fragment>
                  }
                  {context.userIsAssigned &&
                  <React.Fragment>
                    <Dropdown.Item
                      onClick={() => { this.setState({nameIsEditing: true}); }}
                    >
                      {i18n.t('components.BoardsApp.Title.edit_name')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={showBoardModal}
                    >
                      {i18n.t('components.BoardsApp.Title.new_board')}
                    </Dropdown.Item>
                  </React.Fragment>
                  }
                </Dropdown.Menu>
              </Dropdown>
            </ToggleInput>
          </div>
        }
      </MainContext.Consumer>
    );
  }
}

Title.propTypes = {
  boardOrder:     PropTypes.array.isRequired,
  boards:         PropTypes.object.isRequired,
  boardSlug:      PropTypes.string.isRequired,
  name:           PropTypes.string.isRequired,
  projectKey:     PropTypes.string.isRequired,
  setBoardName:   PropTypes.func.isRequired,
  showBoardModal: PropTypes.func.isRequired,
  switchBoard:    PropTypes.func.isRequired
}