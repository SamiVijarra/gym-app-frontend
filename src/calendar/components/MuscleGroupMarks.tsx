import { MUSCLE_GROUPS, getMuscleGroupInfo } from '../muscleGroups';
import { Chip, ChipList, Dot, LegendWrapper, Mark, Marks } from './MuscleGroupMarks.styles';
import { useTranslation } from 'react-i18next';
import { useMuscleLabels } from '../../i18n/muscles';

interface MuscleGroupsProps {
    groups?: string[];
}

export const MuscleGroupMarks = ({ groups = [] }: MuscleGroupsProps) => {
    const infos = groups.map(getMuscleGroupInfo).filter((info) => info !== undefined);
    if (infos.length === 0) return null;

    return (
        <Marks aria-hidden="true">
            {infos.map((info) => (
                <Mark key={info.key} $color={info.color} />
            ))}
        </Marks>
    );
};

export const MuscleGroupChips = ({ groups = [] }: MuscleGroupsProps) => {
    const { groupLabel } = useMuscleLabels();
    const infos = groups.map(getMuscleGroupInfo).filter((info) => info !== undefined);
    if (infos.length === 0) return null;

    return (
        <ChipList>
            {infos.map((info) => (
                <Chip key={info.key}>
                    <Dot $color={info.color} />
                    {groupLabel(info.key)}
                </Chip>
            ))}
        </ChipList>
    );
};

export const MuscleGroupLegend = () => {
    const { t } = useTranslation();
    const { groupLabel } = useMuscleLabels();

    return (
        <LegendWrapper aria-label={t('calendar.legend')}>
            {MUSCLE_GROUPS.map((group) => (
                <Chip key={group.key}>
                    <Dot $color={group.color} />
                    {groupLabel(group.key)}
                </Chip>
            ))}
        </LegendWrapper>
    );
};
