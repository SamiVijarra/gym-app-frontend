import { Label, Meta, StyledWrapper } from './SectionLabel.styles';

interface SectionLabelProps {
    children: string;
    meta?: string;
}

export const SectionLabel = ({ children, meta }: SectionLabelProps) => {
    return (
        <StyledWrapper>
            <div>
                <Label>{children}</Label>
                {meta && <Meta>{meta}</Meta>}
            </div>
        </StyledWrapper>
    );
};
