import BoardModal   from './BoardModal';
import CardModal    from './CardModal';
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

    this.refresher = null; // interval to refresh page every 60 seconds
    this.boardSlug = board_slug;

    this.state = {
      boardModalShowing:  false,
      boardOrder:         [],
      boards:             {},
      boardSlug:          board_slug,
      cardModalId:        '',
      cardModalShowing:   false,
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
  }

  deleteCard = uuid => {
    this.setState(ColumnsState.deleteCard(this.state, uuid));
  }

  deleteColumn = uuid => {
    this.setState(ColumnsState.deleteColumn(this.state, uuid));
  }

  fetchBoardData = async (slug) => {
    clearInterval(this.refresher);

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
    }, this.setRefresher());
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

  setCardModalId = (cardId = '') => {
    this.setState({
      cardModalId: cardId,
      cardModalShowing: cardId.length > 0
    });
  }

  setCardName = (cardUuid, name) => {
    this.setState({
      cards: {
        ...this.state.cards,
        [cardUuid]: {
          ...this.state.cards[cardUuid],
          name: name
        }
      }
    });
  }

  setCardOrder = (cardOrder, sourceColumn, destinationColumn) => {
    this.setState({
      cardOrder: cardOrder,
      columns: {
        ...this.state.columns,
        [sourceColumn.uuid]: {
          ...this.state.columns[sourceColumn.uuid],
          card_uuids: sourceColumn.card_uuids
        },
        [destinationColumn.uuid]: {
          ...this.state.columns[destinationColumn.uuid],
          card_uuids: destinationColumn.card_uuids
        }
      }
    });
  }

  setColumnOrder = (cardOrder, columnOrder) => {
    this.setState({
      cardOrder: cardOrder,
      columnOrder: columnOrder
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

  setRefresher = () => {
    this.refresher = setInterval(() => {
      if (!this.state.fetchingData) this.fetchBoardData(this.boardSlug);
    }, 1000 * 60);
  }

  switchBoard = (path, slug) => {
    window.history.pushState({}, '', path);

    this.boardSlug = slug;

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
      fetchBoardData,
      saveCard,
      setBoardName,
      setCardModalId,
      setCardName,
      setCardOrder,
      setColumnOrder,
      setColumnValue,
      showBoardModal,
      switchBoard,
      state: {
        boardModalShowing,
        boardOrder,
        boards,
        boardSlug,
        cardModalShowing,
        cardModalId,
        cardOrder,
        cards,
        columnOrder,
        columns,
        component,
        name,
        projectKey,
        showSpinner,
        user
      }
    } = this;

    const contextValue = {
      boardSlug:        boardSlug,
      cardOrder:        cardOrder,
      cards:            cards,
      userIsAssigned:   user.isAssigned,
      addCard:          addCard,
      addColumn:        addColumn,
      deleteCard:       deleteCard,
      deleteColumn:     deleteColumn,
      fetchBoardData:   fetchBoardData,
      saveCard:         saveCard,
      setCardModalId:   setCardModalId,
      setCardName:      setCardName,
      setCardOrder:     setCardOrder,
      setColumnOrder:   setColumnOrder,
      setColumnValue:   setColumnValue
    };

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

          <CardModal
            cardUuid= {cardModalId}
            show=     {cardModalShowing}
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
                cardOrder=    {cardOrder}
                columnOrder=  {columnOrder}
                columns=      {columns}
                projectKey=   {projectKey}
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