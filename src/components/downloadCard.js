import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react'
import { mdiDownload, mdiEarth, mdiFileDelimited, mdiFileExcel } from '@mdi/js';

export default function DownloadCard() {
    const { t } = useTranslation();
    const dataDomain = "https://aed.openstreetmap.org.pl"; // TODO: change domain, maybe use relative url
    const downloadFormats = [
        {
            'icon': mdiEarth,
            'name': t('sidebar.geojson'),
            'url': `${dataDomain}/aed_poland.geojson`
        },
        {
            'icon': mdiFileDelimited,
            'name': t('sidebar.csv'),
            'url': `${dataDomain}/aed_poland.csv`
        },
        {
            'icon': mdiFileExcel,
            'name': t('sidebar.excel'),
            'url': `${dataDomain}/aed_poland.ods`
        }
    ];

    return (
        <div className='px-4 pt-5'>
            <div className='content has-text-weight-light'>
                <p className='has-text-weight-normal'>
                    <Icon path={mdiDownload} size={1} className='icon mr-1' color='#7a7a7a' />
                    {t('sidebar.download_title')}
                </p>
                {downloadFormats.map(({icon, name, url}) =>
                    <a className='button is-success mr-1' href={url} target='_blank' download key={name}>
                        <Icon path={icon} size={1} className='icon mr-2' />{name}
                    </a>
                )}
                <hr className='my-3' />
            </div>
        </div>
    );
}