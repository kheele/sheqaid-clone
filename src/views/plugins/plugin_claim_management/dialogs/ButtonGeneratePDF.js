// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';

import {Button} from 'components/inputs';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonGeneratePDF">
@observer
class ButtonGeneratePDF extends React.Component {

    render() {
        const {value, name, dialogName, overrideText, text, onClick} = this.props;
        return <Button name={name} dialogName={dialogName} value={value} title={text} className="ButtonGeneratePDF btn btn-primary hor-center min-w-250 border-radius-20 margin-t-5" onClick={onClick}>
            <i className="fa fa-file-pdf"/> {overrideText ? text : `Generate PDF (${text})`}
        </Button>;
    }
}
// </editor-fold>

export default ButtonGeneratePDF;
//352