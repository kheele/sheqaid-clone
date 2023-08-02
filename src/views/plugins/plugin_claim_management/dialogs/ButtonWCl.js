// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';

import {Button} from 'components/inputs';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonIcon">
@observer
class ButtonIcon extends React.Component {

    @computed
    get isChecked() {
        const {value, state, name} = this.props;
        return !!value || (state && state[name]);
    }

    render()  {
        const {isChecked} = this;
        const icon = isChecked ? "check" : "times";
        const text = isChecked ? "Edit" : "Add";
        return <React.Fragment>
            <i className={"fa fa-" + icon}/> {text}
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonWCl">
@observer
class ButtonWCl extends React.Component {

    render() {
        const {value, state, name, dialogName, text, onComplete, onClick} = this.props;
        return <Button name={name} dialogName={dialogName} value={value} onComplete={onComplete} className="btn btn-primary hor-center min-w-200 border-radius-20 margin-t-5" onClick={onClick}>
            <ButtonIcon value={value} state={state} name={name}/> {text}
        </Button>;
    }
}
// </editor-fold>

export default ButtonWCl;