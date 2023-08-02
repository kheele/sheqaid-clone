import React from "react";
import ReactPullToRefresh from 'react-pull-to-refresh';
import {CircularProgress} from '@material-ui/core';
import {computed} from 'mobx';
import {observer} from 'mobx-react';

import style from "./pull-hook-state.lazy.css";

@observer
class PullHookState extends React.Component {

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    @computed
    get showCurrentState() {
        switch (this.props.state.listState) {
            case 'action':
                return <CircularProgress/>;
            case 'initial':
            default:
                return <i className="fa fa-sync"><small>Pull to refresh</small></i>;
//            case 'preaction':
//                return 'Release';
        }
    }

    render() {
        return <ReactPullToRefresh
            onRefresh={this.props.onLoad}
            className="ReactPullToRefresh">
            {this.showCurrentState}
        </ReactPullToRefresh>;
        
        /*return <PullHook onChange={this.props.onChange} onLoad={this.props.onLoad} class={'pull-hook-' + this.props.state.listState}>
            {this.showCurrentState}
        </PullHook>;*/
    }
}

export default PullHookState;
