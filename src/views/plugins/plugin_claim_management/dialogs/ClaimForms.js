// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Dates} from '../../../../utils/Utils';

import {Button, ClearableInput} from '../../../../components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../../../../components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EarningsTable">
@observer
class EarningsTable extends ATableSavable {
    @observable
    selfState = {
        
    };
    constructor(props) {
        super(props);

        const {defaultValue = []} = props;
        this.state.list = [
            {
                idx: 1,
                desc: <div className="margin-t-5 margin-b-5">
                    <p className="margin-0">Gross cash earnings:</p>
                    (Including average payments for overtime and/or commission of a constant character)
                </div>, 
                weekly: null,  monthly: null
            },
            {idx: 2, desc: "Allowances of a recurrent nature:", display: true},//
            {idx: 3, desc: "a) Bonuses (i.e. 13th cheque)", weekly: null, monthly: null},
            {idx: 4, desc: "b) Other allowances (specify nature)", weekly: null, monthly: null},
            {idx: 5, desc: "Cash Value Of:", display: true},//
            {idx: 6, desc: "Free food", weekly: null, monthly: null},
            {idx: 7, desc: "Free quarters", weekly: null, monthly: null},
            {idx: 8, desc: "Other payment in kind (specify nature)", weekly: null, monthly: null}
        ].map(v => {
            const {idx, display} = v;
            if(!display && !defaultValue.isEmpty()) {
                const item = defaultValue.find(v => v.idx === idx);
                const {weekly = null, monthly = null} = item;
                v.weekly = weekly;
                v.monthly = monthly;
            }
            return v;
        });
        
        this.onChange = this.onChange.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
	
    onChange(val, name, el) {
        const {idx} = el.props;
        const item = this.state.list[idx];
        item[name] = val;
    }
    
    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
        const {idx, desc, title, weekly, monthly, display} = item;
        
	return <TRow key={"item-" + idx} className={"tr-readonly w-full" + (display ? ' tr-question-title' : '')}>
            <div className={"td td-question" + (display ? ' question-title padding-5 padding-l-0' : '')}>
                <div className="w-full">
                    <h6 className="no-margin padding-r-10">{desc}</h6>
                </div>
            </div>
            {!display && readonly && <div className="td fixed-flex padding-l-0 min-w-270">
                {weekly} {monthly}
            </div>}
            {!display && !readonly && <div className="td fixed-flex padding-l-0 min-w-270">
                <ClearableInput idx={n} name="weekly" type="number" placeholder="R/Week" className="form-control" onChange={this.onChange}/>
                <ClearableInput idx={n} name="monthly" type="number" placeholder="R/Month" className="form-control" onChange={this.onChange}/>
            </div>}
	</TRow>;
    }

    render() {
        return <div className="row margin-0 -margin-l-10">
            <label className="text-center padding-l-10">Earnings of employee at the time of accident:</label>
            <Table>
                <THead className="align-left">
                    <div className="td fixed-flex min-w-270 no-padding"></div>
                </THead>
                <TBody ref="body" title="Earnings" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            </Table>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="OperationOrProcedureOrTestCarriedOutAndDatesTable">
@observer
class OperationOrProcedureOrTestCarriedOutAndDatesTable extends ATableSavable {
    @observable
    selfState = {
    };
    
    constructor(props) {
        super(props);

        this.insertAt = this.insertAt.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }
    
    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        if(item) {
            const {desc, date} = item;
            return <TRow key={"item-" + n} className="tr-readonly margin-r-0 w-full">
		<div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">{desc}</div>
                <div className="td fixed-flex min-w-155">{Dates.formatDate(date) || 'N/A'}</div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0"/>}
            </TRow>;
	} else if(!readonly) {
            return <TRow key="item-new" className="w-full">
		<div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="desc" type="textarea" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-155">
                    <ClearableInput ref={this.onSetRef} name="date" type="date" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="save" className="btn btn-primary hor-center w-40" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
	} else {
            return null;
        }
    }

    render() {
        const {readonly} = this.props;
        return <div className="row margin-0 -margin-l-10">
            <label className="text-center padding-l-10">Describe any operation(s)/procedure(s)/test(s) carried out and date(s)</label>
            <Table className="ANewListTable NewCourseListTable h-auto col-lg-12 margin-0 padding-0">
                <THead className="align-left">
                    <div className="td fixed-flex min-w-30">#</div>
                    <div className="td">Operation/Procedure/Test carried out</div>
                    <div className="td fixed-flex min-w-155">Date</div>
                    {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
                    {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
                </THead>
                <TBody ref="body" title="Operation(s)/Procedure(s)/Test(s) carried out and date(s)" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            </Table>
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="OffAndLightDutyPeriodTable">
@observer
class OffAndLightDutyPeriodTable extends ATableSavable {
    @observable
    selfState = {
    };
    
    constructor(props) {
        super(props);

        this.insertAt = this.insertAt.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
    }
    
    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
	if(item) {
            const {date_from, time_from, date_to, time_to, amount} = item;
            return <TRow key={"item-" + n} className="tr-readonly margin-r-0 w-full">
		<div className="td fixed-flex min-w-30 td-counter"><span>{n + 1}</span></div>
                <div className="td fixed-flex flex min-w-280 td-date-and-time-from">
                    <h6 className="xs-shown font-size-13">Date & Time From</h6>
                    {Dates.formatDate(date_from)} {time_from || '--:--'}
                </div>
                <div className="td fixed-flex flex min-w-280 td-date-and-time-to">
                    <h6 className="xs-shown font-size-13">Date & Time To</h6>
                    {Dates.formatDate(date_to)} {time_to || '--:--'}
                </div>
                <div className="td td-amount grid-view-w-full">
                    <h6 className="xs-shown font-size-13">
                        Advances/salary paid to the employee for the periods indicated at item 1
                    </h6>
                    <span>{amount || 'N/A'}</span>
                </div>
                {!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
                </div>}
                {readonly && <div className="td fixed-flex min-w-0"/>}
            </TRow>;
	}  else if(!readonly) {
            return <TRow key="item-new" className="w-full">
		<div className="td fixed-flex min-w-30 td-counter"><span>{n + 1}</span></div>
                <div className="td fixed-flex flex min-w-280 td-date-and-time-from">
                    <div>
                        <h6 className="xs-shown margin-t-5 margin-b-5 font-size-13 flex">Date From</h6>
                        <ClearableInput ref={this.onSetRef} name="date_from" type="date" required className="form-control" onChange={this.onChange}/>
                    </div>
                    <div>
                        <h6 className="xs-shown margin-t-5 margin-b-5 font-size-13 flex">Time From</h6>
                        <ClearableInput ref={this.onSetRef} name="time_from" type="time" required className="form-control" onChange={this.onChange}/>
                    </div>
                </div>
                <div className="td fixed-flex flex min-w-280 td-date-and-time-to">
                    <h6 className="xs-shown margin-t-5 margin-b-5 font-size-13 flex">Date To</h6>
                    <ClearableInput ref={this.onSetRef} name="date_to" type="date" required className="form-control" onChange={this.onChange}/>
                    <h6 className="xs-shown margin-t-5 margin-b-5 font-size-13 flex">Time To</h6>
                    <ClearableInput ref={this.onSetRef} name="time_to" type="time" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td td-amount grid-view-w-full">
                    <h6 className="xs-shown font-size-13">
                        Advances/salary paid to the employee for the periods indicated at item 1
                    </h6>
                    <ClearableInput ref={this.onSetRef} name="amount" type="number" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex w-50">
                    <Button idx={n} action="save" className="btn btn-primary hor-center w-40" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
	} else {
            return null;
        }
    }

    render() {
        const {readonly, desc} = this.props;
        return <div className="row margin-0 -margin-l-10">
            <label className="text-center padding-l-10 margin-t-5">{desc}</label>
            <Table className="ANewListTable OffAndLightDutyPeriodTable h-auto col-lg-12 margin-0 padding-0">
                <THead className="align-left">
                    <div className="td fixed-flex min-w-30 font-size-12">#</div>
                    <div className="td fixed-flex min-w-280 font-size-12">Date & Time From</div>
                    <div className="td fixed-flex min-w-280 font-size-12">Date & Time To</div>
                    <div className="td font-size-12">Advances/salary paid to the employee for the periods indicated at item 1</div>
                    {!readonly && <div className="td fixed-flex min-w-50 padding-0"/>}
                    {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
                </THead>
                <TBody ref="body" title={desc} renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            </Table>
        </div>;
    }
}
// </editor-fold>

export {EarningsTable, OperationOrProcedureOrTestCarriedOutAndDatesTable, OffAndLightDutyPeriodTable};
