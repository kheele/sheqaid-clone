import React from "react";
import {observer} from 'mobx-react';

@observer
class SelectedPlugin extends React.Component {

    constructor() {
        super();
    }

    render() {
        if (loggedInApp.isUserManualView)
            return null;

        return <div className="SelectedPlugin"/>;
    }
}

export default SelectedPlugin;
