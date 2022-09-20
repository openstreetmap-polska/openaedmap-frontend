import React from 'react';
import {useTranslation} from "react-i18next";
import MarkerCustomers from "../marker_icons/marker_customers.svg";
import MarkerDefault from "../marker_icons/marker_yes.svg";
import MarkerNo from "../marker_icons/marker_no.svg";
import MarkerPrivate from "../marker_icons/marker_private.svg";
import Icon from "@mdi/react";
import {mdiMapLegend} from "@mdi/js";


export default function MapLegend() {
    const { t } = useTranslation();
    const markers = [
        {
            "key": "default",
            "icon": MarkerDefault,
            "text": t("access.yes")
        },
        {
            "key": "customers",
            "icon": MarkerCustomers,
            "text": t("access.customers")
        },
        {
            "key": "private",
            "icon": MarkerPrivate,
            "text": t("access.private")
        },
        {
            "key": "no",
            "icon": MarkerNo,
            "text": t("access.no")
        },
    ];
    return (
        <div className="p-4">
        <p className='has-text-weight-normal mb-4'>
            <Icon path={mdiMapLegend} size={1} className='icon mr-1' color='#7a7a7a' />
            {t('sidebar.map_legend_title')}
        </p>
        {markers.map(({ icon, key, text }) =>
            <div className="columns is-mobile px-4 py-1 is-flex is-vcentered" key={`legend-div-${key}`}>
                <img key={`legend-image-${key}`} alt={text} src={icon} className="image is-32x32 pr-1 mr-1"/>
                <p key={`legend-text-${key}`} className="has-text-weight-light">{text}</p>
            </div>
        )}
    </div>
    );
}