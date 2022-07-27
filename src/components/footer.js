import React from 'react';
import { Button, Columns, Footer } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react'
import {mdiMapMarkerPlus} from '@mdi/js'
import './footer.css'

export default function FooterDiv() {
    const { t } = useTranslation();

    return (
        <Footer className='footer-div'>
            <div className='white-bottom-bar'></div>
            <Columns pb={0} pt={2} /*className='is-hidden-mobile'*/>
                <Columns.Column pb={1}>
                    <Button color={'success'} mt={1} ml={2} className='has-text-weight-light'>
                        <Icon path={mdiMapMarkerPlus} className='icon mr-2' />
                        {t('footer.add')}
                    </Button>
                </Columns.Column>
            </Columns>
            {/* <Columns pb={0} pt={2} className='is-hidden-tablet'>
                <Columns.Column pb={1} narrow={true} ml={2}>
                    <Button color={'success'} mt={1} ml={2} className='has-text-weight-light'>
                        <Icon path={mdiMapMarkerPlus} className='icon mr-2' />
                        {t('footer.add')}
                    </Button>
                </Columns.Column>
            </Columns>*/}
        </Footer>
    )
}
