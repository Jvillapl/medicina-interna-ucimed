# 🤖 MediBot UCIMED - Chatbot de Medicina Interna

## 📋 Descripción

MediBot es un asistente de IA especializado en medicina interna para estudiantes de UCIMED. Utiliza ChatGPT-4 para proporcionar información educativa sobre:

- 🫀 **Cardiología**
- 🩺 **Nefrología**  
- 🧬 **Endocrinología**
- 🫁 **Neumología**
- 🦠 **Infectología**
- 🍃 **Gastroenterología**
- 🦴 **Reumatología**
- 🩸 **Hematología**

## ✨ Características

### 🔒 **Seguridad Médica**
- Disclaimers automáticos en cada respuesta
- No proporciona diagnósticos definitivos
- Sugiere consulta profesional cuando es necesario
- Referencias a guías oficiales (AHA/ACC, KDIGO, etc.)

### 🎯 **Funcionalidades**
- **Chat en tiempo real** con respuestas especializadas
- **Preguntas frecuentes** predefinidas por especialidad
- **Historial de conversación** durante la sesión
- **Interfaz intuitiva** con diseño profesional médico
- **Estadísticas de uso** (queries, tokens utilizados)

### 📱 **Diseño Responsivo**
- Botón flotante accesible
- Modal overlay con diseño moderno
- Animaciones suaves con Framer Motion
- Compatible con móviles y desktop

## 🛠️ Configuración

### 1. **Obtener API Key de OpenAI**
1. Ve a [platform.openai.com](https://platform.openai.com/api-keys)
2. Crea una nueva API key
3. Copia la key (empieza con `sk-proj-...`)

### 2. **Configurar Variables de Entorno**

#### Desarrollo local:
```bash
# Editar .env.local
VITE_OPENAI_API_KEY=sk-proj-tu-api-key-aqui
```

#### Producción (Netlify):
1. Site settings > Environment variables
2. Agregar: `VITE_OPENAI_API_KEY` = tu API key

### 3. **Verificar Funcionamiento**
1. `npm run dev`
2. Hacer clic en el botón de chat (esquina inferior derecha)
3. Probar con una pregunta: "¿Cuál es el manejo de crisis hipertensiva?"

## 💰 Costos Estimados

### **Desarrollo/Testing:**
- ~$2-5/día con uso moderado
- ~1000 preguntas = $15-30

### **Producción:**
- **Uso bajo** (50 consultas/día): $20-40/mes
- **Uso medio** (200 consultas/día): $60-120/mes
- **Uso alto** (500 consultas/día): $150-300/mes

*Nota: Costos basados en GPT-4 pricing de OpenAI*

## 🔧 Personalización

### **Prompt del Sistema**
El chatbot usa un prompt especializado en `src/lib/medicalChat.js`:
- Especialización en medicina interna
- Disclaimers automáticos
- Referencias a guías oficiales
- Tono profesional pero amigable

### **Preguntas Frecuentes**
Agrega nuevas FAQ en `MEDICAL_FAQ`:
```javascript
{
  id: 'nueva-pregunta',
  question: '¿Pregunta sobre medicina?',
  category: 'Especialidad'
}
```

### **Estilos Visuales**
- Colores: Azul médico profesional
- Iconos: Stethoscope, Brain, Bot
- Animaciones: Suaves y profesionales

## 📊 Analytics y Monitoreo

### **Estadísticas Incluidas:**
- Total de consultas realizadas
- Tokens utilizados (para estimar costos)
- Última fecha de uso
- Almacenamiento local automático

### **Para Análisis Avanzado:**
Se puede integrar con:
- Google Analytics para tracking de uso
- Supabase para almacenar conversaciones
- Dashboard administrativo para métricas

## 🚀 Mejoras Futuras

### **Fase 2:**
- [ ] Sistema de rating de respuestas
- [ ] Export de conversaciones a PDF
- [ ] Modo offline con respuestas predefinidas
- [ ] Integración con base de datos médica local

### **Fase 3:**
- [ ] Reconocimiento de voz
- [ ] Calculadoras médicas integradas
- [ ] Sistema de referencias bibliográficas
- [ ] Dashboard para administradores

## ⚠️ Disclaimers Legales

### **Importante:**
- ✅ Solo información educativa
- ❌ No sustituye consulta médica
- ❌ No proporciona diagnósticos
- ❌ No recomendaciones de tratamiento específico
- ✅ Siempre sugiere consulta profesional

### **Mensaje Automático:**
Cada respuesta incluye:
> "⚠️ **Disclaimer**: Esta información es solo educativa. No sustituye consulta médica profesional. Para emergencias, contacta servicios locales."

## 🔗 Enlaces Útiles

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Pricing Calculator](https://openai.com/pricing)
- [Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

---

**Desarrollado para UCIMED - Grupo de Interés en Medicina Interna**
