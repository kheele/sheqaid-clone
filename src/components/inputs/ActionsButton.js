import React from "react";
import {observer} from 'mobx-react';

import Button from './Button';

@observer
class ActionsButton extends React.Component {

    render() {
        const {icon, ...others} = this.props;
        return <Button {...others}>
            <i className={"fa fa-" + (icon || "bars")}/>
        </Button>;
    }
}

export default ActionsButton;