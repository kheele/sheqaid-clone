// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';

import {ActionsButton, Button} from 'components/inputs';
import {TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AuditTableRow">
@observer
class AuditTableRow extends React.Component {
	render() {
		const {item, idx, isExport, renderActionsCol, onClick} = this.props;
		try {
			const {
				id,
				data: {
					created_at, client, scope, date, type, representative_list, auditor_list, definition_list, list
				}
			} = item;
			
			const tbl = <>
				<div className="td fixed-flex min-w-40">{id}</div>
				<div className="td fixed-flex min-w-110">{Dates.formatDate(date)}</div>
				<div className="td fixed-flex min-w-200">{type}</div>
				<div className="td fixed-flex min-w-200">{scope}</div>
				<div className="td fixed-flex min-w-200">{(client && client.name) || 'N/A'}</div>
				<div className="td">
					{
						(auditor_list && auditor_list.map(({employee, other_person}) => <span>
						{(employee || other_person).full_name}
					</span>)) || 'N/A'
					}
				</div>
				<div className="td">
					{
						(representative_list && representative_list.map(({employee, other_person}) => <span>
						{(employee || other_person).full_name}
					</span>)) || 'N/A'
					}
				</div>
				{renderActionsCol && renderActionsCol(item, idx)}
				{!isExport && (
					!renderActionsCol && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-60">
						<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
					</div>)
				}
			</>;
			
			if (isExport) return tbl;
			
			return <TRow className="w-full">{tbl}</TRow>;
		} catch (err) {
			console.error('AuditTableRow error', item)
			const onReport = (evt, btn) => {
				const data = {message: err.message || "", stack: err.stack || "", error_info: err.componentStack || ""};
				
				btn.text("Reporting...").disabled();
				neonBinding.events.emit("error-reporting/create", data).then(res => {
					infoDialog.open(<>
						<p>Problem successfully reported!</p>
						<p>We will fix it as soon as possible.</p>
					</>);
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

export default AuditTableRow;
