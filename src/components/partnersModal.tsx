import React, { FC } from "react";
import { useTranslation } from "react-i18next";

const PartnersModal: FC<{}> = () => {
    const { t } = useTranslation();
    const cloudFerro = "CloudFerro";
    return (
        <>
            <section className="modal-card-body has-text-weight-light" id="partners-modal">
                <div className="pb-3 pt-5 pl-5 box">
                    <div className="media partner-row">
                        <div className="media-left">
                            <figure className="image">
                                <img
                                    alt={t("partners.gugik")}
                                    src="./img/logo-gugik-short.png"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <a href="http://www.gugik.gov.pl/" rel="noopener noreferrer" target="_blank">
                                {t("partners.gugik")}
                            </a>
                            <p className="is-size-6">
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                <span className="has-text-weight-semibold">Alicja Kulka</span>
                            </p>
                            <span
                                className="has-text-weight-light has-text-grey is-size-6"
                            >
                                {t("partners.acting")}
                                &nbsp;
                                {t("partners.chief_geodesist")}
                            </span>
                        </div>
                    </div>

                    <div className="media partner-row">
                        <div className="media-left">
                            <figure className="image">
                                <img
                                    // TODO: vector logo
                                    src="./img/logo-umw.jpg"
                                    alt={t("partners.wroclaw_medical_university")}
                                    style={{ height: "40px" }}
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <a href="https://www.umw.edu.pl" rel="noopener noreferrer" target="_blank">
                                {t("partners.wroclaw_medical_university")}
                            </a>
                            <p className="is-size-6">
                                <span className="has-text-weight-light has-text-grey is-size-6">
                                    {t("partners.main_scientific_partner")}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="media partner-row">
                        <div className="media-left">
                            <figure className="image">
                                <img
                                    alt={cloudFerro}
                                    src="./img/cloudferro_logo-dark.png"
                                    style={{ height: "55px" }}
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <a href="https://cloudferro.com/" rel="noopener noreferrer" target="_blank">
                                {cloudFerro}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="modal-card-foot p-2">
                <div className="notification is-info is-light">
                    {t("modal.become_openaedmap_partner")}
                    &nbsp;
                    <a
                        className="has-text-weight-medium"
                        href="mailto:aed@openstreetmap.pl"
                    >
                        {t("modal.contact_us")}
                    </a>
                    .
                </div>
            </footer>
        </>
    );
};

export default PartnersModal;