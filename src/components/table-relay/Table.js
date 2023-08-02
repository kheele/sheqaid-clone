/* eslint-disable no-unused-vars */

import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {StyleSheet} from '@react-pdf/renderer';

import style from "./table.lazy.css";
import THead from "./THead";
import TBody from "./TBody";

@observer
class Table extends React.Component {
    static propTypes = {

    };

    @observable
    state = {};
    innerRefs = {};

    constructor() {
        super();

        this.renderChildren = this.renderChildren.bind(this);
    }
    
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    renderHeader() {
        const {columns, children} = this.props;
        return ignoreResize ? children : React.Children.map(children, (child, index) => {
            if(!child) return null;
            const props = {};
            if(index === 0) {
                props.onCalculateWidths = this.onCalculateWidths;
            } else if(index === 1) {
                props.widthsState = this.widthsState;
            }
            return React.cloneElement(child, props);
        });
    }

    renderChildren() {
        const {columns, children} = this.props;
        return ignoreResize ? children : React.Children.map(children, (child, index) => {
            if(!child) return null;
            const props = {};
            if(index === 0) {
                props.onCalculateWidths = this.onCalculateWidths;
            } else if(index === 1) {
                props.widthsState = this.widthsState;
            }
            return React.cloneElement(child, props);
        });
    }

    render() {
        let {props: {className, columns, rows}} = this;
        className = 'table' + (className ? (' ' + className) : '');
        return (<table className={className}>
            <THead columns={columns}/>
            <TBody columns={columns} rows={rows}/>
        </table>);
    }
}

export default Table;
