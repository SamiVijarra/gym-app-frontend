import type { ReactNode } from 'react';
import { Eyebrow, Meta, MetaDot, StyledHeader, Subtitle, Title } from './PageHeader.styles';

interface PageHeaderProps {
    eyebrow: string;
    title: ReactNode;
    subtitle?: ReactNode;
    meta?: ReactNode[];
}

export const PageHeader = ({ eyebrow, title, subtitle, meta }: PageHeaderProps) => {
    return (
        <StyledHeader>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            {meta && meta.length > 0 && (
                <Meta>
                    {meta.map((item, index) => (
                        <>
                            {index > 0 && <MetaDot key={`dot-${index}`}>•</MetaDot>}
                            <span key={index}>{item}</span>
                        </>
                    ))}
                </Meta>
            )}
        </StyledHeader>
    );
};
