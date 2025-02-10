/* eslint-disable no-unused-vars */

import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {StyleSheet} from '@react-pdf/renderer';

import style from "./table.lazy.css";

@observer
class Table extends React.Component {
    static propTypes = {

    };

    @observable
    state = {printPDF: false, widths: []};
    @observable
    widthsState = {widths: null};
    innerRefs = {};

    constructor() {
        super();
        
        this.onCalculateWidths = this.onCalculateWidths.bind(this);
        this.renderNormalChildren = this.renderNormalChildren.bind(this);
    }
    
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onCalculateWidths(widths) {
        this.widthsState.widths = widths;
    }

    printPDF() {
        this.state.printPDF = true;
    }
    
    renderChildren() {
        return React.Children.map(this.props.children, (child, index) => {
            if(!child) return null;
            const {state: {printPDF}} = this;
            return React.cloneElement(child, {printPDF, tblWidth: $('.table').width()});
        });
    }
    
    renderNormalChildren() {
        const {ignoreResize, children} = this.props;
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
        let {props: {className, children}, state: {printPDF}} = this;
        className = 'table' + (className ? (' ' + className) : '');
        /*return (<div className={className}>{printPDF ? <PDFViewer>
            <Document>
                <Page size="A4" style={styles.page} wrap>
                    <View style={styles.table}>
                        {this.renderChildren()}
                    </View>
                </Page>
            </Document>
        </PDFViewer> : this.renderNormalChildren()}</div>);*/
        return (<div className={className}>{this.renderNormalChildren()}</div>);
    }
}

export default Table;
