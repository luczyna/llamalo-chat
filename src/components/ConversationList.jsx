import { useState, useContext } from 'react';
import * as sts from '../services/storageService.js';

import ConversationMaker from './ConversationMaker.jsx';
import { ModelContext } from '../context/ModelContext.js';
import { ConversationContext } from '../context/ConversationContext.js';
import { ConnectionContext } from '../context/ConnectionContext.js';

// props: {scrollToConversationListBottom}
function ConversationList(props) {
  const [makingConvo, setConvoMakingToggle] = useState(false);
  const [convoName, setConvoName] = useState('');
  const { model, updateModellist } = useContext(ModelContext);
  const { connectionStatus: ctx } = useContext(ConnectionContext);
  const { convolist, activeConvoId, updateConvoList, updateActiveConvo } = useContext(ConversationContext);

  function promptNewConversation() {
    setConvoMakingToggle(true);
  }

  function createNewConvo() {
    if (convoName.length) {
      const newconvoId = sts.saveConversation(convoName, model, convolist);
      cancelNewConvo();

      const updates = sts.getConversations();
      updateConvoList(updates);
      updateActiveConvo(newconvoId);
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
    if (ctx !== 1) return;

    const id = event.target.getAttribute('datakey');
    updateActiveConvo(id);
    window.setTimeout(() => {
      props.scrollToConversationListBottom();
    }, 150);
  }

  function deleteConvoFromStorage(convoId) {
    if (activeConvoId === convoId) {
      updateActiveConvo('');
    }

    sts.deleteConversation(convoId, convolist);
    const updates = sts.getConversations();
    updateConvoList(updates);
  }

  return (
    <div class="conversation-list">
      {!convolist.length && <p>there are no conversations...</p>}

      {(convolist.length > 0) &&
        <ul className={"convolist-items " + ((ctx !== 1) ? ' cursor-not-allowed' : '' )}>
          {convolist.map((item, i) => {
            return <li key={item.id}
              className={"convoListName " + ((activeConvoId === item.id) ? 'activeConvoName' : 'notactive')}>
                <span class="convoListValue" onClick={setActiveConvo} datakey={item.id}>{item.name}</span>

                <button type="button" onClick={e => deleteConvoFromStorage(item.id)} title="delete this conversation" class="btn-link ml-2">&times;</button>
              </li>
          })
          }
        </ul>
      }

      <div className={"list-controls" + ((ctx !== 1) ? ' cursor-not-allowed' : '')}>
        {!makingConvo && <>
          <button onClick={promptNewConversation} type="button" class="btnb btn-default grow">create conversation</button>
        </>}

        {makingConvo && <ConversationMaker update={setConvoName} create={createNewConvo} cancel={cancelNewConvo} />}
      </div>
    </div>
  )
}

export default ConversationList
