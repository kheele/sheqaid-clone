import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Dates} from 'utils/Utils';

import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import {Row} from 'components/FormComponents';

@observer
class NewDependentsAndNextOfKinTab extends React.Component {
    pageKey = "NewDependentsAndNextOfKinTab";

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    render() {
        const {
            onFormNext, onFormBack, onFormOpen, 
            next_of_kin_1, next_of_kin_2, dependants
        } = this.props;
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls">
                    <Row 
                        active
                        rendered 
                        idx={6.1}
                        title="6.1. Next Of Kin #1" 
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                    >
                        <ClearableInput name="next_of_kin_1_fname" type="text" placeholder="First Name" defaultValue={next_of_kin_1 && next_of_kin_1.fname} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="next_of_kin_1_lname" type="text" placeholder="Last Name" defaultValue={next_of_kin_1 && next_of_kin_1.lname} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="next_of_kin_1_phone1" type="text" placeholder="1) Phone No." defaultValue={next_of_kin_1 && next_of_kin_1.phone1} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="next_of_kin_1_phone2" type="text" placeholder="2) Phone No." defaultValue={next_of_kin_1 && next_of_kin_1.phone2} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="next_of_kin_1_relationship" type="text" placeholder="Relationship" defaultValue={next_of_kin_1 && next_of_kin_1.relationship} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={6.2}
                        title="6.2. Next Of Kin #2" 
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                        onFormBack={onFormBack} 
                    >
                        <ClearableInput name="next_of_kin_2_fname" type="text" placeholder="First Name" defaultValue={next_of_kin_2 && next_of_kin_2.fname} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="next_of_kin_2_lname" type="text" placeholder="Last Name" defaultValue={next_of_kin_2 && next_of_kin_2.lname} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="next_of_kin_2_phone1" type="text" placeholder="1) Phone No." defaultValue={next_of_kin_2 && next_of_kin_2.phone1} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="next_of_kin_2_phone2" type="text" placeholder="2) Phone No." defaultValue={next_of_kin_2 && next_of_kin_2.phone2} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="next_of_kin_2_relationship" type="text" placeholder="Relationship" defaultValue={next_of_kin_2 && next_of_kin_2.relationship} className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={6.3}
                        title="6.3. Dependant(s)" 
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                    >
                        <NewDependantsTable name="dependants" onChange={this.form.onChange}/>
                    </Row>
                </div>
            </div>
        </div>
    }
}

@observer
class NewDependantsTable extends ATableSavable {
    
    @observable
    selfState = {
        lists: {
            genders: ["Male", "Female", "Other"]
        }
    };
    
    constructor(props) {
        super(props);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td"><span>{item.fname}</span></div>
		<div className="td"><span>{item.lname}</span></div>
		<div className="td fixed-flex min-w-160"><span>{item.gender}</span></div>
		<div className="td fixed-flex min-w-190"><span>{Dates.formatDate(item.dob)}</span></div>
                <div className="td fixed-flex min-w-50 padding-l-0 padding-r-0">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="fname" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td">
                    <ClearableInput ref={this.onSetRef} name="lname" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
		</div>
		<div className="td fixed-flex min-w-160">
                    <ClearableInput ref={this.onSetRef} name="gender" type="select" placeholder="Gender..." required className="form-control" onChange={this.onChange} values={this.selfState.lists.genders} returnValue/>
		</div>
		<div className="td fixed-flex min-w-190">
                    <ClearableInput ref={this.onSetRef} name="dob" type="date" placeholder="Date of Birth" required className="form-control" onChange={this.onChange}/>
		</div>
                <div className="td fixed-flex min-w-50 padding-l-0 padding-r-0">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table>
            <THead className="align-left">
                <div className="td">First Name</div>
		<div className="td">Last Name</div>
		<div className="td fixed-flex min-w-160">Gender</div>
		<div className="td fixed-flex min-w-190">Date of Birth</div>
                <div className="td fixed-flex min-w-60 padding-l-0 padding-r-0"></div>
            </THead>
            <TBody ref="body" title="Dependant(s)" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default NewDependentsAndNextOfKinTab;