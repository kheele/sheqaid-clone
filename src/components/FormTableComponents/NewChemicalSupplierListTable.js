// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import ANewListTable from './ANewListTable';
import {Button, ClearableInput, SelectDepartmentInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewChemicalSupplierListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
	className = "NewChemicalSupplierListTable";
	title = "Manufacturers / Suppliers";
	style = style;

	renderItem(n, onClick) {
		const {readonly, renderTable} = this.props;
		const item = this.state.list[n];
		if (item) {
			const {
				id,
				manufacturer,
				email,
				phone,
				fax,
				website,
				address,
			} = item;

			const tr = <React.Fragment>
				<div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
				<div className="td">{manufacturer}</div>
				<div className="td">{email}</div>
				<div className="td">{phone}</div>
				<div className="td">{fax}</div>
				<div className="td">{website}</div>
				<div className="td">{address}</div>
				{!readonly && <div className="td fixed-flex min-w-50">
					<Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>}
				{readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
			</React.Fragment>;

			return <TRow key={id} className={"tr-readonly w-full margin-r-0" + (renderTable ? " tr-table" : "")}>
				{renderTable ? <TRow>{tr}</TRow> : tr}
				{renderTable && renderTable(item, n)}
			</TRow>;
		} else {
			return <TRow key="item-new" className="w-full padding-10">
				<div className="td flex padding-0 margin-0">
					<ClearableInput
						ref={this.onSetRef}
						name="manufacturer"
						placeholder="Manufacturer/Supplier"
						required
						className="form-control"
						onChange={this.onChange}
					/>
					<ClearableInput
						ref={this.onSetRef}
						name="email"
						type="email"
						placeholder="Email Address"
						required
						className="form-control"
						onChange={this.onChange}
					/>
					<ClearableInput
						ref={this.onSetRef}
						name="phone"
						placeholder="Phone No."
						required
						className="form-control"
						onChange={this.onChange}
					/>
					<ClearableInput
						ref={this.onSetRef}
						name="fax"
						placeholder="Fax No."
						required
						className="form-control"
						onChange={this.onChange}
					/>
					<ClearableInput
						ref={this.onSetRef}
						name="website"
						placeholder="Website"
						required
						className="form-control"
						onChange={this.onChange}
					/>
					<ClearableInput
						ref={this.onSetRef}
						name="address"
						type="textarea"
						placeholder="Address"
						required
						className="form-control"
						onChange={this.onChange}
					/>
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
			<div className="td">Manufacturer/Supplier</div>
			<div className="td">Email Address</div>
			<div className="td">Phone No.</div>
			<div className="td">Fax No.</div>
			<div className="td">Website</div>
			<div className="td">Address</div>
			{!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
			{readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
		</THead>;
	}
}

// </editor-fold>

export default ListTable;