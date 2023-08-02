import React from "react";
import {observer} from 'mobx-react';

import ATableSavable from './ATableSavable';
import Table from './Table';
import THead from './THead';
import TBody from './TBody';

// <editor-fold defaultstate="collapsed" desc="DefaultTableSavable">
@observer
class DefaultTableSavable extends ATableSavable {
    
    constructor(props) {
        super(props);

        this.insertAt = this.insertAt.bind(this);
        this.renderCols = this.renderCols.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    
    insertAt(list, form){
        list.insertAt(0, form);
    }
    
    renderCols(col, n) {
        const {title, className} = col;
        return <div key={n} className="td">{title}</div>;
    }

    renderItem(n, onClick) {
        const {newRow, viewRow} = this.props;
        const item = this.state.list[n];
        if(item) {
            return newRow(n, onClick);
        } else {
            return viewRow(n, onClick);
        }
    }

    render() {
        const {title, cols, className} = this.props;
        return (<Table className={className}>
            <THead>
                {cols.map(this.renderCols)}
            </THead>
            <TBody ref="body" title={title} renderItem={this.renderItem} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}
// </editor-fold>

export default DefaultTableSavable;
