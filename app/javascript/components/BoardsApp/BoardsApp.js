import BoardModal   from "./BoardModal";
import React        from "react";
import Title        from "./Title";
import UserContext  from "./UserContext";

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props);

    const {
      board_order,
      boards,
      board_slug,
      component,
      name
    } = props

    this.user = {
      isAssigned: props.user_is_assigned
    }

    this.state = {
      boardOrder: board_order,
      boards: boards,
      boardSlug: board_slug,
      component: component,
      name: name,
      nameIsEditing: false,
      boardModalShowing: false
    };
  }

  setMainState = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  showBoardModal = () => { this.setShowBoardModal(true); }
  closeBoardModal = () => { this.setShowBoardModal(false); }

  setShowBoardModal = show => {
    this.setState({
      boardModalShowing: show
    })
  }

  render() {
    const {
      closeBoardModal,
      setMainState,
      showBoardModal,
      user
    } = this

    const {
      boardModalShowing,
      boardOrder,
      boards,
      boardSlug,
      component,
      name
    } = this.state;

    return (
      <div id="boards-app">
        <UserContext.Provider value={user}>
          <BoardModal
            boardSlug={boardSlug}
            component={component}
            handleClose={closeBoardModal}
            show={boardModalShowing}
          />

          <Title
            boardOrder={boardOrder}
            boards={boards}
            boardSlug={boardSlug}
            name={name}
            setMainState={setMainState}
            showBoardModal={showBoardModal}
          />
        </UserContext.Provider>
      </div>
    )
  }
}