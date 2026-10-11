import { format } from 'date-fns';
import { enUS, es, fr, ptBR } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';

const DATE_LOCALES: Record<string, Locale> = { en: enUS, es, pt: ptBR, fr };

const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const useLocaleFormat = () => {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage ?? 'en';
    const locale = DATE_LOCALES[language] ?? enUS;

    return {
        formatNumber: (value: number) => value.toLocaleString(language),
        formatMonthYear: (date: Date) =>
            upperFirst(format(date, t('formats.monthYear'), { locale })),
        formatShortDate: (date: Date) => format(date, t('formats.shortDate'), { locale }),
    };
};
