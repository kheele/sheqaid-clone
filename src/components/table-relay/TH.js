import React from "react";
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';
import {StyleSheet, View} from '@react-pdf/renderer';

import {execWhen} from '../../utils/Utils';

@observer
class TH extends React.Component {

    render() {
        const {col: {Header, accessor, width, align}} = this.props;
        let {className} = this.props;
        className = 'th' + (className ? (' ' + className) : '');
        return (<th className={className} width={width} align={align}>{Header}</th>);
    }
}

TH.propTypes = {

};

export default TH;
