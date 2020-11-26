import i18n         from "../../i18n";
import PropTypes    from "prop-types";
import React        from "react";
import ToggleInput  from "../shared/ToggleInput";
import UserContext  from "./UserContext"
import { BoardApi } from "../../api/InternalApi";
import { Dropdown } from "react-bootstrap";

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

    const { boardSlug, setMainState } = this.props;

    let response = await BoardApi.updateName(boardSlug, params);

    if (!response) return;
    if (response.status !== 200) return;

    setMainState('name', response.data.name)
  }

  render() {
    const {
      updateBoardName
    } = this;

    const {
      boardOrder,
      boards,
      name,
      showBoardModal
    } = this.props;

    const {
      nameIsEditing
    } = this.state;

    return (
      <UserContext.Consumer>
        {user =>
          <div
            id="board-title"
          >
            <ToggleInput
              handleOnCancel= {() => {this.setState({ nameIsEditing: false })}}
              handleOnSubmit= {updateBoardName}
              isEditing=      {nameIsEditing}
              toggleOnClick=  {false}
              value=          {name}
            >
              <Dropdown>
                <Dropdown.Toggle
                  className="p-0"
                  variant="link"
                >
                  <h1>
                    {name}
                  </h1>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {boardOrder.length > 0 &&
                  <React.Fragment>
                    {boardOrder.map((slug) =>
                      <Dropdown.Item
                        href={boards[slug].path}
                        key={slug}
                        slug={slug}
                      >
                        {boards[slug].name}
                      </Dropdown.Item>
                    )}
                    <div className="dropdown-divider" />
                  </React.Fragment>
                  }
                  {user.isAssigned &&
                    <React.Fragment>
                      <Dropdown.Item
                        onClick={() => { this.setState({nameIsEditing: true}) }}
                      >
                        {i18n.t("components.projects.title.dropdown.edit_name")}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={showBoardModal}
                      >
                        {i18n.t("components.projects.title.dropdown.new_board")}
                      </Dropdown.Item>
                    </React.Fragment>
                  }
                </Dropdown.Menu>
              </Dropdown>
            </ToggleInput>
          </div>
        }
      </UserContext.Consumer>
    )
  }
}

Title.propTypes = {
  boardOrder:     PropTypes.array.isRequired,
  boards:         PropTypes.object.isRequired,
  boardSlug:      PropTypes.string.isRequired,
  name:           PropTypes.string.isRequired,
  setMainState:   PropTypes.func.isRequired,
  showBoardModal: PropTypes.func.isRequired
}