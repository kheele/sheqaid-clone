// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, toJS} from 'mobx';

import {execWhen} from '../../utils/Utils';

import ANewListTable from './ANewListTable';
import {Button, SelectBillableCompanyInput} from '../inputs';
import {THead, TRow} from '../tables';

import style from "./NewBillableCompanyListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ANewListTable {
    className = "NewBillableCompanyListTable";
    title = "Companies";
    style = style;
    
    constructor(props) {
        super(props);

        this.onAddAll = this.onAddAll.bind(this);
        
        extendObservable(this.selfState, {list: []});
        
        this.state.list.sortBy('data.name');
    }
    
    componentWillMount() {
        super.componentWillMount();
        execWhen(() => {
            const {company} = this.ctrl_refs;
            if(company && company.list.length) {
                return company.list;
            }
        }).then(list => {
            this.selfState.list = list;
        });
    }
    
    insertAt(list, form){
        const foundItem = list.filter(v => !!v).find(v => v.id === form.id);
        if(foundItem) {
            infoDialog.open('This item was already added');
            return;
        }
        list.insertAt(list.length - 1, form);
        list.sortBy('data.name');
    }
    
    onAddAll() {
        const {onChange, name} = this.props;
        
        this.state.list = [...this.ctrl_refs.company.list.map(v => v.value), null];
        
        onChange && onChange(toJS(this.list), name, this);
    }
    
    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const item = this.state.list[n];
	if(item && (item.company || item.id)) {
            const {
                id, data: {
                    name,
                    email, 
                    address
                }
            } = item.company || item;
                
            const tr = <React.Fragment>
		<div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
		<div className="td">{name}</div>
		<div className="td">{email}</div>
		<div className="td">{address}</div>
		{!readonly && <div className="td fixed-flex min-w-50">
                    <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
		</div>}
                {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
            </React.Fragment>;
                
            return <TRow key={id} className={"tr-readonly w-full margin-r-0" + (renderTable? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
	} else {
            return <TRow key="item-new" className="padding-10 w-full grid-1 grid-gap-10">
		<div className="td flex padding-0 margin-0">
                    <SelectBillableCompanyInput ref={this.onSetRef} name="company" placeholder="Add Company..." required className="no-border-radius-r form-control" onChange={this.onChange} add={false}/>
                    <Button idx={n} action="save" className="btn btn-primary fixed-flex w-40 margin-0 no-border-radius-l" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
		<div className="td min-h-60 grid-1 flex-center padding-0 margin-0">
                    <hr className="margin-0 w-full"/>
                    <h3 className="margin-0 w-full font-size-15">OR</h3>
                </div>
		<div className="td flex flex-center padding-0 padding-b-15 margin-0">
                    <Button idx={n} className="btn btn-primary fixed-flex w-190 margin-0 border-radius-20" onClick={this.onAddAll}>
			<i className="fa fa-plus"/>All Companies
                    </Button>
                </div>
		<UnselectedList selfState={this.selfState} state={this.state}/>
            </TRow>;
	}
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">Company Name</div>
            <div className="td">Email Address</div>
            <div className="td">Address</div>
            {!readonly && <div className="td fixed-flex min-w-60 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
}
// </editor-fold>


@observer
class UnselectedList extends React.Component {
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }
    
    renderItem(item, n) {
        const {
            id, data: {
                name,
                email, 
                address
            }
        } = item.company || item;
        return <span className="">{name}</span>;
    }
    
    @computed get list() {
        let {selfState: {list: mainList}, state: {list}} = this.props;
        list = list.filter(v => !!v);
//        console.log('UnselectedList', mainList.slice(), list.slice())
        return [...mainList.map(v => v.value).filter(v1 => list.noneMatch(v2 => v2.id === v1.id))];
    }
    
    render() {
        return <div className="td grid grid-5 padding-0 padding-b-15 margin-0">
            {this.list.map(this.renderItem)}
        </div>;
    }
}

export default ListTable;