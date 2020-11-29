import BoardModal   from './BoardModal';
import Columns      from './Columns';
import ColumnsState from './ColumnsState';
import MainContext  from './MainContext';
import PropTypes    from 'prop-types';
import React        from 'react';
import Title        from './Title';
import { BoardApi } from '../../api/InternalApi';
import { Spinner }  from 'react-bootstrap';

export default class BoardsApp extends React.Component {
  constructor(props) {
    super(props);

    const {
      board_slug,
      project_key
    } = props;

    this.state = {
      boardModalShowing:  false,
      boardOrder:         [],
      boards:             {},
      boardSlug:          board_slug,
      cardOrder:          [],
      cards:              {},
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

  addCard = (columnUuid, columnIndex, name, uuid) => {
    this.setState(ColumnsState.addCard(this.state, columnUuid, columnIndex, name, uuid));
  }

  addColumn = (uuid, name = '') => {
    this.setState(ColumnsState.addColumn(this.state, uuid, name));
  }

  componentDidMount() {
    this.fetchBoardData(this.state.boardSlug);

    // TODO: Test this doesn't affect dragging / typing actions
    // setInterval(() => {
    //   if (!this.state.fetchingData) this.fetchBoardData(this.state.boardSlug);
    // }, 1000 * 60);
  }

  deleteCard = uuid => {
    this.setState(ColumnsState.deleteCard(this.state, uuid));
  }

  deleteColumn = uuid => {
    this.setState(ColumnsState.deleteColumn(this.state, uuid));
  }

  fetchBoardData = async (slug) => {
    // if (this.state.fetchingData) return;

    this.setState({
      fetchingData: true,
      showSpinner:  slug !== this.state.boardSlug || this.state.name === ''
    });

    let response = await BoardApi.getBoard(this.props.project_key, slug);

    if (!response) return;
    if (response.status !== 200) return;

    const { data } = response;

    this.setState({
      boardOrder:   data.board_order,
      boards:       data.boards,
      boardSlug:    data.board_slug,
      cardOrder:    data.card_order,
      cards:        data.cards,
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

  saveCard = (name, uuid, columnUuid) => {
    this.setState(ColumnsState.saveCard(this.state, name, uuid, columnUuid));
  }

  setBoardName = name => {
    this.setState({
      name: name
    });
  }

  showBoardModal = () => { this.setShowBoardModal(true); }
  closeBoardModal = () => { this.setShowBoardModal(false); }

  setShowBoardModal = show => {
    this.setState({
      boardModalShowing: show
    });
  }

  setColumnValue = (columnUuid, key, value) => {
    this.setState({
      columns: {
        ...this.state.columns,
        [columnUuid]: {
          ...this.state.columns[columnUuid],
          [key]: value
        }
      }
    });
  }

  switchBoard = (path, slug) => {
    window.history.pushState({}, '', path);

    this.fetchBoardData(slug);
  }

  render() {
    const {
      addBoard,
      addCard,
      addColumn,
      closeBoardModal,
      deleteCard,
      deleteColumn,
      saveCard,
      setBoardName,
      setColumnValue,
      showBoardModal,
      switchBoard
    } = this

    const {
      boardModalShowing,
      boardOrder,
      boards,
      boardSlug,
      cardOrder,
      cards,
      columnOrder,
      columns,
      component,
      name,
      projectKey,
      showSpinner,
      user
    } = this.state;

    const contextValue = {
      boardSlug:      boardSlug,
      cardOrder:      cardOrder,
      cards:          cards,
      userIsAssigned: user.isAssigned,
      addCard:        addCard,
      addColumn:      addColumn,
      deleteCard:     deleteCard,
      deleteColumn:   deleteColumn,
      saveCard:       saveCard,
      setColumnValue: setColumnValue
    }

    return (
      <div id="boards-app">
        <MainContext.Provider value={contextValue}>
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
                setBoardName=   {setBoardName}
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
        </MainContext.Provider>
      </div>
    );
  }
}

BoardsApp.propTypes = {
  board_slug:   PropTypes.string.isRequired,
  project_key:  PropTypes.string.isRequired
};