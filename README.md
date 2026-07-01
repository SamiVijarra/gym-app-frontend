# Calendar App — Frontend 📅

Aplicación de calendario desarrollada con React y Vite. Frontend del proyecto
Calendar App que se conecta con el [calendar-backend](https://github.com/SamiVijarra/calendar-backend).

## Tecnologías

- **React** + **JavaScript**
- **Vite**
- **Redux Toolkit** para manejo de estado
- **React Router** para navegación
- **JWT** para autenticación

## Características

- Registro e inicio de sesión con JWT
- Crear, editar y eliminar eventos del calendario
- Vista de calendario mensual
- Estado global con Redux Toolkit
- Integración con API REST del backend

## Instalación y uso

### Requisitos
- Node.js 18+
- [calendar-backend](https://github.com/SamiVijarra/calendar-backend) corriendo

### Pasos

1. Clonar el repositorio
```bash
git clone https://github.com/SamiVijarra/calendar-app.git
cd calendar-app
```

2. Instalar dependencias
```bash
yarn install
```

3. Configurar variables de entorno
```bash
cp .env.template .env
```

Completar el `.env` con:
VITE_API_URL=http://localhost:4000/api

4. Iniciar en desarrollo
```bash
yarn dev
```

## Proyecto relacionado

Este frontend consume la API del backend:
[Calendar Backend](https://github.com/SamiVijarra/calendar-backend)

## Autor

**Samanta Vijarra** — [github.com/SamiVijarra](https://github.com/SamiVijarra)
