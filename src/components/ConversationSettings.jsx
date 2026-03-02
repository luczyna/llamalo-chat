import { useState,useEffect } from 'react';
import * as sts from '../services/storageService.js'

// list={convolist}
// convo={activeConvo}
// model={activeModel}
// modellist
// updateActiveModel
// updateConversations
// closeSettings

function ConversationSettings(props) {
  const activeConvo = props.list.find(c => c.id === props.convo );
  const defaultName = activeConvo.name;
  const defaultModel = activeConvo.model;

  const [currentConvoName, setCurrentConvoName] = useState(defaultName);
  const [currentConvoModel, setCurrentConvoModel] = useState(defaultModel);
  const [currentConvoinSettings, setCurrentConvoinSettings] = useState(props.convo);

  useEffect(() => {
    const isCorrectSetting = props.convo === currentConvoinSettings;

    if (!isCorrectSetting) {
      props.closeSettings(true);
    }
  })

  function openConvoSettings() {
    setShowConvoSettings(true);
  }

  function hideConvoSettings(discardChanges) {
    if (!discardChanges) {
      let madeUpdates = false;

      if (currentConvoName !== activeConvo.name) {
        sts.updateConvName(props.convo, currentConvoName, props.list);
        madeUpdates = true;
      }

      if (currentConvoModel !== activeConvo.model) {
        sts.updateConvModel(props.convo, currentConvoModel, props.list);
        props.updateActiveModel(currentConvoModel);
        madeUpdates = true;
      }

      if (madeUpdates) {
        props.updateConversations();
      }
    }

    props.closeSettings()
  }

  function updateConvoDefaultModel(e) {
    const model = e.target.value;
    setCurrentConvoModel(model);
  }

  function updateConvoName(e) {
    const name = e.target.value;
    setCurrentConvoName(name);
  }

  return (
    <div class="app-conversation-defaults">
      <div class="defaults-wrapper">
        <label class="text-form-piece block mb-4">
          <span class="text-label block">name the conversation</span>
          <input type="text" onInput={e => {setCurrentConvoName(e.target.value)}} value={currentConvoName} class="text-input new-convo-inputss" />
        </label>

        <label class="text-label" title="override the conversation model default">
          <span class="text-label">choose default model for this conversation</span>
          <select class="select-input" onChange={e => setCurrentConvoModel(e.target.value)} value={currentConvoModel}>
            {props.modellist.map(model => {
              return <option value={model.name} key={model.id+model.name}>{model.name}</option>
            })}
          </select>
        </label>
      </div>

      <footer class="defaults-footer">
        <button type="button" class="btnb btn-cancel" onClick={e => { hideConvoSettings(false) }}>close settings</button>
        <button type="button" class="btnb btn-blah ml-2" onClick={e => { hideConvoSettings(true) }}>discard and close</button>
      </footer>
    </div>
  )
}

export default ConversationSettings
