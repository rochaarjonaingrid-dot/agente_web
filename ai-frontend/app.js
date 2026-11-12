let conversationHistory = [];

async function sendMessage() {
  const inputField = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const text = inputField.value.trim();
  if (!text) return;

  // 1. Mostrar mensaje del usuario en la UI
  appendMessage(text, 'user');
  inputField.value = '';
  conversationHistory.push({ role: 'user', content: text });

  // Mostrar "Pensando..."
  const thinkingDiv = document.createElement('div');
  thinkingDiv.className = 'message thinking';
  thinkingDiv.textContent = 'Pensando';
  chatBox.appendChild(thinkingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // 2. Enviar petición al backend
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: conversationHistory.slice(0, -1) // historial previo
      })
    });

    const data = await response.json();

    // Quitar "Pensando..."
    thinkingDiv.remove();

    if (data.reply) {
      // 3. Mostrar respuesta del agente
      appendMessage(data.reply, 'assistant');
      conversationHistory.push({ role: 'assistant', content: data.reply });
    } else {
      appendMessage('Error: No se pudo obtener respuesta del servidor.', 'assistant');
    }
  } catch (error) {
    console.error('Error de red:', error);
    thinkingDiv.remove();
    appendMessage('Error de conexión con el servidor.', 'assistant');
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(text, sender) {
  const chatBox = document.getElementById('chatBox');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}