import {
    mdiArrowRightBold,
    mdiCancel,
    mdiMapMarkerPlus, /* mdiAccountGroup, */
} from "@mdi/js";
import Icon from "@mdi/react";
import { FC } from "react";
import { Button, Footer } from "react-bulma-components";
import { useTranslation } from "react-i18next";
import ButtonsType from "../model/buttonsType";
import "./footer.css";
/* import { useAppContext } from "../appContext"; */
/* import { initialModalState, ModalType } from "../model/modal"; */

const FooterDiv: FC<FooterDivProps> = ({
    startAEDAdding, mobileCancel, showFormMobile, buttonsConfiguration,
}) => {
    const { t } = useTranslation();
    /* const { setModalState } = useAppContext(); */
    const basicButtons = (
        <div>
            <span className="is-hidden-mobile">
                <Button
                    color="success"
                    mt={1}
                    ml={2}
                    className="has-text-weight-light"
                    onClick={() => startAEDAdding(false)}
                >
                    <Icon path={mdiMapMarkerPlus} className="icon mr-2" />
                    {t("footer.add_aed")}
                </Button>
            </span>
            <span className="is-hidden-tablet">
                <Button
                    color="success"
                    mt={1}
                    ml={2}
                    className="has-text-weight-light"
                    onClick={() => startAEDAdding(true)}
                >
                    <Icon path={mdiMapMarkerPlus} className="icon mr-2" />
                    {t("footer.add")}
                </Button>
            </span>
            {/* <Button
                color="info"
                mt={1}
                ml={2}
                className="has-text-weight-light"
                onClick={() => setModalState({ ...initialModalState, visible: true, type: ModalType.Partners })}
            >
                <Icon path={mdiAccountGroup} className="icon mr-2" />
                {t("footer.partners")}
            </Button> */}
        </div>
    );
    const mobileAddAedButtons = (
        <>
            <Button color="error" mt={1} ml={2} className="has-text-weight-light" onClick={mobileCancel}>
                <Icon path={mdiCancel} className="icon mr-2" />
                {t("footer.cancel")}
            </Button>
            <Button color="success" mt={1} ml={2} className="has-text-weight-light" onClick={showFormMobile}>
                <Icon path={mdiArrowRightBold} className="icon mr-2" />
                {t("footer.continue")}
            </Button>
        </>
    );
    function getFooterButtons(buttonConfigurationType: ButtonsType) {
        switch (buttonConfigurationType) {
            case ButtonsType.None: return null;
            case ButtonsType.Basic: return basicButtons;
            case ButtonsType.MobileAddAed: return mobileAddAedButtons;
            default: return null;
        }
    }

    if (buttonsConfiguration === ButtonsType.None) return null;
    return (
        <Footer className="footer-div">
            <div className="bottom-bar-buttons">
                {getFooterButtons(buttonsConfiguration)}
            </div>
        </Footer>
    );
};

interface FooterDivProps {
    startAEDAdding: (mobile: boolean) => void,
    mobileCancel: () => void,
    showFormMobile: () => void,
    buttonsConfiguration: number,
}

export default FooterDiv;
