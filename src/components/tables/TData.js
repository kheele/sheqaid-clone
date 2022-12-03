import React from "react";
import {observer} from 'mobx-react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    tdHead: {
        weighting: 1,
        padding: '8px 0 4px',
        color: '#888',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tdBody: {
        weighting: 1,
        padding: '11px 0',
        color: '#888',
        fontSize: 14,
        fontWeight: '400',
    }
});

@observer
class TData extends React.Component {

    renderChildren() {
        return React.Children.map(this.props.children, (child, index) => {
            if(typeof child === 'string'){
                return <Text>{child}</Text>;
            } else if(typeof child === 'number'){
                return <Text>{"" + child}</Text>;
            }
            return child;
        });
    }
    
    getWeighting(props) {
        let {fixed, flex, tblWidth} = props;
        if('fixed' in props || 'flex' in props){
            if(isNumber(fixed) || isNumber(flex)) {
                return ((fixed || flex) / tblWidth);
            }
            if(isBoolean(fixed) || isBoolean(flex)) {
                return undefined;
            }
            return (fixed || flex) && (parseInt(fixed || flex) / tblWidth);
        } else {
            return undefined;
        }
    }
    
    render() {
        let {className, fixed, flex, children, action, printPDF, tdPos, siblings, tblWidth} = this.props;
        if (printPDF) {
            const style = tdPos === "head" ? styles.tdHead : styles.tdBody;
            let remainingWeighting = 1;
            let numberOfWeightingsDefined = 0;
            for(var n = 0; n < siblings.length; n++){
                let weight;
                if ((weight = this.getWeighting(siblings[n].props)) !== undefined) {
                    remainingWeighting -= weight || 1;
                    numberOfWeightingsDefined++;
                }
            }

            console.log("=", {tblWidth, remainingWeighting, siblings, numberOfWeightingsDefined})
            const weightingsPerNotSpecified = Math.ceil(remainingWeighting / (siblings.length - numberOfWeightingsDefined));
            style.weighting = this.getWeighting(this.props) || weightingsPerNotSpecified;
//            console.log(style, this.props, "=" ,this.getWeighting(this.props), weightingsPerNotSpecified)
            return <View wrap={true} style={style}>
                {this.renderChildren()}
            </View>;
        }
        className = 'td' + (className ? (' ' + className) : '');
        if('fixed' in this.props || 'flex' in this.props) {
            className += ' fixed-flex';
        }
        if((isNumber(fixed) || isString(fixed)) || (isNumber(flex) || isString(flex))) {
            className += ' min-w-' + (fixed || flex);
        }
        return (<div className={className}>{children}</div>);
    }
}

TData.propTypes = {

};

export default TData;
