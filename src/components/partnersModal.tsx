import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface Partner {
	name: string;
	person: string | null;
	role: string | null;
	image: string;
	imageHeight: number;
	url: string;
}

const PartnersModal: FC = () => {
	const { t } = useTranslation();
	const partners: Partner[] = [
		{
			name: "CloudFerro",
			person: null,
			role: null,
			image: "cloudferro_logo-dark.png",
			imageHeight: 55,
			url: "https://cloudferro.com/",
		},
		{
			name: t("partners.wroclaw_medical_university"),
			person: null,
			role: t("partners.main_scientific_partner"),
			image: "logo-umw.png", // TODO: vector logo
			imageHeight: 40,
			url: "https://www.umw.edu.pl",
		},
		{
			name: t("partners.e_health_centre"),
			person: null,
			role: null,
			image: "logo-cez.png",
			imageHeight: 67,
			url: "https://cez.gov.pl",
		},
		{
			name: t("partners.warsaw_university_of_technology"),
			person: null,
			role: null,
			image: "logo-pw.png",
			imageHeight: 80,
			url: "https://pw.edu.pl/",
		},
		{
			name: t("partners.gugik"),
			person: "Alicja Kulka",
			role: `${t("partners.acting")} ${t("partners.chief_geodesist")}`,
			image: "logo-gugik-short.png",
			imageHeight: 55,
			url: "https://www.gov.pl/web/gugik",
		},
	];
	return (
		<>
			<section
				className="modal-card-body has-text-weight-light"
				id="partners-modal"
			>
				<div className="pb-3 pt-5 pl-5 box">
					{partners.map((partner) => (
						<div className="media partner-row" key={partner.name}>
							<div className="media-left">
								<figure className="image">
									<img
										alt={partner.name}
										src={`/img/${partner.image}`}
										style={{ height: `${partner.imageHeight}px` }}
									/>
								</figure>
							</div>
							<div className="media-content">
								<a href={partner.url} rel="noopener noreferrer" target="_blank">
									{partner.name}
								</a>
								{partner.person !== null && (
									<p className="is-size-6">
										<span className="has-text-weight-semibold">
											{partner.person}
										</span>
									</p>
								)}
								{partner.role !== null && (
									<div className="has-text-weight-light has-text-grey is-size-6">
										{partner.role}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</section>
			<footer className="modal-card-foot py-4 has-text-centered">
				<p className="block py-3">
					{t("modal.become_openaedmap_partner")}
					&nbsp;
					<a
						className="has-text-weight-medium"
						href="mailto:aed@openstreetmap.pl"
					>
						{t("modal.contact_us")}
					</a>
					.
				</p>
			</footer>
		</>
	);
};

export default PartnersModal;
