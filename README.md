# Gym App — Frontend 🏋️‍♀️

Aplicación de seguimiento de gimnasio desarrollada con React y Vite. Frontend del proyecto Gym App que se conecta con el [gym-app backend](https://github.com/SamiVijarra/gym-app).

## Tecnologías

- **React** + **JavaScript**
- **Vite**
- **Redux Toolkit** para manejo de estado
- **React Router** para navegación
- **JWT** para autenticación
- **Bootstrap 5** (con soporte de modo oscuro/claro)

## Características

- Registro e inicio de sesión con JWT
- Perfil de usuario editable (nombre, peso, estatura, fecha de nacimiento)
- Catálogo de ejercicios con búsqueda en vivo, detalle e instrucciones
- Rutina personalizada por días, con ejercicios y series editables
- Modo oscuro / claro
- Estado global con Redux Toolkit
- Integración con API REST del backend

## Instalación y uso

### Requisitos

- Node.js 18+
- [gym-app backend](https://github.com/SamiVijarra/gym-app) corriendo

### Pasos

1. Clonar el repositorio

```bash
git clone https://github.com/SamiVijarra/gym-app-frontend.git
cd gym-app-frontend
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

VITE_API_URL=http://localhost:3000

4. Iniciar en desarrollo

```bash
yarn dev
```

## Proyecto relacionado

Este frontend consume la API del backend:
[Gym App Backend](https://github.com/SamiVijarra/gym-app)

## Autor

**Samanta Vijarra** — [github.com/SamiVijarra](https://github.com/SamiVijarra)
