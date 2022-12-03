import React from "react";
import {observer} from 'mobx-react';
import {THead} from '../../../../../components/tables';

@observer
class AuditItemTHead extends React.Component {

    constructor() {
        super();
        
    }
    
    render() {
        return (<THead className="h-140">
            <div className="td text-center">Audit Findings</div>
            <div className="td fixed-flex min-w-120 text-center">Audit Summary</div>
            <div className="td td-tr fixed-flex min-w-150">
                <div className="td text-center">Score</div>
                <div className="td td-tr">
                    <div className="td fixed-flex td-calc td-rotate">Possible</div>
                    <div className="td fixed-flex td-calc td-rotate">Achieved</div>
                    <div className="td fixed-flex td-calc td-rotate">Compliance</div>
                </div>
            </div>

            <div className="td text-center padding-l-0 padding-r-0">Comments</div>
        </THead>);
    }
}

export default AuditItemTHead;
