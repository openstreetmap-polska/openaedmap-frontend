import { useTranslation } from 'react-i18next';
import { SpanNoData } from './common'
import opening_hours from "opening_hours";
import i18n from 'i18next';


function parseOpeningHours(openingHours) {
    if (openingHours) {
        let hoursPrettified;
        try {
            let oh = new opening_hours(openingHours, undefined, 2);
            hoursPrettified = oh.prettifyValue({
                conf: {
                    locale: i18n.resolvedLanguage
                },
            });
            return hoursPrettified;
        } catch (error) {
            console.log('Error when parsing opening hours');
            console.log(error);
            return undefined;
        }
    }
}

function isCurrentlyOpen(openingHours) {
    if (openingHours) {
        if (openingHours === '24/7') {
            return true;
        } else {
            const oh = new opening_hours(openingHours, undefined, 2);
            const isOpen = oh.getState();
            return isOpen;
        }
    }
}

function CurrentlyOpenStatus({ openingHours }) {
    const { t } = useTranslation();
    const isOpen = isCurrentlyOpen(openingHours);
    return (
        <sup className="pl-1">
            <span className={"tag is-light " + isOpen ? "is-success" : "is-danger"}>
                {t(isOpen ? "opening_hours.open" : "opening_hours.closed")}
            </span>
        </sup>
    )
}

function OpeningHoursDescription({ openingHours }) {
    const { t } = useTranslation();

    const is24_7 = openingHours === '24/7';
    if (openingHours) {
        return (
            <span>
                <span className="has-text-weight-medium">{is24_7 ? t('opening_hours.24_7') : parseOpeningHours(openingHours)}</span>
                <CurrentlyOpenStatus openingHours={openingHours} />
            </span>
        )
    } else {
        return <SpanNoData />
    }
}

export function OpeningHoursField({ openingHours }) {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {t('sidebar.opening_hours') + ": "}
            <OpeningHoursDescription openingHours={openingHours} />
        </p>
    )
}
