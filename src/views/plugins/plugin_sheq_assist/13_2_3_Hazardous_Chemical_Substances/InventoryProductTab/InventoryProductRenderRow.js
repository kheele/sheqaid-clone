// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Dates, RisksCodes} from 'utils/Utils';
import {ActionsButton, Button} from 'components/inputs';
import {TRow} from 'components/tables';

import style from "./InventoryProductRenderRow.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderRow">
@observer
class RenderRow extends React.Component {

	// <editor-fold defaultstate="collapsed" desc="componentMount">
	componentWillMount() {
		style.use();
	}

	componentWillUnmount() {
		style.unuse();
	}

	// </editor-fold>

	render() {
		const {item, idx, onClick, renderActionsCol, isExporting} = this.props;
		try {
			console.log('chemical product', item)
			let {
				id, data: {
					created_at,
					name, common_names, category, physical_state, type, manufacturer, risk_level, emergency_phone_nums = [],
					is_stable, is_combustible, is_flammable,
					is_hazardous, hazard_class_list,
					has_sds_view, has_sds, sds_date, sds_doc, sds,
					has_hazchem_sheet_view, has_hazchem_sheet, hazchem_sheet_date, hazchem_sheet_doc, hazchem_sheet,
					has_risk_assessment_view, has_risk_assessment, risk_assessment_date, risk_assessment_doc,
					ppe_list = [],
				}
			} = item;

			return <TRow key={id} className="InventoryProductRenderRow w-full">
				<div className="td fixed-flex min-w-40 md-hidden">
					<h6 className="xs-shown font-size-13">ID</h6>
					{id}
				</div>
				<div className="td fixed-flex min-w-120 md-hidden">
					<h6 className="xs-shown font-size-13">Date Created</h6>
					{Dates.formatDate(created_at)}
				</div>
				<div className="td md-hidden">
					<h6 className="xs-shown font-size-13">Product Name</h6>
					{name}{common_names && ` (${common_names})`}
				</div>
				<div className="td fixed-flex min-w-110 md-hidden">
					<h6 className="xs-shown font-size-13">Physical State</h6>
					{physical_state || 'N/A'}
				</div>
				<div className="td fixed-flex min-w-110 md-hidden">
					<h6 className="xs-shown font-size-13">Type</h6>
					{type || 'N/A'}
				</div>
				<div className="td md-hidden">
					<h6 className="xs-shown font-size-13">Category</h6>
					{category || 'N/A'}
				</div>
				{!isExporting && <div className="td fixed-flex min-w-120 td-buttons md-hidden grid-1 grid-gap-1 padding-r-10">
					<h6 className="xs-shown font-size-13">Documents</h6>
					<HasButton title='SDS' value={has_sds_view}/>
					<HasButton title='Hazchem Sheet' value={has_hazchem_sheet_view}/>
					<HasButton title='Risk Assessment' value={has_risk_assessment_view}/>
				</div>}
				{!isExporting && <div className="td fixed-flex min-w-140 td-buttons md-hidden grid-1 grid-gap-1 padding-r-10">
					<h6 className="xs-shown font-size-13">Other Statuses</h6>
					<div className="flex">
						<HasButton title='Stable' value={is_stable}/>
						<HasButton title='Hazardous' value={is_hazardous}/>
					</div>
					<HasButton title='Flammable' value={is_flammable}/>
					<HasButton title='Combustible' value={is_combustible}/>
				</div>}
				{!isExporting && <div className="td fixed-flex min-w-110 padding-r-10 md-hidden">
					<h6 className="xs-shown font-size-13">PPE Required</h6>
					{(ppe_list && !ppe_list.isEmpty()) ? <span className='counter'>{ppe_list.length}</span> : 'N/A'}
				</div>}
				<div className={"td fixed-flex min-w-100 md-hidden td-risk-level " + RisksCodes.colorClassName(risk_level)}>
					<h6 className="xs-shown font-size-13">Risk Level</h6>
					{risk_level && <Button className="btn btn-primary pull-right min-w-40" text={risk_level}/>}
					{!risk_level && 'N/A'}
				</div>
				{renderActionsCol && renderActionsCol(item, idx, onClick)}
				{!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
					<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
				</div>}
			</TRow>;
		} catch (err) {
			console.error('chemical product error', item)
			const onReport = (evt, btn) => {
				const data = {message: err.message || "", stack: err.stack || "", error_info: err.componentStack || ""};

				btn.text("Reporting...").disabled();
				neonBinding.events.emit("error-reporting/create", data).then(res => {
					infoDialog.open(<React.Fragment>
						<p>Problem successfully reported!</p>
						<p>We will fix it as soon as possible.</p>
					</React.Fragment>);
					infoDialog.close(5000);
				}).finally(() => {
					btn.text("Report Problem").enabled();
				});
			};
			return <div className="tr error">
				This row content contains errors.
				<Button className="btn btn-primary" text="Report Problem" onClick={onReport}/>
			</div>;
		}
	}
}

// </editor-fold>

@observer
class HasButton extends React.Component {
	render() {
		const {value, title} = this.props;
		// if (!value) return null;
		return <Button className={`btn btn-primary flex flex-left font-size-11 ${value ? 'green' : 'red'}`}>
			<i className={`fa fa-${value ? 'check' : 'times'} fixed-flex flex-center min-w-15`}/>
			<span>{title}</span>
		</Button>;
	}
}

export default RenderRow;
