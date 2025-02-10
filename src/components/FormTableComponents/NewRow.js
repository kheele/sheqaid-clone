// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Button} from '../inputs';
import {TRow} from '../tables';

import style from "./NewRow.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NewRow">
@observer
class NewRow extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        const {idx, onClick, children} = this.props;

        return <TRow key="item-new" className="NewRow w-full h-105 padding-10">
            <div className="td grid grid-1 grid-gap-10 h-auto flex-center padding-0 margin-0">
                {children}
                <Button idx={idx} action="save"
                        className="btn btn-primary hor-center w-full margin-0 border-radius-30"
                        onClick={onClick}>
                    <i className="fa fa-check"/> ADD
                </Button>
            </div>
        </TRow>;
    }
}

// </editor-fold>

export default NewRow;
