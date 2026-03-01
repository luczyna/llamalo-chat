import { useState } from 'react';
import * as sts from '../services/storageService.js';

// props
// {
//   ready: is the app ready to send this REQUEST,
//   list: chatlist of ollama conversations
//   model: current model
//   modellist: models to choose from
//   activeConvo: current conversation
//   requestOllamaResponse: send the message responsibility up to parent App
// }
function ConversateForm(props) {
  const [message, setMessage] = useState('');
  const [submittable, setSubmittable] = useState(false);
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  const [overrideDefaultModel, setOverrideDefaultModel] = useState(null);

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
    const model = (overrideDefaultModel) ? overrideDefaultModel : props.model;

    sts.updateConvUserSays(props.activeConvo, model, message, props.list);
    setMessage('');
    props.requestOllamaResponse();
  }

  function togglePromptSettings() {
    setShowPromptSettings(!showPromptSettings);
  }

  function hidePromptSettings() {
    setShowPromptSettings(false);
  }



  const disabled = !submittable || !props.activeConvo.length || !props.ready;

  return (
    <div class="message-composer-wrapper">
      <div class="wrapper-center">
        <textarea class="composer-area" value={message} onChange={captureMessage} />

        <div class="composer-controls">
          <button type="button" onClick={sendConvoMessage} disabled={disabled} class="btnb btn-action grow mt-2">send</button>
          <button type="button" onClick={togglePromptSettings} class="btnb btn-default">adjust</button>
        </div>
      </div>

      {(props.activeConvo.length > 0 && <>
        {(showPromptSettings) && <div class="prompt-conversation-defaults">
          <div class="defaults-wrapper">
            <label class="text-label" title="override the conversation model default">
              <span>choose model for this message</span>
              <select class="select-input" onChange={e => setOverrideDefaultModel(e.target.value)} value={props.list.find(c => c.id === props.activeConvo).model}>
                {props.modellist.map(model => {
                  return <option value={model.name} key={model.id}>{model.name}</option>
                })}
              </select>
            </label>
          </div>
          <footer class="defaults-footer">
            <button type="button" class="btnb btn-cancel" onClick={hidePromptSettings}>close settings</button>
          </footer>
        </div>}
      </>)}
    </div>
  )
}

export default ConversateForm
