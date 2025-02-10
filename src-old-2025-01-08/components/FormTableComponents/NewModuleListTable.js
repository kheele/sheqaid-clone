// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable, toJS} from 'mobx';

import {ActionsButton, Button} from '../inputs';
import {ATableSavable, Table, TBody, THead, TRow} from '../tables';

import NewModuleDialog from '../dialogs/NewModuleDialog';

import style from "./NewModuleListTable.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTable">
@observer
class ListTable extends ATableSavable {
    
    @observable
    selfState = {
        rendered: true
    };
    
    constructor(props) {
        super(props);
        
        const {defaultValue} = props;
        if(defaultValue) {
            this.onSortAll(defaultValue);
        }

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.insertAt = this.insertAt.bind(this);
        this.onSort = this.onSort.bind(this);    
        
        this.onPostChange = this.onPostChange.bind(this);
        
        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
    }
    
    componentWillMount() {
        style.use();
        if('rendered' in this.props) {
            this.selfState.rendered = this.props.rendered;
        }
    }
    
    componentDidMount() {
        this.onSortAll(this.state.list);
    }
    
    componentWillUnmount() {
        style.unuse();
    }
    
    insertAt(list, form){
        list.insertAt(list.length - 1, form);
        this.onSortAll(list);
    }
    
    onPostChange(val, name, el) {
        const {onChange} = this.props;        
        const {idx} = el.props;
        const item = this.state.list[idx];
        if(!item) return;
        if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
            item[name] = val;
        } else if (isNullable(val)) {
            name in item && delete item[name];
        }
        console.log(val, name, el)
    }
    
    onAdd(evt, btn) {
        const {onChange, name} = this.props; 
        const {list} = this.state;
        this.refs.newModuleDialog.open().then(item => {
            this.insertAt(list, item);
            onChange && onChange(toJS(this.list), name, this);
        });
    }
    
    onEdit(evt, btn) {
        const {idx, action, onDelete} = btn.props;
        if(action === 'edit') {
            const {list} = this.state;
            const item = list[idx];
            this.refs.newModuleDialog.open(item).then(data => {
                extendObservable(item, data);                    
                list.removeAt(idx);
                list.insertAt(idx, item);
                
                this.onSortAll(list);
            });
        } else if(action === 'delete') {
            onDelete(evt, btn);
        }
    }
    
    onSortAll(list) {
        list.sortBy('has_update');
        list.sortBy('discount');
        list.sortBy('price');
        list.sortBy('company_list.length');
        list.sortBy('status');
        list.sortBy('desc');
        list.sortBy('sort');
        list.sortBy('title');
    }
    
    onSort({target}) {
        this.state.sortKey = target.getAttribute('sortKey');
    }
    
    show() {
        this.selfState.rendered = true;
    }
    
    hide() {
        this.selfState.rendered = false;
    }
    
    renderItem(n, onClick) {
        const {readonly, renderTable} = this.props;
        const {list, edits} = this.state;
        
        const item = list[n];
        
        return <React.Fragment key={n + '-' + new Date().getTime()}>
            <NewModuleListTableRenderItem key={'writable-' + n} n={n} edits={edits} lists={this.selfState.lists} readonly={readonly} renderTable={renderTable} item={item} onSetRef={this.onSetRef} onChange={this.onChange} onAdd={this.onAdd}/>
            <NewModuleListTableRenderItemReadonly key={'readonly-' + n} n={n} edits={edits} readonly={readonly} renderTable={renderTable} item={item} onClick={onClick} onEdit={this.onEdit}/>
        </React.Fragment>;
    }

    render() {
        if(!this.selfState.rendered) return null;
        const {readonly, children, closeable} = this.props;
        return (<Table className={"ANewListTable NewModuleListTable h-auto col-lg-12 margin-0 padding-0" + (closeable ? " closeable" : "")}>
            {closeable && <ActionsButton className="btn btn-primary closeable-btn" icon="times" onClick={this.hide}/>}
            <THead className="align-left">
                <div className="td fixed-flex min-w-30">#</div>
                <div className="td" onClick={this.onSort} sortKey="title">Name</div>
                <div className="td fixed-flex min-w-105" onClick={this.onSort} sortKey="company_list.length">Companies</div>
                <div className="td fixed-flex min-w-100" onClick={this.onSort} sortKey="price">Price</div>
                <div className="td fixed-flex min-w-80" onClick={this.onSort} sortKey="status">Status</div>
                <div className="td fixed-flex min-w-40" onClick={this.onSort} sortKey="sort">Sort</div>
                {!readonly && <div className="td fixed-flex min-w-120 padding-0"/>}
                {readonly && <div className="td fixed-flex min-w-10 padding-0"/>}
            </THead>
            <TBody ref="body" title="Modules" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
            {children && children}
            <NewModuleDialog ref="newModuleDialog"/>
        </Table>);
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewModuleListTableRenderItemReadonly">
@observer
class NewModuleListTableRenderItemReadonly extends React.Component {
    render() {
        const {n, edits, readonly, renderTable, item, onEdit, onClick} = this.props;
        const isEditting = edits[n];
        if(item && !isEditting) {
            const {
                key, 
                title, 
                desc,
                company_list = [],
                sort = 0,
                price = 0,
                discount = 0,
                status,
                has_update = 'No',
                hover,
                faIconLeft, 
                faIconRight, 
                svgIconLeft
            } = item;
                            
            const priceNum = parseFloat(price);
            const discountNum = parseFloat(discount);
            const discountPrice = discountNum ? (priceNum - (discountNum/100*priceNum)).toCurrency('R') : null;
            const tr = <React.Fragment>
		<div className="td fixed-flex min-w-30"><span>{n + 1}</span></div>
		<div className="td flex padding-0 margin-0">
                    <div className="td">{title}</div>
                    <div className="td fixed-flex min-w-105">{company_list.length}</div>
                    <div className="td fixed-flex min-w-100">
                        <span className={`fullPrice${discountNum > 0 ? ' fullPriceDiscounted' : ' font-bold'}`}>{priceNum.toCurrency('R')}</span>
                        {discountPrice && <span className='font-bold discountPrice'>{discountPrice}</span>}
                    </div>
                    <div className="td fixed-flex min-w-80">{status}</div>
                    <div className="td fixed-flex min-w-40">{sort}</div>
                    {!readonly && <div className="td fixed-flex grid-2 grid-gap-5 min-w-110 padding-l-10">
                        <Button idx={n} action="edit" className="btn btn-primary hor-center w-40" onClick={onEdit}>
                            <i className="fa fa-pen"/>
                        </Button>
                        <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onEdit} onDelete={onClick}>
                            <i className="fa fa-times-circle"/>
                        </Button>
                    </div>}
                    {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
                </div>
            </React.Fragment>;
                
            return <TRow key={n} className={"tr-readonly w-full margin-r-0" + (renderTable? " tr-table" : "")}>
                {renderTable ? <TRow>{tr}</TRow> : tr}
                {renderTable && renderTable(item, n)}
            </TRow>;
        } else {
            return null;
        }
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewModuleListTableRenderItem">
@observer
class NewModuleListTableRenderItem extends React.Component {

    render() {
        const {n, edits, readonly, lists, item, onSetRef, onChange, onAdd} = this.props;
        if(readonly || !!item) {
            return null;
        }
        
        return <TRow key="item-new" className="tr-new w-full padding-10 grid-1 grid-gap-10">
            <div className="td grid-1 grid-gap-10 flex-center padding-0 margin-0 h-auto">
                <hr className="margin-0"/>
            </div>
            <div className="td flex grid-gap-10 flex-center padding-0 margin-0 h-auto">
                <Button idx={n} action="add" className="btn btn-primary border-radius-20 fixed-flex min-w-80 w-80 margin-0" onClick={onAdd}>
                    <i className="fa fa-plus"/>Add
                </Button>
            </div>
        </TRow>;
    }
}
// </editor-fold>

export default ListTable;