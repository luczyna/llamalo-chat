export async function getOllamaModels(OLLAMA_URL) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);

    if (!response.ok) {
      throw new Error('failed to fetch models');
    }

    const data = await response.json();
    const modelList = data.models || [];

    return modelList;
  } catch (error) {
    throw new Error('ollama server not found');
  }
}

export async function getOllamaResponse(OLLAMA_URL, model, conversation, updateStreamingMessage, finishedFunc) {
  try {
    const url = `${OLLAMA_URL}/api/chat`;
    const convoId = conversation.id;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: conversation.messages,
        stream: true
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const decoder = new TextDecoder();

    let accumulatedMessage = '';

    for await (const chunk of response.body) {
      const dc = decoder.decode(chunk);
      const lines = dc.split('\n');

      for (const line of lines) {
        if (line.trim() === '') continue;

        try {
          const data = JSON.parse(line);
          if (data.message?.content) {
            accumulatedMessage += data.message.content;

            updateStreamingMessage(accumulatedMessage);
          }
        } catch (e) {
          console.warn('Failed to parse line:', line);
        }
      }
    }
  } catch (e) {
    console.error('Error in chat request:', e);
    throw new Error('Error in chat request');
  } finally {
    finishedFunc();
  }
}
