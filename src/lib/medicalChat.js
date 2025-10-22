// Prompt especializado en medicina interna
const MEDICAL_SYSTEM_PROMPT = `
Eres un asistente especializado en Medicina Interna para estudiantes de medicina de UCIMED. 

REGLAS IMPORTANTES:
1. Solo responde preguntas relacionadas con medicina interna
2. Siempre incluye disclaimers de que no sustituyes consulta médica
3. Basa respuestas en guías oficiales (AHA/ACC, KDIGO, ADA, ESC, etc.)
4. Incluye referencias cuando sea posible
5. Si no estás seguro, sugiere consultar fuentes oficiales
6. Para emergencias, sugiere contactar servicios locales

ESPECIALIDADES QUE CUBRES:
- Cardiología
- Nefrología  
- Endocrinología
- Gastroenterología
- Infectología
- Neumología
- Reumatología
- Hematología

FORMATO DE RESPUESTA:
- Respuesta clara y educativa
- Referencias a guías cuando aplique
- Disclaimer médico obligatorio
- Sugerencias de lectura adicional

Responde siempre en español y mantén un tono profesional pero amigable para estudiantes.
`;

// Función para enviar mensaje al chatbot usando fetch directo
export async function sendMedicalQuery(message, conversationHistory = []) {
  try {
    console.log('🔍 Verificando configuración...');
    
    // Verificar que hay API key configurada
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('API Key presente:', apiKey ? 'SÍ' : 'NO');
    console.log('API Key válida:', apiKey && apiKey.startsWith('sk-') ? 'SÍ' : 'NO');
    
    if (!apiKey || apiKey === 'your-api-key-here' || apiKey === 'PEGA_TU_API_KEY_AQUI') {
      return {
        success: false,
        error: 'API de ChatGPT no configurada. Agrega tu API key en las variables de entorno.'
      };
    }

    if (!apiKey.startsWith('sk-')) {
      return {
        success: false,
        error: 'API key inválida. Debe empezar con "sk-"'
      };
    }

    console.log('✅ API Key configurada correctamente');
    console.log('📤 Enviando consulta:', message.substring(0, 50) + '...');

    // Preparar mensajes para la conversación
    const messages = [
      { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
      ...conversationHistory.slice(-4).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('📝 Mensajes preparados:', messages.length);

    // Usar fetch directo en lugar del SDK de OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 600,
        temperature: 0.3,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    console.log('📡 Respuesta HTTP:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error de API:', errorData);
      throw new Error(`HTTP ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();
    console.log('✅ Respuesta recibida de OpenAI');

    const responseText = data.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('No se recibió respuesta del modelo');
    }

    // Agregar disclaimer automático si no está presente
    const disclaimerText = "\n\n⚠️ **Disclaimer**: Esta información es solo educativa. No sustituye consulta médica profesional. Para emergencias, contacta servicios locales.";
    
    const finalResponse = responseText.includes('Disclaimer') || responseText.includes('disclaimer') 
      ? responseText 
      : responseText + disclaimerText;

    console.log('✅ Consulta médica completada exitosamente');

    return {
      success: true,
      response: finalResponse,
      tokensUsed: data.usage?.total_tokens || 0
    };

  } catch (error) {
    console.error('❌ Error en consulta médica:', error);
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
    
    let errorMessage = 'Error de conexión con el servicio de IA.';
    
    if (error.message.includes('401')) {
      errorMessage = 'API key no autorizada. Verifica que sea válida y tenga créditos.';
    } else if (error.message.includes('429')) {
      errorMessage = 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.';
    } else if (error.message.includes('insufficient_quota')) {
      errorMessage = 'Límite de API alcanzado. Verifica tu suscripción de OpenAI.';
    } else if (error.message.includes('CORS')) {
      errorMessage = 'Error de CORS. Necesitamos configurar un proxy para producción.';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Error de red. Verifica tu conexión a internet.';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

// Preguntas frecuentes predefinidas
export const MEDICAL_FAQ = [
  {
    id: 'hipertension',
    question: '¿Cuál es el manejo inicial de crisis hipertensiva?',
    category: 'Cardiología'
  },
  {
    id: 'diabetes',
    question: '¿Cuáles son los criterios diagnósticos de diabetes tipo 2?',
    category: 'Endocrinología'
  },
  {
    id: 'insuficiencia-renal',
    question: '¿Cómo se clasifica la lesión renal aguda según KDIGO?',
    category: 'Nefrología'
  },
  {
    id: 'insuficiencia-cardiaca',
    question: '¿Cuál es el tratamiento de primera línea para insuficiencia cardíaca?',
    category: 'Cardiología'
  },
  {
    id: 'cirrosis',
    question: '¿Cómo se calcula y qué significa el score Child-Pugh?',
    category: 'Gastroenterología'
  }
];

// Función para obtener estadísticas de uso
export function getChatStats() {
  const stats = localStorage.getItem('medical_chat_stats');
  return stats ? JSON.parse(stats) : { totalQueries: 0, lastUsed: null };
}

// Función para guardar estadísticas
export function saveChatStats(tokensUsed) {
  const currentStats = getChatStats();
  const newStats = {
    totalQueries: currentStats.totalQueries + 1,
    lastUsed: new Date().toISOString(),
    totalTokens: (currentStats.totalTokens || 0) + tokensUsed
  };
  localStorage.setItem('medical_chat_stats', JSON.stringify(newStats));
}
