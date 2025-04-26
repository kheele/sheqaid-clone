import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewEnviroRADialog.lazy.css";

@observer
class NewEnviroRADialog extends ANewDialog {
    pageKey = "NewEnviroRADialog";
    title = "Create Environmental Risk Assessment";
    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/08_Environmental_Aspects/enviro-ra/";

    constructor() {
        super();

        this.form = new Form();
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        if (!form.isValid('title')) {
            infoDialog.open('Title is required');
            return;
        }
        if (!form.isValid('list')) {
            infoDialog.open('Environmental Risk Assessment List is required');
            return;
        }

        const {title, list} = form.data;
        const data = {title, list};
        console.log(data)

        btn.text("Saving...").disabled();
        workers.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="title" type="text" placeholder="Title" rendered className="col-lg-4 hor-center form-control" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <label>Environmental Risk Assessment List</label>
                    <NewEnviroRATable ref="table" name="list" onChange={this.form.onChange}/>
                </div>
            </div>
        </div>);
    }
}

@observer
class NewEnviroRATable extends ATableSavable {

    @observable
    selfState = {
        calc: {
            L1: 0, C1: 0, R1: 0,
            L2: 0, C2: 0, R2: 0
        }
    };

    constructor(props) {
        super(props);
        
        this.onPreprocessForm = this.onPreprocessForm.bind(this);
        this.onPostChange = this.onPostChange.bind(this);
    }

    onPreprocessForm(form){
        const {calc} = this.selfState;
        if (!!calc) {
            this.form.L1 = calc.L1;
            this.form.C1 = calc.C1;
            this.form.R1 = calc.R1;
            this.form.L2 = calc.L2;
            this.form.C2 = calc.C2;
            this.form.R2 = calc.R2;
            
            this.selfState.calc.R1 = 0;
            this.selfState.calc.R2 = 0;
        }
    }

    onPostChange(val, name) {
        const {calc} = this.selfState;
        if (!isNullable(val) && ((val.isEmpty && !val.isEmpty()) || !!val)) {
            if (!!calc && name in calc) {
                calc[name] = parseInt(val);
                this.calc_R();
            }
        } else if (isNullable(val)) {
            if (!!calc && name in calc) {
                calc[name] = 0;
                this.calc_R();
            }
        }
    }

    calc_R() {
        const {L1, C1, L2, C2} = this.selfState.calc;
        this.selfState.calc.R1 = L1 * C1;
        this.selfState.calc.R2 = L2 * C2;
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td"><span>{item.issue}</span></div>
                <div className="td"><span>{item.hazard}</span></div>
                <div className="td"><span>{item.consequence}</span></div>
                <div className="td"><span>{item.impact}</span></div>
                <div className="td fixed-flex td-calc td-letter">{item.L1}</div>
                <div className="td fixed-flex td-calc td-letter">{item.C1}</div>
                <div className="td fixed-flex td-calc td-letter">{item.R1}</div>
                <div className="td"><span>{item.risk_control}</span></div>
                <div className="td fixed-flex td-calc td-letter">{item.L2}</div>
                <div className="td fixed-flex td-calc td-letter">{item.C2}</div>
                <div className="td fixed-flex td-calc td-letter">{item.R2}</div>
                <div className="td"><span>{item.overall_risk}</span></div>
                <div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="issue" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="hazard" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="consequence" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="impact" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex td-calc td-letter">
                    <ClearableInput ref={this.onSetRef} name="L1" type="text" required isClearable={false} className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex td-calc td-letter">
                    <ClearableInput ref={this.onSetRef} name="C1" type="text" required isClearable={false} className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex td-calc td-letter">
                    <R1Calc calc={this.selfState.calc}/>
                </div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="risk_control" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex td-calc td-letter">
                    <ClearableInput ref={this.onSetRef} name="L2" type="text" required isClearable={false} className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex td-calc td-letter">
                    <ClearableInput ref={this.onSetRef} name="C2" type="text" required isClearable={false} className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex td-calc td-letter">
                    <R2Calc calc={this.selfState.calc}/>
                </div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="overall_risk" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table>
            <THead>
                <div className="td">Issue</div>
                <div className="td">Hazard</div>
                <div className="td">Consequence</div>
                <div className="td">Impact</div>
                <div className="td td-tr fixed-flex">
                    <div className="td">Risk Rating</div>
                    <div className="td td-tr flex">
                        <div className="td td-calc td-letter">L</div>
                        <div className="td td-calc td-letter">C</div>
                        <div className="td td-calc td-letter">R</div>
                    </div>
                </div>
                <div className="td">Risk Control</div>
                <div className="td td-tr fixed-flex">
                    <div className="td">Risk Rating</div>
                    <div className="td td-tr flex">
                        <div className="td td-calc td-letter">L</div>
                        <div className="td td-calc td-letter">C</div>
                        <div className="td td-calc td-letter">R</div>
                    </div>
                </div>
                <div className="td">What Is The Overall Risk</div>
                <div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="Environmental Risk Assessment" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

@observer
class R1Calc extends React.Component {
    render() {
        return <span>{this.props.calc.R1}</span>;
    }
}

@observer
class R2Calc extends React.Component {
    render() {
        return <span>{this.props.calc.R2}</span>;
    }
}

export default NewEnviroRADialog;
