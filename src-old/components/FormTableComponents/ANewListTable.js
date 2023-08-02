// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ActionsButton} from '../inputs';
import {ATableSavable, Table, TBody} from '../tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="AListTable">
@observer
class AListTable extends ATableSavable {
    
    @observable
    selfState = {
        rendered: true
    };
    
    constructor(props) {
        super(props);

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.insertAt = this.insertAt.bind(this);
        this.renderTHead = this.renderTHead.bind(this);
    }
    
    componentWillMount() {
        this.style.use();
        if('rendered' in this.props) {
            this.selfState.rendered = this.props.rendered;
        }
    }
    
    componentWillUnmount() {
        this.style.unuse();
    }
    
    insertAt(list, form){
        list.insertAt(0, form);
    }
    
    show() {
        this.selfState.rendered = true;
    }
    
    hide() {
        this.selfState.rendered = false;
    }
    
    render() {
        if(!this.selfState.rendered) return null;
        let {title, readonly, disableRowHover, children, closeable, className = ''} = this.props;
        className =  `ANewListTable h-auto min-h-120 col-lg-12 margin-0 padding-0${closeable ? " closeable" : ""} ${className} ${this.className}`;

        return (<Table className={className}>
            {title && <h3 className="margin-0 padding-5 font-size-16 bg-eee">{title}</h3>}
            {closeable && <ActionsButton className="btn btn-primary closeable-btn" icon="times" onClick={this.hide}/>}
            {this.renderTHead()}
            <TBody ref="body" title={this.title} renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true} disableRowHover={disableRowHover}/>
            {children && children}
        </Table>);
    }
}
// </editor-fold>

export default AListTable;