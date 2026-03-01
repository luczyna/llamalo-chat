import { useState } from 'react';
import * as sts from '../services/storageService.js';

// props
// {
//   ready: is the app ready to send this REQUEST,
//   list: chatlist of ollama conversations
//   model: current model
//   activeConvo: current conversation
//   requestOllamaResponse: send the message responsibility up to parent App
// }
function ConversateForm(props) {
  const [message, setMessage] = useState('');
  const [submittable, setSubmittable] = useState(false);

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
    sts.updateConvUserSays(props.activeConvo, props.model, message, props.list);
    setMessage('');
    props.requestOllamaResponse();
  }

  function hextras() {
    // placeholder for whats to come
  }

  const disabled = !submittable || !props.activeConvo.length || !props.ready;

  return (
    <div class="message-composer-wrapper">
      <div class="wrapper-center">
        <textarea class="composer-area" value={message} onChange={captureMessage} />

        <div class="composer-controls">
          <button type="button" onClick={sendConvoMessage} disabled={disabled} class="btnb btn-action grow mt-2">send</button>
          <button type="button" onClick={hextras} class="btnb btn-default">adjust</button>
        </div>
      </div>
    </div>
  )
}

export default ConversateForm
