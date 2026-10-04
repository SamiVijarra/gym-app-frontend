import { MUSCLE_GROUPS, getMuscleGroupInfo } from '../muscleGroups';
import { Chip, ChipList, Dot, LegendWrapper, Mark, Marks } from './MuscleGroupMarks.styles';

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
    const infos = groups.map(getMuscleGroupInfo).filter((info) => info !== undefined);
    if (infos.length === 0) return null;

    return (
        <ChipList>
            {infos.map((info) => (
                <Chip key={info.key}>
                    <Dot $color={info.color} />
                    {info.label}
                </Chip>
            ))}
        </ChipList>
    );
};

export const MuscleGroupLegend = () => (
    <LegendWrapper aria-label="Muscle group colors">
        {MUSCLE_GROUPS.map((group) => (
            <Chip key={group.key}>
                <Dot $color={group.color} />
                {group.label}
            </Chip>
        ))}
    </LegendWrapper>
);
