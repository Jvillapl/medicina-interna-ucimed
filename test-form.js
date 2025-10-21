// Test del sistema de envío de artículos
// Este archivo simula el envío sin configurar Supabase real

import { submitArticle } from './src/lib/supabase.js';

// Datos de prueba
const testArticle = {
  title: "Manejo de Hipertensión Arterial en Urgencias",
  authors: "Test Author, Demo User",
  summary: "Guía rápida para el manejo inicial de crisis hipertensivas en el servicio de urgencias. Incluye algoritmos de decisión y dosis de medicamentos de primera línea.",
  keywords: "hipertensión, urgencias, crisis hipertensiva",
  area: "Cardio",
  doi: "https://doi.org/10.1234/test.2025",
  pdf: "https://example.com/test.pdf",
  ethics: true
};

// Función de prueba
async function testSubmission() {
  console.log('🧪 Iniciando test de envío de artículo...');
  console.log('📄 Datos de prueba:', testArticle);
  
  const result = await submitArticle(testArticle);
  
  if (result.success) {
    console.log('✅ Test EXITOSO: Artículo enviado correctamente');
    console.log('📊 Datos guardados:', result.data);
  } else {
    console.log('❌ Test FALLIDO (esperado sin configurar Supabase)');
    console.log('🔍 Error:', result.error);
    console.log('ℹ️  Esto es normal sin credenciales de Supabase configuradas');
  }
}

// Exportar para uso manual
export { testSubmission, testArticle };

console.log(`
🧪 ARCHIVO DE TESTING CREADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para testear manualmente el formulario:
1. Abrir consola del navegador (F12)
2. Navegar a la sección "Proponer artículo"  
3. Llenar el formulario con datos reales
4. Hacer clic en "Enviar"

Resultados esperados SIN Supabase configurado:
❌ Error de conexión (normal)
✅ Guardado local como respaldo (funciona)

Resultados esperados CON Supabase configurado:
✅ Envío exitoso a base de datos
✅ Notificación de éxito
✅ Formulario se limpia automáticamente
`);
