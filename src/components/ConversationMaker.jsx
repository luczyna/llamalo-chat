import { useEffect, useRef } from 'react';

// ConversationMaker props
// {
//   name: conversation name
//   update: update the conversation name state
//   create: yup
//   cancel: nope
// }
function ConversationMaker(props) {
  const conversationNameRef = useRef(null);

  useEffect(() => {
    conversationNameRef.current.focus();
  });

  function updateName(e) {
    props.update(e.target.value);
  }

  return <>
    <label class="text-form-piece grow">
      <span class="text-label">name the conversation</span>
      <input type="text" onInput={updateName} class="text-input new-convo-input" ref={conversationNameRef} />
    </label>
    <button onClick={props.create} type="button" class="btnb btn-action mr-2 grow">make</button>
    <button onClick={props.cancel} type="button" class="btnb btn-cancel">cancel</button>
  </>
}

export default ConversationMaker
