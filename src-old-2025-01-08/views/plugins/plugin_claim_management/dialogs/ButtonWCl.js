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
        const {isChecked, props: {readonly}} = this;
        const icon = isChecked ? "check" : "times";
        const text = readonly ? "View" : isChecked ? "Edit" : "Add";
        return <><i className={"fa fa-" + icon}/> {text}</>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonWCl">
@observer
class ButtonWCl extends React.Component {

    render() {
        const {readonly, value, state, name, dialogName, text, onComplete, onClick} = this.props;
        return <Button name={name} dialogName={dialogName} title={text} value={value} onComplete={onComplete} className="btn btn-primary hor-center min-w-200 border-radius-20 margin-t-5" onClick={onClick}>
            <ButtonIcon readonly={readonly} value={value} state={state} name={name}/> {text}
        </Button>;
    }
}
// </editor-fold>

export default ButtonWCl;