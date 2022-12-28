import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react'
import { mdiDownload, mdiEarth } from '@mdi/js';

export default function DownloadCard() {
    const { t } = useTranslation();

    return (
        <div className='px-4 pt-5'>
            <div className='content has-text-weight-light'>
                <p className='has-text-weight-normal'>
                    <Icon path={mdiDownload} size={1} className='icon mr-1' color='#7a7a7a' />
                    {t('sidebar.download_title')}
                </p>
                <a className='button is-success mr-1' href={"/data/world.geojson"} target='_blank' rel="noreferrer" download key={t('sidebar.geojson')}>
                    <Icon path={mdiEarth} size={1} className='icon mr-2' />{t('sidebar.geojson')}
                </a>
                <hr className='my-3' />
            </div>
        </div>
    );
}