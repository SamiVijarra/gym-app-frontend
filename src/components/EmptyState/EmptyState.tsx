import { Heading, IconCircle, Text, Wrapper } from './EmptyState.styles';

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
    return (
        <Wrapper>
            <IconCircle>
                <i className={`fas ${icon}`}></i>
            </IconCircle>
            <Heading>{title}</Heading>
            <Text>{description}</Text>
        </Wrapper>
    );
};
