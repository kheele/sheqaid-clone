import React from "react";
import {observer} from 'mobx-react';
import TH from "./TH";

@observer
class THead extends React.Component {

    constructor() {
        super();
        this.renderChildren = this.renderChildren.bind(this);
    }

    renderChildren(col, n) {
        return <TH col={col}/>;
    }

    render() {
        const {props: {columns}} = this;
        let {className} = this.props;
        className = 'thead' + (className ? (' ' + className) : '');
        return (<thead className={className}>
            {columns.map(this.renderChildren)}
        </thead>);
    }
}

THead.propTypes = {

};

export default THead;
