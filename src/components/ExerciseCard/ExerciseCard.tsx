import type { MouseEvent, ReactNode } from 'react';
import {
    Actions,
    Card,
    Chevron,
    Detail,
    Header,
    Image,
    Info,
    Name,
    Notes,
    Number,
    Tag,
    Tags,
} from './ExerciseCard.styles';

interface ExerciseCardProps {
    number?: number;
    image?: string;
    name: string;
    notes?: string;
    tags?: { label: string; muted?: boolean }[];
    actions?: ReactNode;
    collapsible?: boolean;
    isOpen?: boolean;
    onToggleOpen?: () => void;
    children?: ReactNode;
}

export const ExerciseCard = ({
    number,
    image,
    name,
    notes,
    tags = [],
    actions,
    collapsible = false,
    isOpen = false,
    onToggleOpen,
    children,
}: ExerciseCardProps) => {
    const onHeaderClick = () => {
        if (collapsible) onToggleOpen?.();
    };

    const onActionsClick = (event: MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <Card>
            <Header
                $clickable={collapsible}
                onClick={onHeaderClick}
                role={collapsible ? 'button' : undefined}
                tabIndex={collapsible ? 0 : undefined}
                aria-expanded={collapsible ? isOpen : undefined}
                onKeyDown={(event) => {
                    if (!collapsible) return;
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onToggleOpen?.();
                    }
                }}
            >
                {number !== undefined && <Number>{String(number).padStart(2, '0')}</Number>}
                {image && <Image src={image} alt={name} />}

                <Info>
                    <Name>{name}</Name>
                    {notes && <Notes>{notes}</Notes>}
                    {tags.length > 0 && (
                        <Tags>
                            {tags.map((tag) => (
                                <Tag key={tag.label} $muted={tag.muted}>
                                    {tag.label}
                                </Tag>
                            ))}
                        </Tags>
                    )}
                </Info>

                {actions && <Actions onClick={onActionsClick}>{actions}</Actions>}
                {collapsible && <Chevron className="fas fa-chevron-down" $open={isOpen} />}
            </Header>

            {(!collapsible || isOpen) && children && <Detail>{children}</Detail>}
        </Card>
    );
};
