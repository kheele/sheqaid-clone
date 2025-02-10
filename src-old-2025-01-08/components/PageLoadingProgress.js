import React from 'react';
import {observer} from 'mobx-react';
import {CircularProgress} from '@material-ui/core';

@observer
class PageLoadingProgress extends React.Component {

    render() {
        return <div id="page-loading"><div><CircularProgress/>{this.props.text || "Loading..."}</div></div>;
    }
}

export default PageLoadingProgress;