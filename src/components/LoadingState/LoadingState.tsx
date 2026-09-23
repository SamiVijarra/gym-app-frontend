import { Spinner, Wrapper } from './LoadingState.styles';

interface LoadingStateProps {
    label: string;
}

export const LoadingState = ({ label }: LoadingStateProps) => {
    return (
        <Wrapper>
            <Spinner />
            <span>{label}</span>
        </Wrapper>
    );
};
