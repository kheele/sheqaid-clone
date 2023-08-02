import React from "react";
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';

@observer
class TRow extends React.Component {

    renderChildren() {
        const siblings = React.Children.toArray(this.props.children).filter(child => !child.props.action);
        return React.Children.map(this.props.children, (child, index) => {
            if(!child) return null;
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
        if(disableRowHover) {
            className += ' no-row-hover';
        }
        const props = {className, onClick};
        if(style) {
            props.style = style;
        }
        return (<div {...props}>{children}</div>);
    }
}

TRow.propTypes = {

};

export default TRow;
