import BoardModal   from "./BoardModal";
import Columns      from "./Columns";
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
      column_order,
      columns,
      component,
      name
    } = props

    this.user = {
      isAssigned: props.user_is_assigned
    }

    this.state = {
      boardOrder:         board_order,
      boards:             boards,
      boardSlug:          board_slug,
      columnOrder:        column_order,
      columns:            columns,
      component:          component,
      name:               name,
      nameIsEditing:      false,
      boardModalShowing:  false
    };
  }

  addBoard = (name, path, slug) => {
    const newBoardOrder = Array.from(this.state.boardOrder);
    newBoardOrder.push(slug);

    this.setState({
      boardOrder: newBoardOrder,
      boards: {
        ...this.state.boards,
        [slug]: {
          name: name,
          path: path
        }
      }
    }, this.closeBoardModal());
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
      addBoard,
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
      columnOrder,
      columns,
      component,
      name
    } = this.state;

    return (
      <div id="boards-app">
        <UserContext.Provider value={user}>
          <BoardModal
            addBoard=     {addBoard}
            boardSlug=    {boardSlug}
            component=    {component}
            handleClose=  {closeBoardModal}
            show=         {boardModalShowing}
          />

          <Title
            boardOrder=     {boardOrder}
            boards=         {boards}
            boardSlug=      {boardSlug}
            name=           {name}
            setMainState=   {setMainState}
            showBoardModal= {showBoardModal}
          />

          <Columns
            columnOrder=  {columnOrder}
            columns=      {columns}
          />
        </UserContext.Provider>
      </div>
    )
  }
}