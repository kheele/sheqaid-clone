import React from "react";
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';
import {StyleSheet, View} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    trow: {
        width: "100%",
        display: 'flex',
        flexDirection: "row",
        justifyContent: "stretch",
        paddingLeft: 10,
        paddingRight: 10,
        borderBottom: '1px solid #f5f5f5',
//        backgroundColor: '#f5f5f5'
    }
});

@observer
class TRow extends React.Component {

    componentDidMount() {
        const {onDidMount, widthsState} = this.props;
        setTimeout(function () {
            try {
                let node = findDOMNode(this);
                onDidMount && onDidMount(node);
                // widthsState && this.resizeCols($(node), widthsState);
            } catch (e) {
            }
        }.bind(this), 0);
    }

    componentWillUpdate() {
        // const {widthsState} = this.props;
        // setTimeout(function() {
        //     if(widthsState) {
        //         try{
        //             const node = $(findDOMNode(this));
        //             this.resizeCols(node, widthsState);
        //         }catch(e) {
        //
        //         }
        //     }
        // }.bind(this), 0);
    }

    componentWillUnmount() {
        const {onWillUnmount} = this.props;
        try {
            onWillUnmount && onWillUnmount(findDOMNode(this));
        } catch (e) {

        }
    }

    resizeCols(node, widthsState) {
        const {ignoreResize} = this.props;
        if (ignoreResize) return;

        if (widthsState) {
            const {widths} = widthsState;
            node.children().each(function (n) {
                const el = $(this);
                el.width(widths[n]);
            });
        }
    }

    renderChildren() {
        const siblings = React.Children.toArray(this.props.children).filter(child => !child.props.action);
        return React.Children.map(this.props.children, (child, index) => {
            if (!child) return null;
            const {props: {printPDF, tblWidth}} = this;
            return React.cloneElement(child, {printPDF, tblWidth, siblings});
        }).filter(child => !!child && !child.props.action);
    }

    render() {
        const {props: {printPDF, onClick}} = this;
        if (printPDF) {
            return <View style={styles.trow}>
                {this.renderChildren()}
            </View>;
        }
        let {className, style, disableRowHover, children} = this.props;
        className = 'tr' + (className ? (' ' + className) : '');
        if (disableRowHover) {
            className += ' no-row-hover';
        }
        const props = {className, onClick};
        if (style) {
            props.style = style;
        }
        return (<div {...props}>{children}</div>);
    }
}

TRow.propTypes = {};

export default TRow;
