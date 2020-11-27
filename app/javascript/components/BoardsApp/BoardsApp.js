import BoardModal   from "./BoardModal";
import Columns      from "./Columns";
import React        from "react";
import Title        from "./Title";
import UserContext  from "./UserContext";

import { Router } from "react-router";
import {Spinner} from "react-bootstrap";

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
      boardOrder:         [],
      boards:             {},
      boardSlug:          '',
      columnOrder:        [],
      columns:            {},
      component:          {},
      fetchingData:       true,
      name:               '',
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

  switchBoard = (path, slug) => {
    window.history.pushState({}, '', path);
  }

  render() {
    const {
      addBoard,
      closeBoardModal,
      setMainState,
      showBoardModal,
      switchBoard,
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
      fetchingData,
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

          {!fetchingData &&
            <React.Fragment>
              <Title
                boardOrder=     {boardOrder}
                boards=         {boards}
                boardSlug=      {boardSlug}
                name=           {name}
                setMainState=   {setMainState}
                showBoardModal= {showBoardModal}
                switchBoard=    {switchBoard}
              />

              <Columns
                columnOrder=  {columnOrder}
                columns=      {columns}
              />
            </React.Fragment>
          }

          {fetchingData &&
            <div className="spinner-container">
              <div className="spinner-center">
                <Spinner animation="border" />
              </div>
            </div>
          }
        </UserContext.Provider>
      </div>
    )
  }
}