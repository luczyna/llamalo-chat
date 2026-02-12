import { useState, useEffect } from 'react';
import * as sts from '../services/storageService.js'

// ConversationList props
// {
//   list: chatlist of ollama conversations
//   model: current model
//   activeConvo: current conversation
//   updateConvoList: setState for convolist
//   updateActiveConvo: setState for active convo
// }
function ConversationList(props) {
  const [makingConvo, setConvoMakingToggle] = useState(false);
  const [convoName, setConvoName] = useState('');

  function promptNewConversation() {
    setConvoMakingToggle(true);
  }

  function createNewConvo() {
    if (convoName.length) {
      const newconvoId = sts.saveConversation(convoName, props.model, props.list);
      cancelNewConvo();

      const updates = sts.getConversations();
      props.updateConvoList(updates);
      props.updateActiveConvo(newconvoId);
    }
  }

  function cancelNewConvo() {
    setConvoName('');
    setConvoMakingToggle(false);
  }

  function updateConvoName(event) {
    setConvoName(event.target.value);
  }

  function setActiveConvo(event) {
    const id = event.target.getAttribute('datakey');
    props.updateActiveConvo(id);
  }

  function deleteConvoFromStorage(convoId) {
    sts.deleteConversation(convoId, props.list);
    const updates = sts.getConversations();
    props.updateConvoList(updates);
  }

  return (
    <div>
      {!props.list.length && <p>there are no conversations...</p>}

      {(props.list.length > 0) &&
        <ul>
          {props.list.map((item, i) => {
            return <li key={item.id}
              className={"convoListName " + ((props.activeConvo === item.id) ? 'activeConvoName' : 'notactive')}>
                <span onClick={setActiveConvo} datakey={item.id}>{item.name}</span>
                <button type="button" onClick={e => deleteConvoFromStorage(item.id)} title="delete this conversation">&times;</button>
              </li>
          })
          }
        </ul>
      }

      <p>
        {!makingConvo && <button onClick={promptNewConversation} type="button">create conversation</button>}

        {makingConvo && <span>
          <input type="text" onInput={updateConvoName} />
          <button onClick={createNewConvo} type="button">make</button>
          <button onClick={cancelNewConvo} type="button">cancel</button>
        </span>}
      </p>
    </div>
  )
}

export default ConversationList
