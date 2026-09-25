import type { MouseEvent, ReactNode } from 'react';
import {
    ActionSlot,
    Arrow,
    DayNumberMedia,
    IconMedia,
    Info,
    Meta,
    StyledLink,
    Subtitle,
    Title,
} from './ListCard.styles';

interface ListCardProps {
    to: string;
    media: ReactNode;
    title: string;
    subtitle?: string;
    meta?: ReactNode;
    action?: ReactNode;
}

export const ListCard = ({ to, media, title, subtitle, meta, action }: ListCardProps) => {
    const onActionClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <StyledLink to={to}>
            {media}

            <Info>
                <Title>{title}</Title>
                {subtitle && <Subtitle>{subtitle}</Subtitle>}
                {meta && <Meta>{meta}</Meta>}
            </Info>

            {action && <ActionSlot onClick={onActionClick}>{action}</ActionSlot>}

            <Arrow>→</Arrow>
        </StyledLink>
    );
};

export { IconMedia, DayNumberMedia };
