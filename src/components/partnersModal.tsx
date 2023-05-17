import React, { FC } from "react";
import { useTranslation } from "react-i18next";

const PartnersModal: FC<{}> = () => {
    const { t } = useTranslation();
    return (
        <>
            <section className="modal-card-body has-text-weight-light" id="partners-modal">
                <div className="p-5 box">
                    <div className="media">
                        <div className="media-left">
                            <figure className="image">
                                <img
                                    height="55px"
                                    alt={t("osmp")}
                                    src="./img/logo-osm-poland.svg"
                                    style={{ height: "55px" }}
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="is-size-6 has-text-weight-semibold">
                                <a
                                    href="https://openstreetmap.org.pl/"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    {t("osmp")}
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="media">
                        <div className="media-left">
                            <figure className="image">
                                <img
                                    alt="Logo Fundacji Powszechnego Dostępu do Defibrylacji w Polsce"
                                    src="./img/logo-fundacja-aed.png"
                                    style={{ width: "200px" }}
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="is-size-6 has-text-weight-semibold">
                                {t("partners.aed_foundation")}
                            </p>
                        </div>
                    </div>
                </div>

                <section className="hero is-small has-background-green">
                    <div className="hero-body p-4">
                        <h2 className="title is-4 has-text-weight-light has-text-white-ter">
                            {t("partners.honorary_patronage")}
                        </h2>
                    </div>
                </section>

                <div className="pb-3 pt-5 pl-5 box">
                    <div className="media">
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
                    <div className="media">
                        <div className="media-left">
                            <figure className="image">
                                <img
                                    alt={t("partners.polish_society_for_emergency_medicine")}
                                    src="./img/logo-ptmr.webp"
                                    style={{ height: "65px" }}
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <a href="http://www.medycynaratunkowa.wroc.pl/" rel="noopener noreferrer" target="_blank">
                                {t("partners.polish_society_for_emergency_medicine")}
                            </a>
                        </div>
                    </div>

                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-64x64">
                                <img
                                    alt=""
                                    src="./img/logo-konsultant-krajowy.png"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="is-size-6">
                                {t("partners.professor_doctor_of_science")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                <span className="has-text-weight-semibold">Jerzy Robert Ładny</span>
                            </p>
                            <span className="has-text-weight-light has-text-grey is-size-6">
                                {t("partners.national_consultant_of_emergency_medicine")}
                            </span>
                        </div>
                    </div>

                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-48x48">
                                <img
                                    alt=""
                                    src="./img/star-of-life.svg"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="is-size-6">
                                {t("partners.professor_doctor_of_science")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                <span className="has-text-weight-semibold">Marianna Janion</span>
                            </p>
                            <span className="has-text-weight-light has-text-grey is-size-6">
                                {t("partners.consultant_of_cardiology")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                {t("partners.for_voivodeship")}
                                &nbsp;
                                Świętokrzyskie
                            </span>
                        </div>
                    </div>

                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-48x48">
                                <img
                                    alt=""
                                    src="./img/star-of-life.svg"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="is-size-6">
                                {t("partners.professor_doctor_of_science")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                <span className="has-text-weight-semibold">Andrzej Wysokiński</span>
                            </p>
                            <span className="has-text-weight-light has-text-grey is-size-6">
                                {t("partners.consultant_of_cardiology")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                {t("partners.for_voivodeship")}
                                &nbsp;
                                Lubelskie
                            </span>
                        </div>
                    </div>

                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-48x48">
                                <img
                                    alt=""
                                    src="./img/star-of-life.svg"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="is-size-6">
                                {t("partners.professor_doctor_of_science")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                <span className="has-text-weight-semibold">Adam Nogalski</span>
                            </p>
                            <span className="has-text-weight-light has-text-grey is-size-6">
                                {t("partners.consultant_of_emergency_medicine")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                {t("partners.for_voivodeship")}
                                &nbsp;
                                Lubelskie
                            </span>
                        </div>
                    </div>

                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-48x48">
                                <img
                                    alt=""
                                    src="./img/star-of-life.svg"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="is-size-6">
                                {t("partners.doctor_of_science")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                <span className="has-text-weight-semibold">Łukasz Balwicki</span>
                            </p>
                            <span className="has-text-weight-light has-text-grey is-size-6">
                                {t("partners.consultant_of_public_health")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                {t("partners.for_voivodeship")}
                                Pomorskie
                            </span>
                        </div>
                    </div>

                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-48x48">
                                <img
                                    alt=""
                                    src="./img/star-of-life.svg"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="is-size-6">
                                {t("partners.phd_in_medicine")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                <span className="has-text-weight-semibold">Wiktor Kuliczkowski</span>
                            </p>
                            <span className="has-text-weight-light has-text-grey is-size-6">
                                {t("partners.consultant_of_cardiology")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                {t("partners.for_voivodeship")}
                                &nbsp;
                                Dolnośląskie
                            </span>
                        </div>
                    </div>

                    <div className="media">
                        <div className="media-left">
                            <figure className="image is-48x48">
                                <img
                                    alt=""
                                    src="./img/star-of-life.svg"
                                />
                            </figure>
                        </div>
                        <div className="media-content">
                            <p className="is-size-6">
                                {t("partners.medical_doctor")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                <span className="has-text-weight-semibold">Dorota Konaszczuk</span>
                            </p>
                            <span className="has-text-weight-light has-text-grey is-size-6">
                                {t("partners.consultant_of_public_health")}
                                &nbsp;
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                {t("partners.for_voivodeship")}
                                &nbsp;
                                Lubuskie
                            </span>
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