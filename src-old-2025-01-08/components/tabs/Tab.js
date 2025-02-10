import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';

@observer
class Tab extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        activeIndex: PropTypes.number.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const {index, onClick} = this.props;
        onClick(index);
    }

    render() {
        const {onClick, props: {activeIndex, index, title}} = this;
        let className = 'tab-list-item';

        if (activeIndex === index) {
            className += ' tab-list-active';
        }
        return (<li className={className} onClick={onClick}>{title}</li>);
    }
}

export default Tab;
