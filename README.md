# SubePE Admin Dashboard

Panel administrativo para el sistema de control de transporte publico SubePE. Este proyecto proporciona una interfaz web para gestionar conductores, unidades, usuarios y monitorear las ganancias y viajes en tiempo real.

## Tabla de Contenidos
- [Tecnologias](#tecnologias)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalacion y Configuracion Local](#instalacion-y-configuracion-local)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [Despliegue a Produccion](#despliegue-a-produccion)

## Tecnologias

El proyecto esta construido sobre las siguientes tecnologias:
- React + Vite: Framework frontend y bundler
- Tailwind CSS: Framework de estilos
- Lucide React: Libreria de iconos
- Axios: Cliente HTTP
- Recharts: Graficos estadisticos (Dashboard)
- Shadcn UI: Componentes base de interfaz

## Estructura del Proyecto

src/
  components/    - Componentes reutilizables de UI
  context/       - Estado global (Autenticacion)
  lib/           - Utilidades y configuracion de Axios con cache
  pages/         - Vistas principales de la aplicacion (Dashboard, Conductores, etc)
  App.jsx        - Enrutador principal de React Router
  main.jsx       - Punto de entrada

## Instalacion y Configuracion Local

1. Clonar el repositorio
2. Instalar las dependencias del proyecto:
   npm install

3. Configurar las variables de entorno (ver seccion abajo).

4. Levantar el servidor de desarrollo local:
   npm run dev

El servidor se abrira por defecto en http://localhost:5173.

## Variables de Entorno

Crear un archivo `.env` en la raiz del proyecto. Utiliza el archivo `.env.example` como referencia.

Variables requeridas:
VITE_API_URL: La URL base de tu backend (ej. http://localhost:3000/api para desarrollo)

Importante: El archivo `.env` esta excluido en el `.gitignore` por seguridad.

## Scripts Disponibles

- npm run dev: Inicia el servidor de desarrollo.
- npm run build: Compila la aplicacion para produccion en la carpeta /dist.
- npm run lint: Ejecuta la validacion de codigo con ESLint.
- npm run preview: Inicia un servidor local para probar la version de produccion.

## Despliegue a Produccion

Este frontend esta optimizado para ser desplegado en servicios como Vercel o Netlify.

Pasos basicos para Vercel:
1. Sube tu codigo a GitHub.
2. Importa el repositorio desde el panel de Vercel.
3. El framework preset (Vite) deberia detectarse automaticamente.
4. Antes de desplegar, agrega la variable de entorno VITE_API_URL apuntando a tu backend de produccion (ej. https://tu-backend.onrender.com/api).
5. Haz clic en "Deploy".
