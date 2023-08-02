import React from "react";
import {observer} from 'mobx-react';
import {THead} from '../../../../../components/tables';

import style from "./NCRItemTHead.lazy.css";

@observer
class NCRItemTHead extends React.Component {

    constructor() {
        super();
        
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    render() {
        return (<THead className="NCRItemTHead h-100">
            <div className="td text-center">Finding / NCR Description</div>
            <div className="td fixed-flex min-w-150 text-center">Document(s)</div>

            <div className="td text-center">Comments</div>

            <div className="td fixed-flex min-w-150 padding-0">
                <div className="td fixed-flex td-calc td-rotate td-rotate-single min-w-100 w-100 min-h-50 h-50 text-center">Responsible Person</div>
                <div className="td fixed-flex td-calc td-rotate td-rotate-single min-w-100 w-100 min-h-50 h-50 text-center">Due Date</div>
                <div className="td fixed-flex td-calc td-rotate td-rotate-single min-w-100 w-100 min-h-50 h-50 text-center">Date Completed</div>
            </div>

            <div className="td text-center">Remarks</div>
            <div className="td td-approval fixed-flex min-w-150 padding-0">
                <div className="td fixed-flex td-calc td-rotate td-rotate-single min-w-100 w-100 min-h-50 h-50 text-center">Approving Person</div>
                <div className="td fixed-flex td-calc td-rotate td-rotate-single min-w-100 w-100 min-h-50 h-50 text-center">Approved</div>
                <div className="td fixed-flex td-calc td-rotate td-rotate-single min-w-100 w-100 min-h-50 h-50 text-center">Date Approved</div>
            </div>
        </THead>);
    }
}

export default NCRItemTHead;
