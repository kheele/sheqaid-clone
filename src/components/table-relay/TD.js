import React from "react";
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';
import {StyleSheet, View} from '@react-pdf/renderer';

import {execWhen} from '../../utils/Utils';

@observer
class TD extends React.Component {

    get value() {
        const {col: {accessor}} = this.props;
        return ;
    }

    render() {
        const {col: {width, align}} = this.props;
        let {className} = this.props;
        className = 'th' + (className ? (' ' + className) : '');
        return (<td className={className} width={width} align={align}>{this.value}</td>);
    }
}

TD.propTypes = {

};

export default TD;
