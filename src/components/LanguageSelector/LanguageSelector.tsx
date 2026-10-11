import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n';
import { SelectorChevron, SelectorSelect, SelectorWrapper } from './LanguageSelector.styles';

export const LanguageSelector = () => {
    const { t, i18n } = useTranslation();

    return (
        <SelectorWrapper>
            <i className="fas fa-globe" aria-hidden="true"></i>
            <SelectorSelect
                aria-label={t('language.label')}
                value={i18n.resolvedLanguage}
                onChange={(event) => i18n.changeLanguage(event.target.value)}
            >
                {LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.label}
                    </option>
                ))}
            </SelectorSelect>
            <SelectorChevron className="fas fa-chevron-down" aria-hidden="true" />
        </SelectorWrapper>
    );
};
