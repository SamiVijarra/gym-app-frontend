import { Fragment } from 'react';
import {
    BreadcrumbCurrent,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbNav,
    BreadcrumbSeparator,
} from './Breadcrumb.styles';

export interface BreadcrumbItemData {
    label: string;
    to?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItemData[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <BreadcrumbNav aria-label="Breadcrumb">
            <BreadcrumbList>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <Fragment key={`${item.label}-${index}`}>
                            <BreadcrumbItem>
                                {item.to && !isLast ? (
                                    <BreadcrumbLink to={item.to}>{item.label}</BreadcrumbLink>
                                ) : (
                                    <BreadcrumbCurrent aria-current={isLast ? 'page' : undefined}>
                                        {item.label}
                                    </BreadcrumbCurrent>
                                )}
                            </BreadcrumbItem>
                            {!isLast && (
                                <BreadcrumbSeparator aria-hidden="true">/</BreadcrumbSeparator>
                            )}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </BreadcrumbNav>
    );
};
