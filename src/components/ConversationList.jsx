import { useState } from 'react';
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
    if (props.activeConvo === convoId) {
      props.updateActiveConvo('');
    }

    sts.deleteConversation(convoId, props.list);
    const updates = sts.getConversations();
    props.updateConvoList(updates);
  }

  return (
    <div class="conversation-list">
      {!props.list.length && <p>there are no conversations...</p>}

      {(props.list.length > 0) &&
        <ul class="convolist-items">
          {props.list.map((item, i) => {
            return <li key={item.id}
              className={"convoListName " + ((props.activeConvo === item.id) ? 'activeConvoName' : 'notactive')}>
                <span class="convoListValue" onClick={setActiveConvo} datakey={item.id}>{item.name}</span>

                <button type="button" onClick={e => deleteConvoFromStorage(item.id)} title="delete this conversation" class="btn-link ml-2">&times;</button>
              </li>
          })
          }
        </ul>
      }

      <div class="list-controls">
        {!makingConvo && <>
          <button onClick={promptNewConversation} type="button" class="btn-default grow">create conversation</button>
        </>}

        {makingConvo && <>
          <label class="text-form-piece grow">
            <span class="text-label">name the conversation</span>
            <input type="text" onInput={updateConvoName} class="text-input new-convo-input" />
          </label>
          <button onClick={createNewConvo} type="button" class="btn-action mr-2 grow">make</button>
          <button onClick={cancelNewConvo} type="button" class="btn-cancel">cancel</button>
        </>}
      </div>
    </div>
  )
}

export default ConversationList
