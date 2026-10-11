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
import { useTranslation } from 'react-i18next';
import { useLocaleFormat } from '../../i18n/format';
import { useMuscleLabels } from '../../i18n/muscles';

interface MuscleGroupStat {
    group: string;
    sessions: number;
    volumeKg: number;
}

interface MuscleGroupStatsProps {
    stats: { month: string; groups: MuscleGroupStat[] } | null;
}

export const MuscleGroupStats = ({ stats }: MuscleGroupStatsProps) => {
    const { t } = useTranslation();
    const { groupLabel } = useMuscleLabels();
    const { formatMonthYear, formatNumber } = useLocaleFormat();

    const formatMonth = (month: string): string => {
        const [year, monthNumber] = month.split('-').map(Number);
        return formatMonthYear(new Date(year, monthNumber - 1, 1));
    };

    if (!stats) {
        return (
            <Panel>
                <Hint>{t('common.loading')}</Hint>
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
                <Hint>{t('muscleStats.empty')}</Hint>
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
                                        {groupLabel(info.key)}
                                    </GroupName>
                                    <Numbers>
                                        {t('counts.session', { count: item.sessions })} ·{' '}
                                        {formatNumber(Math.round(item.volumeKg))} {t('common.kg')}
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
