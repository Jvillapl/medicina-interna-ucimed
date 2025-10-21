import { createClient } from '@supabase/supabase-js'

// Variables de entorno - configurar en .env o Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

// Solo crear cliente si tenemos credenciales reales
let supabase = null;
try {
  if (supabaseUrl !== 'https://demo.supabase.co' && supabaseKey !== 'demo-key') {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.warn('Supabase not configured, using local storage fallback');
}

export { supabase }

// Función para enviar formulario de artículo
export async function submitArticle(articleData) {
  // Si Supabase no está configurado, usar almacenamiento local
  if (!supabase) {
    console.info('Supabase not configured, saving locally');
    return { 
      success: false, 
      error: 'Base de datos no configurada. Guardando localmente como respaldo.' 
    };
  }

  try {
    const { data, error } = await supabase
      .from('article_submissions')
      .insert([
        {
          title: articleData.title,
          authors: articleData.authors,
          summary: articleData.summary,
          keywords: articleData.keywords,
          area: articleData.area,
          doi: articleData.doi,
          pdf_url: articleData.pdf,
          ethics_declaration: articleData.ethics,
          submitted_at: new Date().toISOString(),
          status: 'pending' // pending, approved, rejected
        }
      ])
      .select()

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error submitting article:', error)
    return { success: false, error: error.message }
  }
}

// Función para obtener estadísticas
export async function getSubmissionStats() {
  if (!supabase) {
    return 0; // Devolver 0 si no hay conexión
  }
  
  try {
    const { count, error } = await supabase
      .from('article_submissions')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count
  } catch (error) {
    console.error('Error getting stats:', error)
    return 0
  }
}
