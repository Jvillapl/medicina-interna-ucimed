# 🗄️ Configuración de Supabase para Medicina Interna UCIMED

## 📋 Pasos de configuración

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Sign up con GitHub
3. **New project**:
   - Nombre: `medicina-interna-ucimed`
   - Región: `Central US`
   - Password: [genera una segura]

### 2. Ejecutar SQL para crear tabla
En **SQL Editor** de Supabase, ejecuta el contenido de `supabase-setup.sql`

### 3. Obtener credenciales
En **Settings > API**:
- **URL**: `https://[tu-proyecto].supabase.co`
- **anon public**: `eyJhbGciOiJIUz...` (API Key pública)

### 4. Configurar variables de entorno

#### Desarrollo local:
```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales:
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
```

#### Producción (Netlify):
1. Ve a tu sitio en Netlify
2. **Site settings** > **Environment variables**
3. Agregar:
   - `VITE_SUPABASE_URL`: tu URL
   - `VITE_SUPABASE_ANON_KEY`: tu API key

### 5. Verificar funcionamiento
1. `npm run dev`
2. Probar formulario "Proponer artículo"
3. Verificar que aparezca en Supabase > **Table Editor** > `article_submissions`

## 🎯 Funcionalidades implementadas

### ✅ Para usuarios (formulario):
- Validación completa de campos
- Envío a base de datos PostgreSQL
- Notificación de éxito/error
- Respaldo local automático si falla conexión

### ✅ Para administradores (Supabase dashboard):
- **Tabla `article_submissions`** con todos los envíos
- **Filtros y búsqueda** por área, estado, fecha
- **Dashboard con estadísticas** en tiempo real
- **Exportación** a CSV/JSON
- **Notificaciones** automáticas por email (configurable)

## 📊 Estructura de datos

```sql
article_submissions:
├── id (UUID, primary key)
├── title (texto, requerido)
├── authors (texto, requerido) 
├── summary (texto, requerido)
├── keywords (texto, opcional)
├── area (texto, requerido) - Cardio, Nefrología, etc.
├── doi (texto, opcional)
├── pdf_url (texto, opcional)
├── ethics_declaration (boolean)
├── status (pending/approved/rejected)
├── submitted_at (timestamp)
├── reviewed_at (timestamp, opcional)
└── reviewer_notes (texto, opcional)
```

## 🔐 Seguridad

- **Row Level Security (RLS)** habilitado
- **Políticas**: Solo INSERT público, SELECT para admins
- **Validación**: Frontend + backend
- **API Keys**: Solo anon key en frontend (seguro)

## 🚀 Próximos pasos sugeridos

1. **Dashboard admin**: Crear interfaz para revisar envíos
2. **Notificaciones email**: Configurar con Resend/SendGrid
3. **Moderación**: Sistema de aprovación/rechazo
4. **Analytics**: Métricas de envíos por área médica

## 📧 Soporte

Si tienes problemas:
1. Verificar credenciales en **Settings > API**
2. Comprobar políticas RLS en **Authentication > Policies**
3. Ver logs en **Logs > Database**
