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
  const activeConvo = props.list.find(c => c.id === props.convo);
  const defaultName = activeConvo.name;
  const defaultModel = activeConvo.model;
  let defaultOptions = {
    temperature: undefined,
    top_k: undefined,
    top_p: undefined,
    num_ctx: undefined,
    num_predict: undefined,
    seed: undefined
  };

  const hasOptions = Object.keys(activeConvo).includes('options');
  const actuallyHasOptions = hasOptions && Object.keys(activeConvo.options).length;

  if (hasOptions && actuallyHasOptions) {
    Object.keys(activeConvo.options).forEach((item, i) => {
      defaultOptions[item] = activeConvo.options[item]
    });
  }
  
  const [currentConvoName, setCurrentConvoName] = useState(defaultName);
  const [currentConvoModel, setCurrentConvoModel] = useState(defaultModel);
  const [currentConvoinSettings, setCurrentConvoinSettings] = useState(props.convo);

  const [convoTemp, setConvoTemp] = useState(defaultOptions.temperature);
  const [convoTopP, setConvoTopP] = useState(defaultOptions.top_k);
  const [convoTopK, setConvoTopK] = useState(defaultOptions.top_p);
  const [convoCtxNum, setConvoCtxNum] = useState(defaultOptions.num_ctx);
  const [convoPredictNum, setConvoPredictNum] = useState(defaultOptions.num_predict);
  const [convoSeed, setConvoSeed] = useState(defaultOptions.seed);

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
      // let promptUpdates = false;

      if (currentConvoName !== activeConvo.name) {
        sts.updateConvName(props.convo, currentConvoName, props.list);
        madeUpdates = true;
      }

      if (currentConvoModel !== activeConvo.model) {
        sts.updateConvModel(props.convo, currentConvoModel, props.list);
        props.updateActiveModel(currentConvoModel);
        madeUpdates = true;
      }

      let promptOptions = {};
      if (convoTemp !== undefined) promptOptions.temperature = parseFloat(convoTemp);
      if (convoTopP !== undefined) promptOptions.top_k = parseFloat(convoTopP);
      if (convoTopK !== undefined) promptOptions.top_p = parseFloat(convoTopK);
      if (convoCtxNum !== undefined) promptOptions.num_ctx = parseInt(convoCtxNum);
      if (convoPredictNum !== undefined) promptOptions.num_predict = parseInt(convoPredictNum);
      if (convoSeed !== undefined) promptOptions.seed = parseInt(convoSeed);

      if (promptOptions !== activeConvo.options) {
        sts.updateConvOptions(props.convo, promptOptions, props.list);
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
          <input type="text" onInput={e => {setCurrentConvoName(e.target.value)}} value={currentConvoName} class="text-input" />
        </label>

        <label class="text-label" title="override the conversation model default">
          <span class="text-label">choose default model for this conversation</span>
          <select class="select-input" onChange={e => setCurrentConvoModel(e.target.value)} value={currentConvoModel}>
            {props.modellist.map(model => {
              return <option value={model.name} key={model.id+model.name}>{model.name}</option>
            })}
          </select>
        </label>

        <hr class="my-6 border-emerald-400 border-1"/>

        <div class="convo-options">
          <label class="text-form-piece halfcol">
            <span class="text-label">temperature </span>
            <input type="text" onInput={e => {setConvoTemp(e.target.value)}} value={convoTemp} class="text-input new-convo-inputs" />
            <span class="prompt-desc-helper">(controls the randomness: Low 0.1 stick closely to high-probability tokens, ideal for precise tasks;
    High 0.9 increases randomness</span>
          </label>
          <label class="text-form-piece halfcol">
            <span class="text-label">top_p </span>
            <input type="text" onInput={e => {setConvoTopP(e.target.value)}} value={convoTopP} class="text-input new-convo-inputs" />
            <span class="prompt-desc-helper">(dynamically adjusts based on probability, making it more flexible for tasks requiring varied outputs.)</span>
          </label>
          <label class="text-form-piece halfcol">
            <span class="text-label">top_k </span>
            <input type="text" onInput={e => {setConvoTopK(e.target.value)}} value={convoTopK} class="text-input new-convo-inputs" />
            <span class="prompt-desc-helper">(narrowing the model’s “vocabulary” to a shortlist of top contenders. A smaller K value keeps things tight and controlled, while a larger K allows for more creativity)</span>
          </label>
          <label class="text-form-piece halfcol">
            <span class="text-label">num_ctx </span>
            <input type="text" onInput={e => {setConvoCtxNum(e.target.value)}} value={convoCtxNum} class="text-input new-convo-inputs" />
            <span class="prompt-desc-helper">(how much to read from prompt, number of tokens)</span>
          </label>
          <label class="text-form-piece halfcol">
            <span class="text-label">num_predict</span>
            <input type="text" onInput={e => {setConvoPredictNum(e.target.value)}} value={convoPredictNum} class="text-input new-convo-inputs" />
            <span class="prompt-desc-helper">(how much to respond with)</span>
          </label>
          <label class="text-form-piece halfcol">
            <span class="text-label">seed</span>
            <input type="text" onInput={e => {setConvoSeed(e.target.value)}} value={convoSeed} class="text-input new-convo-inputs" />
            <span class="prompt-desc-helper">(used for reproducible outputs)</span>
          </label>
        </div>
      </div>

      <footer class="defaults-footer">
        <button type="button" class="btnb btn-cancel" onClick={e => { hideConvoSettings(false) }}>close settings</button>
        <button type="button" class="btnb btn-blah ml-2" onClick={e => { hideConvoSettings(true) }}>discard and close</button>
      </footer>
    </div>
  )
}

export default ConversationSettings
