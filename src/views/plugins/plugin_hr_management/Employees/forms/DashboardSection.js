import React from "react";
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import DashboardTopGridCounter from "./DashboardTopGridCounter";
import MKBox from "components/MK/MKBox";
import {execWhen} from "utils/UtilsFuns";

@observer
class DashboardSection extends React.Component {
    pageKey = "DashboardSection";

    @observable
    state = {
        hidden: false,
    };

    constructor(props) {
        super(props);
    }

    hide() {
        this.state.hidden = true;
    }

    show() {
        this.state.hidden = false;
    }

    async getDOMNode() {
        return execWhen(() => findDOMNode(this));
    }

    render() {
        if (this.state.hidden) {
            return null;
        }

        const {item, hidden, active, onClick} = this.props;
        const className = this.pageKey + "-tab" + (active ? ' active' : '');
        return <MKBox id={this.pageKey + "-tab"} className={className}
                      sx={hidden ? {position: "absolute", zIndex: "-1", top: "-4000px"} : {}}>
            <DashboardTopGridCounter item={item} topStatsSize={150} onClick={onClick}/>
        </MKBox>;
    }
}

export default DashboardSection;