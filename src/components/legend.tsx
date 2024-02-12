import { mdiMapLegend } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { useTranslation } from "react-i18next";
import MarkerCustomers from "~/marker_icons/marker_customers.svg";
import MarkerNo from "~/marker_icons/marker_no.svg";
import MarkerPermissive from "~/marker_icons/marker_permissive.svg";
import MarkerPrivate from "~/marker_icons/marker_private.svg";
import MarkerUnknown from "~/marker_icons/marker_unknown.svg";
import MarkerDefault from "~/marker_icons/marker_yes.svg";

export default function MapLegend() {
	const { t } = useTranslation();
	const markers = [
		{
			key: "default",
			icon: MarkerDefault,
			text: t("access.yes"),
			tag: "access=yes",
		},
		{
			key: "permissive",
			icon: MarkerPermissive,
			text: t("access.permissive"),
			tag: "access=permissive",
		},
		{
			key: "customers",
			icon: MarkerCustomers,
			text: t("access.customers"),
			tag: "access=customers",
		},
		{
			key: "private",
			icon: MarkerPrivate,
			text: t("access.private"),
			tag: "access=private",
		},
		{
			key: "no",
			icon: MarkerNo,
			text: t("access.no"),
			tag: "access=no",
		},
		{
			key: "unknown",
			icon: MarkerUnknown,
			text: t("access.unknown"),
			tag: t("access.unknownTag"),
		},
	];
	return (
		<div className="px-3 pb-5">
			<div className="columns is-mobile is-flex is-vcentered p-3">
				<Icon
					path={mdiMapLegend}
					size={1}
					className="icon mr-2"
					color="#7a7a7a"
				/>
				<p className="has-text-weight-normal">
					{t("sidebar.map_legend_title")}
				</p>
			</div>
			{markers.map(({ icon, key, text, tag }) => (
				<div
					className="columns is-mobile px-4 py-1 is-flex is-vcentered"
					key={`legend-div-${key}`}
				>
					<img
						key={`legend-image-${key}`}
						title={tag}
						alt={text}
						src={icon.toString()}
						className="legend-image image is-24x24"
					/>
					<p
						key={`legend-text-${key}`}
						className="has-text-weight-light legend-text pl-2"
					>
						{text}
					</p>
				</div>
			))}
		</div>
	);
}
