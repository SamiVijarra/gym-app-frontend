import type { ReactNode } from 'react';
import { Table, Th, Thead, Wrapper } from './SetsTable.styles';

interface SetsTableProps {
    columns: string[];
    children: ReactNode;
}

export const SetsTable = ({ columns, children }: SetsTableProps) => {
    return (
        <Wrapper>
            <Table>
                <Thead>
                    <tr>
                        {columns.map((col) => (
                            <Th key={col}>{col}</Th>
                        ))}
                    </tr>
                </Thead>
                <tbody>{children}</tbody>
            </Table>
        </Wrapper>
    );
};
