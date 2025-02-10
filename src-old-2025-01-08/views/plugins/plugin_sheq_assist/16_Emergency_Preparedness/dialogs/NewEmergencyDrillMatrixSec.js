import React from "react";
import {observer} from 'mobx-react';
import {ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import style from "./NewEmergencyDrillMatrixSec.lazy.css";

@observer
class NewEmergencyDrillMatrixSec extends React.Component {

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
        return <div id="NewEmergencyDrillMatrixSec" className="NewEmergencyDrillMatrixSec">
            <Controls/>
        </div>;
    }
}

@observer
class Controls extends ATableSavable {

    constructor(props) {
        super(props);

        this.state.list = [
            {text: "Planning"},
            {text: "Implementation"},
            {text: "Exercises"},
            {text: "Aftermath"}
        ];
        
        this.renderItem = this.renderItem.bind(this);
        this.onPostChange = this.onPostChange.bind(this);
    }

    onPostChange(val, name, el) {
        const {idx} = el.props;
        const item = this.state.list[idx];
        if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
            item[name] = val;
        } else if (isNullable(val)) {
            delete item[name];
        }
    }

    renderItem(n) {
        const item = this.state.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex"><span>{item.text}</span></div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="management" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <SelectEmployeeInput ref={this.onSetRef} name="emergency_manager" idx={n} placeholder="Select..." required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="authorized_emergency_response_persons" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="workers" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="visitors_students_pupils_etc" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
            <div className="td">
                <ClearableInput ref={this.onSetRef} name="external_teams" idx={n} type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
            </div>
        </TRow>;
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <Table>
                    <THead>
                        <div className="td fixed-flex"></div>
                        <div className="td">Management</div>
                        <div className="td">Emergency Manager</div>
                        <div className="td">Authorized Emergency Response Persons</div>
                        <div className="td">Workers</div>
                        <div className="td">Visitors, Students, Pupils, etc</div>
                        <div className="td">External Teams</div>
                    </THead>
                    <TBody ref="body" title="Emergency Dills & Exercises Matrix" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
                </Table>
            </div>
        </div>);
    }
}

export default NewEmergencyDrillMatrixSec;
