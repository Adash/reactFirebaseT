import React, { Component } from 'react';

import { AuthUserContext, withAuthorisation } from '../Session'
import { withFirebase } from '../Firebase';

const Home = () => (
  <div>
    <h1>Home</h1>
    <p>data which should be protected from unauthorised user</p>

    <Messages />
  </div>
);

const MessagesList = ({ 
  messages, 
  onRemoveMessage,
  onEditMessage,
}) => (
  <ul>
    { messages.map(message => (
      <MessageItem 
        key={ message.uid } 
        message={ message }
        onRemoveMessage={ onRemoveMessage }
        onEditMessage={ onEditMessage } 
      />
    )) }
  </ul>
);

class MessageItem extends Component { 
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text,
    }
  }

  // in the function below check if it's necessary to 
  // pass the object in a function
  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text,
    }));
  }

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  }

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);
    this.setState({ editMode: false });
  }

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        { editMode ? (
          <input 
            type="text"
            value={ editText }
            onChange={ this.onChangeEditText }
          />
        ) : (
          <>
            <strong>{ message.userId } </strong>{ message.text }
            { message.editedAt && <span>(Edited)</span> }
          </>
        )}

        { editMode ? (
          <>
            <button onClick={ this.onSaveEditText } >Save</button>
            <button onClick={ this.onToggleEditMode } >Reset</button>
          </>
        ) : (
          <button onClick={ this.onToggleEditMode } >Edit</button>
        )}

        { !editMode && (
          <button 
            onClick={ () => onRemoveMessage(message.uid) }
          >Delete
          </button>
        )}
      </li>
    )
  }
}

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      messages: [],
      text: '',
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.messages()
      .on('value', snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          // convers messages list from snapshot
          const messageList = Object.keys(messageObject).map(key => (
            {
              ...messageObject[key],
              uid: key,
            }
          ))
        this.setState({ 
          loading: false, 
          messages: messageList,
        });
        } else {
          //ignore for now 
          this.setState({ loading: false, messages: null })
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onTextChange = event => {  
    this.setState({ text: event.target.value });
  }

  onCreateMessage = ( event, authUser ) => {
    event.preventDefault();

    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ text: '' });
  }

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  }

  onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    this.props.firebase.message(uid).set({
      ...messageSnapshot,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    })
  }

  render() {
    const { text, messages, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            { loading && <div>Loading...</div> }
            <p>poop</p>
            { messages ? (
              <MessagesList 
                messages={ messages } 
                onEditMessage={ this.onEditMessage }
                onRemoveMessage={ this.onRemoveMessage } /> 
              ) : "No Messages"
            }

            <form onSubmit={ event => this.onCreateMessage(event, authUser) }>
              <input 
                type="text"
                value={ text }
                onChange={ this.onTextChange }
              />
              <button type="submit">send</button>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }
}


const condition = authUser => !!authUser;

const Messages = withFirebase(MessagesBase);

export default withAuthorisation(condition)(Home)