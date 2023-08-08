//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import DefaultCounterCard from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import Divider from "@mui/material/Divider";
import DefaultDoughnutChart from "../../../../../../containers/Charts/DoughnutCharts/DefaultDoughnutChart";
import MKBox from "../../../../../../components/MK/MKBox";
import {CircularProgress} from "@mui/material";
//</editor-fold>

//<editor-fold desc="Counter">
function Counter({background, title, count, value, label, color, sx}) {
	return <DefaultCounterCard
		color={color || "light"}
		background={background}
		count={count}
		value={value}
		label={label}
		radius="50%"
		fontSize="1.3em !important"
		title={title}
		sx={{
			width: '60px',
			height: '60px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 0,
			margin: 0,
			...(sx || {}),
		}}
	/>;
}

//</editor-fold>

//<editor-fold desc="GridCounter">
const Comp = forwardRef(({data: __data}, ref) => {
	const [data, setData] = useState(__data || DATA_LOAD_STATUS.LOADING);

	// <editor-fold desc="useImperativeHandle funs">
	useImperativeHandle(ref, () => ({
		setData: (value) => {
			setData(value);
		},
	}));
	// </editor-fold>

	if(data === DATA_LOAD_STATUS.LOADING) {
		return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
			<CircularProgress />
		</div>;
	}

	if(data === DATA_LOAD_STATUS.ERROR) {
		return null;
	}

	const [{
		doc_type_unclassified_incident_list_aggregate,
		all_project_plan_list_aggregate,
		all_ims_policy_list_aggregate,
		doc_type_company_certificate_list_aggregate,
		doc_type_company_insurance_list_aggregate,
		doc_type_company_registration_list_aggregate,
		doc_type_company_regulatory_body_list_aggregate,
	}] = data;

	const total = doc_type_unclassified_incident_list_aggregate.aggregate.count +
		all_project_plan_list_aggregate.aggregate.count +
		all_ims_policy_list_aggregate.aggregate.count +
		doc_type_company_certificate_list_aggregate.aggregate.count +
		doc_type_company_insurance_list_aggregate.aggregate.count +
		doc_type_company_registration_list_aggregate.aggregate.count +
		doc_type_company_regulatory_body_list_aggregate.aggregate.count;

	const doc_type_unclassified_incident_list_aggregate_perc = ((doc_type_unclassified_incident_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const all_project_plan_list_aggregate_perc = ((all_project_plan_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const all_ims_policy_list_aggregate_perc = ((all_ims_policy_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const doc_type_company_certificate_list_aggregate_perc = ((doc_type_company_certificate_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const doc_type_company_insurance_list_aggregate_perc = ((doc_type_company_insurance_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const doc_type_company_registration_list_aggregate_perc = ((doc_type_company_registration_list_aggregate.aggregate.count / total) * 100).toFixed(1);
	const doc_type_company_regulatory_body_list_aggregate_perc = ((doc_type_company_regulatory_body_list_aggregate.aggregate.count / total) * 100).toFixed(1);

	console.log('data', data)

	return <>
		<Grid
			container
			columns={1}
			spacing={6}
			className="grid-1 w-full grid-gap-10 padding-15"
			sx={{m: '0 !important', mt: '10px !important', justifyItems: 'center',}}
		>
			<DefaultDoughnutChart
				title="Document Category"
				width="calc(100% - 10px)"
				height="260px"
				chart={{
					labels: ['Unclassified', 'Project Plans', 'IMS Policies', 'Company Certificate', 'Company Insurance', 'Company Registration', 'Company Regulatory Body'],
					datasets: {
						label: "Document Categories",
						backgroundColors: ['secondary', 'success', 'warning', 'primary', 'info', 'error', 'dark'],
						data: [
							doc_type_unclassified_incident_list_aggregate.aggregate.count,
							all_project_plan_list_aggregate.aggregate.count,
							all_ims_policy_list_aggregate.aggregate.count,
							doc_type_company_certificate_list_aggregate.aggregate.count,
							doc_type_company_insurance_list_aggregate.aggregate.count,
							doc_type_company_registration_list_aggregate.aggregate.count,
							doc_type_company_regulatory_body_list_aggregate.aggregate.count,
						],
					},
					cutout: 60
				}}
			/>
			<Divider sx={{m: '0.1rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Unclassified
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${doc_type_unclassified_incident_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={doc_type_unclassified_incident_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.1rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Project Plans
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${all_project_plan_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={all_project_plan_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.1rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					IMS Policies
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${all_ims_policy_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={all_ims_policy_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.1rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Company Certificate
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${doc_type_company_certificate_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={doc_type_company_certificate_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.1rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Company Insurance
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${doc_type_company_insurance_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={doc_type_company_insurance_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.1rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Company Registration
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${doc_type_company_registration_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={doc_type_company_registration_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.1rem 0'}}/>
			<MKBox
				className="flex w-full grid-gap-10 border-radius-20"
				sx={{
					background: "rgba(25, 25, 25, 0.5)",
				}}
			>
				<MKBox className="font-size-17 padding-v-10 padding-l-20 flex flex-align-center" sx={{
					color: "rgb(217, 217, 217)",
					textTransform: "uppercase",
				}}>
					Company Regulatory Body
				</MKBox>
				<MKBox
					className="fixed-flex flex min-w-130 grid-gap-5 -margin-t-5 -margin-r-5 -margin-b-5"
				>
					<Counter background="transparent"
					         value={`${doc_type_company_regulatory_body_list_aggregate_perc}%`}/>
					<Counter background="#66BB6A"
					         count={doc_type_company_regulatory_body_list_aggregate.aggregate.count}/>
				</MKBox>
			</MKBox>
			<Divider sx={{m: '0.1rem 0'}}/>
		</Grid>
	</>;
});
//</editor-fold>

Comp.propTypes = {
	interval: PropTypes.oneOf(["Day", "Week", "Month", "Quarter", "Bi-Annual", "Annual"]).isRequired,
	view: PropTypes.oneOf(["all", "active", "inactive"]).isRequired,
};

export default Comp;

