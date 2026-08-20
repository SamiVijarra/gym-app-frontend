import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm, useRoutinesStore } from '../../hooks';
import { Navbar } from '../../components/Navbar';

const newDayFields = { dayNumber: '', description: '' };

export const RoutinePage = () => {

  const { days, isLoading, startLoadingRoutine, startCreatingDay } = useRoutinesStore();

  const { dayNumber, description, onInputChange, onResetForm } = useForm(newDayFields);

  useEffect(() => {
    startLoadingRoutine();
  }, []);

  const onCreateDay = async (event) => {
    event.preventDefault();
    if (!dayNumber || !description) return;
    await startCreatingDay({ dayNumber: Number(dayNumber), description });
    onResetForm();
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Mi rutina</h2>

        <form onSubmit={onCreateDay} className="mb-4 d-flex gap-2">
          <input
            type="number"
            className="form-control"
            style={{ maxWidth: '100px' }}
            placeholder="N° día"
            name="dayNumber"
            value={dayNumber}
            onChange={onInputChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Descripción (ej. Pecho, hombros y tríceps)"
            name="description"
            value={description}
            onChange={onInputChange}
          />
          <button className="btn btn-success" type="submit">Crear día</button>
        </form>

        {isLoading && <p>Cargando rutina...</p>}

        {!isLoading && days.length === 0 && (
          <p className="text-muted">Todavía no tenés días cargados.</p>
        )}
      <div className="row">
        {days.map((day) => (
          <div className="col-md-4 mb-3" key={day.id}>
            <Link to={`/routine/${day.id}`} className="text-decoration-none">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Día {day.dayNumber}</h5>
                    <p className="card-text text-muted">{day.description}</p>
                    <p className="card-text small">{day.exercises.length} ejercicio(s)</p>
                  </div>
                </div>
              </Link>
            </div>
        ))}
      </div>
    </div>
    </>
  );
}