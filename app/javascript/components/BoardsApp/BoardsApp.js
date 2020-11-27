import BoardModal   from "./BoardModal";
import Columns      from "./Columns";
import React        from "react";
import Title        from "./Title";
import UserContext  from "./UserContext";
import { BoardApi } from "../../api/InternalApi";
import { Spinner }  from "react-bootstrap";

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props);

    const {
      board_slug,
      project_key
    } = props

    this.state = {
      boardModalShowing:  false,
      boardOrder:         [],
      boards:             {},
      boardSlug:          board_slug,
      columnOrder:        [],
      columns:            {},
      component:          {},
      fetchingData:       false,
      name:               '',
      nameIsEditing:      false,
      projectKey:         project_key,
      showSpinner:        false,
      user:               {
                            isAssigned: false
                          }
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

  componentDidMount() {
    this.fetchBoardData(this.state.boardSlug);

    // TODO: Test this doesn't affect dragging / typing actions
    // setInterval(() => {
    //   if (!this.state.fetchingData) this.fetchBoardData(this.state.boardSlug);
    // }, 1000 * 60);
  }

  fetchBoardData = async (slug) => {
    // if (this.state.fetchingData) return;

    this.setState({
      fetchingData: true,
      showSpinner: slug !== this.state.boardSlug || this.state.name === ''
    });

    let response = await BoardApi.getBoard(this.props.project_key, slug);

    if (!response) return;
    if (response.status !== 200) return;

    const { data } = response;

    this.setState({
      boardOrder:   data.board_order,
      boards:       data.boards,
      boardSlug:    data.board_slug,
      columnOrder:  data.column_order,
      columns:      data.columns,
      component:    data.component,
      fetchingData: false,
      name:         data.name,
      showSpinner:  false,
      user:         {
                      ...this.state.users,
                      isAssigned: data.user_is_assigned
                    }
    });
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

    this.fetchBoardData(slug);
  }

  render() {
    const {
      addBoard,
      closeBoardModal,
      setMainState,
      showBoardModal,
      switchBoard
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
      name,
      projectKey,
      showSpinner,
      user
    } = this.state;

    return (
      <div id="boards-app">
        <UserContext.Provider value={user}>
          <BoardModal
            addBoard=     {addBoard}
            boardSlug=    {boardSlug}
            component=    {component}
            handleClose=  {closeBoardModal}
            projectKey=   {projectKey}
            show=         {boardModalShowing}
          />

          {!showSpinner &&
            <React.Fragment>
              <Title
                boardOrder=     {boardOrder}
                boards=         {boards}
                boardSlug=      {boardSlug}
                name=           {name}
                projectKey=     {projectKey}
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

          {showSpinner &&
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