import React from "react";
import Title from "./Title";
import ToggleInput from "../shared/ToggleInput";
import UserContext from "./UserContext";
import { BoardApi } from "../../api/InternalApi";

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props);

    const {
      board_order,
      boards,
      name
    } = props

    this.user = {
      isAssigned: props.user_is_assigned
    }

    this.state = {
      boardOrder: board_order,
      boards: boards,
      name: name,
      nameIsEditing: false
    };
  }

  handleSubmit = async (data) => {
    const params = {
      board: {
        name: data
      }
    };

    let response = await BoardApi.updateName(this.props.board_slug, params)

    if (!response) return;
    if (response.status !== 200) return;

    this.setState({
      name: response.data.name
    })
  }

  handelCancelEditName = () => {
    this.setState({
      nameIsEditing: false
    })
  }

  setMainState = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  render() {
    const {
      user
    } = this

    const {
      boardOrder,
      boards,
      name,
      nameIsEditing
    } = this.state;

    return (
      <div id="boards-app">
        <UserContext.Provider value={user}>
          <ToggleInput
            handleOnSubmit={this.handleSubmit}
            handleOnCancel={this.handelCancelEditName}
            value={name}
            toggleOnClick={false}
            isEditing={nameIsEditing}
          >
            <h1>
              {name}
            </h1>
            <div
              onClick={() => {this.setState({nameIsEditing: true})}}
            >
              CLICK!!!
            </div>
          </ToggleInput>

          <Title
            boardOrder={boardOrder}
            boards={boards}
            name={name}
          />
        </UserContext.Provider>
      </div>
    )
  }
}