// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, SelectPPEItemInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewPPEItemListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
	className = "NewPPEItemListTable";
	title = "PPEs";
	style = style;

	renderItem(n, onClick) {
		const {readonly, renderTable} = this.props;
		const item = this.state.list[n];
		if(item && isString(item.ppe_type)) {
			return null;
		}

		if (item && (item.ppe_type || item.id)) {
			const _item = item.ppe_type || item;
			const {
				id, created_at, name, profile_pic, client, project, site,
			} = _item.data || _item;

			const tr = <React.Fragment>
				<div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
				<div className="td fixed-flex min-w-80">{RenderUtils.renderImage(profile_pic, '100%')}</div>
				<div className="td">{name}</div>
				{!readonly && <div className="td fixed-flex min-w-50">
					<Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>}
				{readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
			</React.Fragment>;

			return <TRow key={id} className={"w-full tr-readonly margin-r-0" + (renderTable ? " tr-table" : "")}>
				{renderTable ? <TRow>{tr}</TRow> : tr}
				{renderTable && renderTable(item, n)}
			</TRow>;
		} else {
			return <TRow key="item-new" className="w-full padding-10">
				<div className="td flex padding-0 margin-0">
					<SelectPPEItemInput ref={this.onSetRef} name="ppe_type" placeholder="Add PPE Item..."
					                    className="no-border-radius-r form-control" onChange={this.onChange} add={false}/>
					<Button idx={n} action="save" className="btn btn-primary fixed-flex w-40 margin-0 no-border-radius-l"
					        onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}

	renderTHead() {
		const {readonly} = this.props;
		return <THead className="align-left">
			<div className="td fixed-flex min-w-30">#</div>
			<div className="td fixed-flex min-w-80">Photo</div>
			<div className="td">Item Description</div>
			{!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
			{readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
		</THead>;
	}
}

// </editor-fold>

export default ListTable;
