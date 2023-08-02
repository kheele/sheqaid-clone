// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Dates} from 'utils/Utils';

import {ActionsButton} from 'components/inputs';
import {TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AuditTableRow">
@observer
class AuditTableRow extends React.Component {
	render() {
		const {item, idx, onRenderActionCell, onClick} = this.props;
		const {
			id,
			data: {created_at, client, scope, date, type, representative_list, auditor_list, definition_list, list}
		} = item;
		return <TRow className="w-full">
			<div className="td fixed-flex min-w-40">ID</div>
			<div className="td fixed-flex min-w-110">{Dates.formatDate(created_at)}</div>
			<div className="td fixed-flex min-w-110">{Dates.formatDate(date)}</div>
			<div className="td">{type}</div>
			<div className="td">{(auditor_list && auditor_list.map((
				{
					employee,
					other_person,
				}
			) =>
				<span>{(employee || other_person).lname + ' ' + (employee || other_person).fname}</span>)) || 'N/A'}</div>
			<div className="td">{scope}</div>
			<div className="td">{(client && client.name) || 'N/A'}</div>
			<div className="td fixed-flex min-w-195">{(representative_list && representative_list.map((
				{
					employee,
					other_person,
				}
			) => (employee || other_person).lname + ' ' + (employee || other_person).fname)) || 'N/A'}</div>
			{onRenderActionCell && onRenderActionCell(item, idx)}
			{!onRenderActionCell && <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={idx} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
			</div>}
		</TRow>;
	}
}

// </editor-fold>

export default AuditTableRow;
