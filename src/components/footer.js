import React from 'react';
import { Button, Footer } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react'
import {mdiMapMarkerPlus} from '@mdi/js'
import './footer.css'

export default function FooterDiv({ actionSetter, dataSetter, visibilitySetter }) {
    const { t } = useTranslation();

    function openForm() {
        dataSetter({});
        actionSetter("addNode");
        visibilitySetter(true);
    }

    return (
        <Footer className='footer-div'>
            <div className='white-bottom-bar'></div>
            <div className='bottom-bar-buttons'>
                <div className='is-hidden-mobile'>
                    <Button color={'success'} mt={1} ml={2} className='has-text-weight-light' onClick={openForm}>
                        <Icon path={mdiMapMarkerPlus} className='icon mr-2' />
                        {t('footer.add_aed')}
                    </Button>
                </div>
                <div className='is-hidden-tablet'>
                    <Button color={'success'} mt={1} ml={2} className='has-text-weight-light' onClick={openForm}>
                        <Icon path={mdiMapMarkerPlus} className='icon mr-2' />
                        {t('footer.add')}
                    </Button>
                </div>
            </div>
        </Footer>
    )
}
