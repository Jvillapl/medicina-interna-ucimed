# 🚀 Guía Completa para Desplegar en Netlify

## 📋 Paso a Paso - ¡Tu página web pública en minutos!

### 1️⃣ **Crear Cuenta en GitHub** (si no tienes)
1. Ve a [github.com](https://github.com)
2. Clic en "Sign up"
3. Completa con tu información:
   - Username: `jose-villaplana` (sugerido)
   - Email: tu email
   - Password: contraseña segura

### 2️⃣ **Subir tu Proyecto a GitHub**
```bash
# En la terminal (ya ejecutado):
git init
git add .
git commit -m "Initial commit"

# Ahora necesitas conectar con GitHub:
# 1. Crea un nuevo repositorio en GitHub llamado "medicina-interna-ucimed"
# 2. Ejecuta estos comandos:
git branch -M main
git remote add origin https://github.com/TU_USUARIO/medicina-interna-ucimed.git
git push -u origin main
```

### 3️⃣ **Desplegar en Netlify**
1. Ve a [netlify.com](https://netlify.com)
2. Clic en "Sign up" → "GitHub" (usa tu cuenta GitHub)
3. Clic en "New site from Git"
4. Selecciona "GitHub" → Autoriza Netlify
5. Busca tu repositorio "medicina-interna-ucimed"
6. Configuración automática detectada:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. Clic en "Deploy site"

### 4️⃣ **¡Tu Página Estará Online! 🎉**
- URL automática: `https://random-name-12345.netlify.app`
- Puedes cambiar el nombre en: Site settings → Change site name
- Sugerido: `medicina-interna-ucimed.netlify.app`

### 5️⃣ **Dominio Personalizado (Opcional)**
Si quieres: `medicina-interna-ucimed.com`
- Compra dominio en: Namecheap, GoDaddy, etc. (~$12/año)
- En Netlify: Domain settings → Add custom domain

## 🔧 **Configuración Automática Incluida**
✅ **SSL/HTTPS**: Automático y gratis
✅ **Redirects**: Configurado para React Router
✅ **Cache**: Optimizado para rendimiento
✅ **Compress**: Archivos comprimidos automáticamente
✅ **Deploy**: Automático en cada push a GitHub

## 🚀 **Próximos Pasos Después del Deploy**
1. **Compartir la URL** con el equipo de Medicina Interna
2. **Añadir Analytics**: Google Analytics (opcional)
3. **Dominio personalizado**: Si desean uno profesional
4. **Formulario de contacto**: Configurar Netlify Forms

## 📧 **¿Necesitas Ayuda?**
Si tienes dudas en cualquier paso:
- GitHub: Crear cuenta y repositorio
- Netlify: Proceso de deploy
- Dominio: Configuración personalizada

¡Tu página estará online y accesible para todos los estudiantes! 🌐

---

**Archivos ya preparados para deploy:**
- ✅ `netlify.toml` - Configuración de Netlify
- ✅ `.gitignore` - Archivos a ignorar  
- ✅ `package.json` - Dependencies y scripts
- ✅ `README.md` - Documentación del proyecto
- ✅ Git repository inicializado

**¡Todo listo para subir a GitHub y desplegar!** 🚀
