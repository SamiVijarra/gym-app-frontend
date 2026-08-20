import { useAuthStore } from "../../hooks"

export const HomePage = () => {
  const { user, startLogout } = useAuthStore();

  return (
    <div className="container mt-5">
      <h2>¡Bienvenido, {user.name}!</h2>
      <p></p>
      <button className="btn btn-danger" onClick={startLogout}>Cerrar sesión</button>
    </div>
  )
}