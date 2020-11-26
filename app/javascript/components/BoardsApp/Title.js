import PropTypes    from "prop-types";
import React        from "react";
import ToggleInput  from "../shared/ToggleInput";
import { BoardApi } from "../../api/InternalApi";
import { Dropdown } from "react-bootstrap";

export default class Title extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      nameIsEditing: false
    };
  }

  updateBoardName = async (name) => {
    console.log('update board name to', name);
  }

  render() {
    const {
      updateBoardName
    } = this;

    const {
      boardOrder,
      boards,
      name
    } = this.props;

    const {
      nameIsEditing
    } = this.state;

    return (
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
                  <div className="dropdown-divider"></div>
                </React.Fragment>
              }
            </Dropdown.Menu>
          </Dropdown>
        </ToggleInput>
      </div>
    )
  }
}

Title.propTypes = {
  boardOrder: PropTypes.array.isRequired,
  boards:     PropTypes.object.isRequired,
  name:       PropTypes.string.isRequired
}