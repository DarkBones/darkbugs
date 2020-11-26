import React from 'react';
import ToggleInput from '../shared/ToggleInput';
import { BoardApi } from '../../api/InternalApi';

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props);

    const { name } = props

    this.state = {
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

  render() {
    const { name, nameIsEditing } = this.state;

    return (
      <div id="boards-app">
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
      </div>
    )
  }
}