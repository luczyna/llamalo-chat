# llamalo - chat with Ollama llms

llamalo is a simple chat interface for those looking to work with large language models on their local machines with [Ollama](https://ollama.com/).

![start screen for llamalo, ready to chat](/public/llamalo-ready.png)

_llamalo, ready to chat_

## Requirements and Getting Started

You should have Ollama downloaded and ready to go. Then you can clone this repo, install the required dependancies, and get it running.

``` bash
npm install
npx vite
```

## Features

**Create conversations**

Like in other AI chat interfaces, you can organise your thoughts and projects into conversations.

**Choose any llm**

Each conversation gets a default llm you can set, and you can change it any time for the whole conversation or for a single message. `TODO: modification of llm query parameters`

**Locally stored**

All messages and conversations are stored locally on the browser using [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

*more features to come!*
