import Swal from 'sweetalert2';
import { useCalendarStore } from '../../hooks';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

export const PlannedSessionCard = ({ entry, onComplete }) => {
    const { startCancelingPlan } = useCalendarStore();

    const onCancel = async () => {
        const result = await Swal.fire({
            title: 'Cancel this planned day?',
            text: `"${entry.routineDay.description}" will be removed from this date.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it',
            cancelButtonText: 'Keep it',
        });

        if (result.isConfirmed) {
            await startCancelingPlan(entry.id, entry.date);
        }
    };

    return (
        <Card variant="surface">
            <div className="calendar-session-block-header">
                <Badge status="planned">Planned</Badge>
                <h3>{entry.routineDay.description}</h3>
            </div>

            <p className="calendar-session-block-meta">Day {entry.routineDay.dayNumber}</p>

            <div className="calendar-session-actions">
                <Button variant="primary" onClick={() => onComplete(entry)}>
                    Complete session
                </Button>

                <Button variant="danger" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </Card>
    );
};
