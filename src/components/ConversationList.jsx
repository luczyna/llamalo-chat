import { useState } from 'react';
import * as sts from '../services/storageService.js';

import ConversationMaker from './ConversationMaker.jsx';

// ConversationList props
// {
//   list: chatlist of ollama conversations
//   model: current model
//   activeConvo: current conversation
//   updateConvoList: setState for convolist
//   updateActiveConvo: setState for active convo
//   scrollToConvoListBottom: as it says
//   ctx: status of connection to Ollama
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
    if (props.ctx !== 1) return;

    const id = event.target.getAttribute('datakey');
    props.updateActiveConvo(id);
    window.setTimeout(() => {
      props.scrollToConversationListBottom();
    }, 150);
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
        <ul className={"convolist-items " + ((props.ctx !== 1) ? ' cursor-not-allowed' : '' )}>
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

      <div className={"list-controls" + ((props.ctx !== 1) ? ' cursor-not-allowed' : '')}>
        {!makingConvo && <>
          <button onClick={promptNewConversation} type="button" class="btnb btn-default grow">create conversation</button>
        </>}

        {makingConvo && <ConversationMaker update={setConvoName} create={createNewConvo} cancel={cancelNewConvo} />}
      </div>
    </div>
  )
}

export default ConversationList
