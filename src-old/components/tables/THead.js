import React from "react";
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';
import {StyleSheet, View} from '@react-pdf/renderer';

import {execWhen} from '../../utils/Utils';

// Create styles
const styles = StyleSheet.create({
    thead: {
        width: "100%",
        display: 'flex',
        flexDirection: "row",
        justifyContent: "stretch",
        paddingLeft: 10,
        borderBottom: '2px solid #eee',
        backgroundColor: '#f6f6f6'
    }
});

@observer
class THead extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        execWhen(() => {
            try {
                return findDOMNode(this);
            } catch(e) {
                return false;
            }
        }).then(node => {
            node = $(node);
            const widths = [];
            node.children().each(function(n) {
                const el = $(this);
                widths[n] = el.innerWidth();
            });
            
            this.props.onCalculateWidths && this.props.onCalculateWidths(widths);
        }, 0);
    }
    
    renderChildren() {
        const siblings = React.Children.toArray(this.props.children).filter(child => !child.props.action);
        return React.Children.map(this.props.children, (child, index) => {
            if(!child) return null;
            const {props: {printPDF, tblWidth}} = this;
            return React.cloneElement(child, {printPDF, siblings, tblWidth, tdPos: "head"});
        }).filter(child => !!child && !child.props.action);
    }

    render() {
        const {props: {printPDF}} = this;
        if (printPDF) {
            return <View style={styles.thead}>
                {this.renderChildren()}
            </View>;
        }
        let {className, children} = this.props;
        className = 'thead' + (className ? (' ' + className) : '');
        return (<div className={className}>{children}</div>);
    }
}

THead.propTypes = {

};

export default THead;
