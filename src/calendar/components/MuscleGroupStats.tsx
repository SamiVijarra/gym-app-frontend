import { getMuscleGroupInfo } from '../muscleGroups';
import {
    Dot,
    Fill,
    GroupName,
    Hint,
    MonthLabel,
    Numbers,
    Panel,
    RowHeader,
    Rows,
    Track,
} from './MuscleGroupStats.styles';

interface MuscleGroupStat {
    group: string;
    sessions: number;
    volumeKg: number;
}

interface MuscleGroupStatsProps {
    stats: { month: string; groups: MuscleGroupStat[] } | null;
}

const formatMonth = (month: string): string => {
    const [year, monthNumber] = month.split('-').map(Number);
    return new Date(year, monthNumber - 1, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
};

export const MuscleGroupStats = ({ stats }: MuscleGroupStatsProps) => {
    if (!stats) {
        return (
            <Panel>
                <Hint>Loading...</Hint>
            </Panel>
        );
    }

    const active = stats.groups
        .filter((item) => item.sessions > 0)
        .sort((a, b) => b.volumeKg - a.volumeKg);
    const maxVolume = Math.max(...active.map((item) => item.volumeKg), 0);

    return (
        <Panel>
            <MonthLabel>{formatMonth(stats.month)}</MonthLabel>

            {active.length === 0 ? (
                <Hint>No sessions logged this month yet.</Hint>
            ) : (
                <Rows>
                    {active.map((item) => {
                        const info = getMuscleGroupInfo(item.group);
                        if (!info) return null;
                        const percent = maxVolume > 0 ? (item.volumeKg / maxVolume) * 100 : 0;

                        return (
                            <li key={item.group}>
                                <RowHeader>
                                    <GroupName>
                                        <Dot $color={info.color} />
                                        {info.label}
                                    </GroupName>
                                    <Numbers>
                                        {item.sessions}{' '}
                                        {item.sessions === 1 ? 'session' : 'sessions'} ·{' '}
                                        {Math.round(item.volumeKg).toLocaleString()} kg
                                    </Numbers>
                                </RowHeader>
                                <Track aria-hidden="true">
                                    <Fill $color={info.color} $percent={percent} />
                                </Track>
                            </li>
                        );
                    })}
                </Rows>
            )}
        </Panel>
    );
};
