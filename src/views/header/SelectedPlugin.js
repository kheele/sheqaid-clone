import React from "react";
import {observer} from 'mobx-react';

@observer
class SelectedPlugin extends React.Component {

    constructor() {
        super();
    }
    
    render() {
        if(isAdminApp) 
            return <div className="SelectedPlugin changeable-title">Admin</div>;
        return <div className="SelectedPlugin"/>;
    }
}

export default SelectedPlugin;
