export async function getOllamaModels(OLLAMA_URL) {
  try {
    // this.conlog(`OL:fetching from ${state.baseURL}/api/tags`);

    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    const data = await response.json();
    const modelList = data.models || [];

    return modelList;
  } catch (error) {
    throw new Error('ollama server not found');
  } finally {
    // setLoading(false);
  }
}
