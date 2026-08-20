import { useEffect } from 'react';
import { useForm, useUsersStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

const profileFormFields = {
  name: '',
  weight: '',
  height: '',
  birthDate: '',
};

export const ProfilePage = () => {

  const { profile, isLoading, startLoadingProfile, startUpdatingProfile } = useUsersStore();

  const { name, weight, height, birthDate, onInputChange } = useForm(
    profile ?? profileFormFields
  );

  useEffect(() => {
    startLoadingProfile();
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    startUpdatingProfile({ name, weight: Number(weight), height: Number(height), birthDate });
  }

  if (!profile) {
    return <h3>Cargando perfil...</h3>;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Mi perfil</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-2">
            <label>Nombre</label>
            <input className="form-control" name="name" value={name} onChange={onInputChange} />
          </div>
          <div className="form-group mb-2">
            <label>Peso (kg)</label>
            <input className="form-control" type="number" name="weight" value={weight} onChange={onInputChange} />
          </div>
          <div className="form-group mb-2">
            <label>Estatura (m)</label>
            <input className="form-control" type="number" step="0.01" name="height" value={height} onChange={onInputChange} />
          </div>
          <div className="form-group mb-2">
            <label>Fecha de nacimiento</label>
            <input className="form-control" type="date" name="birthDate" value={birthDate?.split('T')[0] ?? ''} onChange={onInputChange} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            Guardar cambios
          </button>
        </form>
      </div>
    </>
  );
}