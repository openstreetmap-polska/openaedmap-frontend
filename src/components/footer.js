import React from 'react';
import { Button, Footer } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react'
import {mdiCancel, mdiArrowRightBold, mdiMapMarkerPlus} from '@mdi/js'
import './footer.css'

const BUTTONS_TYPE_NONE = 0;
const BUTTONS_TYPE_ADD_AED = 1;
const BUTTONS_TYPE_MOBILE_STEP_1 = 2;
export { BUTTONS_TYPE_NONE, BUTTONS_TYPE_ADD_AED, BUTTONS_TYPE_MOBILE_STEP_1 };


export default function FooterDiv({ openForm, mobileStepOne, mobileCancel, mobileStepTwo, buttonsConfiguration }) {
    const { t } = useTranslation();

    const addAedButtons = (
        <>
        <div className='is-hidden-mobile'>
            <Button color={'success'} mt={1} ml={2} className='has-text-weight-light' onClick={openForm}>
                <Icon path={mdiMapMarkerPlus} className='icon mr-2' />
                {t('footer.add_aed')}
            </Button>
        </div>
        <div className='is-hidden-tablet'>
            <Button color={'success'} mt={1} ml={2} className='has-text-weight-light' onClick={mobileStepOne}>
                <Icon path={mdiMapMarkerPlus} className='icon mr-2' />
                {t('footer.add')}
            </Button>
        </div>
        </>
    )
    const mobileStepOneButtons = (
        <>
            <Button color={'error'} mt={1} ml={2} className='has-text-weight-light' onClick={mobileCancel}>
                <Icon path={mdiCancel} className='icon mr-2' />
                {t('footer.cancel')}
            </Button>
            <Button color={'success'} mt={1} ml={2} className='has-text-weight-light' onClick={mobileStepTwo}>
                <Icon path={mdiArrowRightBold} className='icon mr-2' />
                {t('footer.continue')}
            </Button>
        </>
    )
    function getFooterButtons(buttonConfigurationType) {
        if (buttonConfigurationType === BUTTONS_TYPE_NONE) return (<></>)
        else if (buttonConfigurationType === BUTTONS_TYPE_ADD_AED) return addAedButtons
        else if (buttonConfigurationType === BUTTONS_TYPE_MOBILE_STEP_1) return mobileStepOneButtons
    }

    if (buttonsConfiguration === BUTTONS_TYPE_NONE) return (<></>)
    else return (
        <Footer className='footer-div'>
            <div className='white-bottom-bar'></div>
            <div className='bottom-bar-buttons'>
                {getFooterButtons(buttonsConfiguration)}
            </div>
        </Footer>
    )
}
