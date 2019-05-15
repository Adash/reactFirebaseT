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

const MessagesList = ({ messages, onRemoveMessage }) => (
  <ul>
    { messages.map(message => (
      <MessageItem 
        key={ message.uid } 
        message={ message }
        onRemoveMessage={ onRemoveMessage } 
      />
    )) }
  </ul>
);

const MessageItem = ({ message, onRemoveMessage }) => (
  <li>
    <strong>{ message.userId } </strong>{ message.text }
    <button 
      onClick={ () => onRemoveMessage(message.uid) }
    >Delete
    </button>
  </li>
);

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
          this.setState({ loading: false })
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
      userId: authUser.uid
    });

    this.setState({ text: '' });
  }

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  }

  render() {
    const { text, messages, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            { loading && <div>Loading...</div> }
            <p>poop</p>
            { messages.length === 0 ? "No Messages" :
              <MessagesList 
                messages={ messages } 
                onRemoveMessage={ this.onRemoveMessage }
              />
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