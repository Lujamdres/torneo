# 🚀 Guía Rápida de Despliegue en Vercel

## Pasos para Desplegar

### 1. Preparar el Repositorio

```bash
# Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "Initial commit: Torneo de Valorant"

# Subir a GitHub
git remote add origin https://github.com/tu-usuario/torneito.git
git push -u origin main
```

### 2. Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Click en **"Add New Project"**
3. Selecciona tu repositorio `torneito`
4. En **"Environment Variables"**, agrega:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://neondb_owner:npg_ksmha6Ux0Kli@ep-tiny-snow-amz539az.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require`
5. Click en **"Deploy"**

### 3. Verificar el Despliegue

Una vez desplegado, Vercel te dará una URL como:
```
https://torneito-xxx.vercel.app
```

¡Listo! Tu aplicación está en línea 🎉

## Notas Importantes

- ✅ La base de datos ya está configurada (ejecutaste `pnpm db:init` localmente)
- ✅ Las tablas ya existen en Neon
- ✅ No necesitas hacer nada más después del despliegue
- ✅ Vercel automáticamente detecta que es un proyecto Next.js
- ✅ El despliegue es **100% gratuito**

## Actualizar la Aplicación

Cada vez que hagas cambios y los subas a GitHub:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Vercel automáticamente detectará los cambios y redesplegar la aplicación.

## Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio:

1. Ve a tu proyecto en Vercel
2. Click en "Settings" → "Domains"
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar el DNS

## Troubleshooting

### Error de Base de Datos

Si ves errores relacionados con la BD:
- Verifica que la variable `DATABASE_URL` esté configurada en Vercel
- Asegúrate de que la connection string sea correcta
- Revisa los logs en Vercel Dashboard

### Cambios no se Reflejan

- Verifica que los cambios estén en GitHub
- Revisa el deployment log en Vercel
- Intenta hacer un redeploy manual desde Vercel Dashboard

## Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Neon](https://neon.tech/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
