import { createClient } from '@supabase/supabase-js'

// Variables de entorno - configurar en .env o Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Función para enviar formulario de artículo
export async function submitArticle(articleData) {
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
