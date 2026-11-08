import { useState, useContext } from 'react';
import * as sts from '../services/storageService.js';
import { ConversationContext } from '../context/ConversationContext.js';
import { ConnectionContext } from '../context/ConnectionContext.js';
import { ModelContext } from '../context/ModelContext.js';

// props
// {
//   requestOllamaResponse: send the message responsibility up to parent App
// }
function ConversateForm(props) {
  const [message, setMessage] = useState('');
  const [submittable, setSubmittable] = useState(false);
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  const [overrideDefaultModel, setOverrideDefaultModel] = useState(null);

  const {convolist: list, activeConvoId} = useContext(ConversationContext);
  const activeConvo = list !== undefined ? list.find(l => l.id === activeConvoId) : undefined;
  const { connectionStatus } = useContext(ConnectionContext);
  const ready = (connectionStatus === 1);
  const {model, modellist} = useContext(ModelContext);

  function captureMessage(event) {
    const value = event.target.value;

    setMessage(value);

    if (!value.length && submittable) {
      setSubmittable(false);
    } else if (value.length && !submittable) {
      setSubmittable(true);
    }
  }

  function sendConvoMessage() {
    const usemodel = (overrideDefaultModel) ? overrideDefaultModel : model;

    sts.updateConvUserSays(activeConvoId, usemodel, message, list);
    setMessage('');
    props.requestOllamaResponse();
  }

  function togglePromptSettings() {
    setShowPromptSettings(!showPromptSettings);
  }

  function hidePromptSettings() {
    setShowPromptSettings(false);
  }

  const disabled = !submittable || !activeConvoId.length || !ready;
  // console.log([submittable, activeConvoId, ready, disabled]);
  

  // <button type="button" onClick={togglePromptSettings} class="btnb btn-default">adjust</button>
  // {(activeConvo !== undefined && <>
  //   {(showPromptSettings) && <div class="prompt-conversation-defaults">
  //     <div class="defaults-wrapper">
  //       <label class="text-label" title="override the conversation model default">
  //         <span>choose model for this message</span>
  //         <select class="select-input" onChange={e => setOverrideDefaultModel(e.target.value)} value={list.find(c => c.id === activeConvo).model}>
  //           {modellist.map(model => {
  //             return <option value={model.name} key={model.id}>{model.name}</option>
  //           })}
  //         </select>
  //       </label>
  //     </div>
  //     <footer class="defaults-footer">
  //       <button type="button" class="btnb btn-cancel" onClick={hidePromptSettings}>close settings</button>
  //     </footer>
  //   </div>}
  // </>)}
  // mt-2 >>> class for the send btn
  return (
    <div class="message-composer-wrapper">
      <div class="wrapper-center">
        <textarea class="composer-area" value={message} onChange={captureMessage} />

        <div class="composer-controls">
          <button type="button" onClick={sendConvoMessage} disabled={disabled} class="btnb btn-action grow ">send</button>
        </div>
      </div>

    </div>
  )
}

export default ConversateForm
