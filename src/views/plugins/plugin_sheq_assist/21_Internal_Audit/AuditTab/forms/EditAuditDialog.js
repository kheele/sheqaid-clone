import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {Dates, ShouldUpdate} from 'utils/Utils';
import {Button, ClearableInput, SelectClientInput} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import {AEditDialog} from 'components/dialogs';

import AuditFindingItemTable from './AuditFindingItemTable';

import style from "./EditAuditDialog.lazy.css";
import {updateAudit} from "mutations/update";
import {findByIdAudit} from "mutations/findById";
import insertProxyEmployeeAuditRepresentative
    from "mutations/all/ProxyEmployeeAuditRepresentative/insertProxyEmployeeAuditRepresentative";
import deleteProxyEmployeeAuditRepresentative
    from "mutations/all/ProxyEmployeeAuditRepresentative/deleteProxyEmployeeAuditRepresentative";
import insertProxyEmployeeAuditor from "mutations/all/ProxyEmployeeAuditor/insertProxyEmployeeAuditor";
import deleteProxyEmployeeAuditor from "mutations/all/ProxyEmployeeAuditor/deleteProxyEmployeeAuditor";
import {insertAuditDefinition} from "mutations/create";
import {deleteAuditDefinition} from "mutations/delete";

@observer
class EditAuditDialog extends AEditDialog {
    pageKey = "EditAuditDialog";
    title = "Edit Audit";
    className = 'ANewTableFormDialog';
    findById = findByIdAudit;
    removeById = updateAudit;

    constructor(props) {
        super(props, style);
    }

    get topButtonsHiddenSave() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/21_Internal_Audit/audit/";

    constructor() {
        super();

        this.onFormSave = this.onFormSave.bind(this);
        this.onFormChange = this.onFormChange.bind(this);

        this.form = new Form();
    }

    @computed get item() {
        return this.props.state.item;
    }

    onFormSave(e, btn) {
        const {
            form,
            item: {
                id,
                data: old_data,
            },
        } = this;
        const {idx} = btn.props;
        const {isConsultant} = storage.is;

        const onSubmit = (data, onProgress) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            if (!onProgress) {
                btn.text("Saving...").disabled();
                progressDialog.open();
            }
            return updateAudit({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                // onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
                // this.props.close();
                return true;
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        if (idx === 1) {
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
            if (!form.isValid('date')) {
                infoDialog.open('Audit Date is required');
                return;
            }

            const {
                client,
                scope, date, type,
            } = form.data;

            const data = {};

            ShouldUpdate.checkClient(data, old_data, client, 'client');
            ShouldUpdate.check(data, old_data, scope, 'scope');
            ShouldUpdate.checkDate(data, old_data, date, 'date');
            ShouldUpdate.check(data, old_data, type, 'type');

            onSubmit(data);
            return;
        }

        return true;
    }

    onFormChange(idx) {
        const {list} = this.refs;
        if (idx === 5 && list) {
            list.refresh();
        }
    }

    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    client, project, site,
                    scope, date, type,
                    representative_list,
                    auditor_list,
                    definition_list, list
                }
            }
        } = this;

        const {isConsultant} = storage.is;

        return (<FormControls>
            <Row
                rendered
                idx={1}
                title="1. General Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                <div className="flex">
                    <div className="margin-t-10 margin-r-20">
                        {isConsultant &&
                            <SelectClientInput name="client" placeholder="Company..." defaultValue={client} required
                                               className="col-lg-12 form-control margin-b-15"
                                               onChange={this.form.onChange}/>}
                        <ClearableInput name="scope" type="text" placeholder="Scope Of Audit" defaultValue={scope}
                                        required
                                        className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                    </div>
                    <div className="margin-t-10 margin-l-20">
                        <ClearableInput name="date" type="date" placeholder="Audit Date..."
                                        defaultValue={date || new Date()}
                                        required className="col-lg-12 form-control margin-b-15"
                                        onChange={this.form.onChange}/>
                        <ClearableInput name="type" type="text" placeholder="Audit Type" defaultValue={type} required
                                        className="col-lg-12 form-control margin-b-15" onChange={this.form.onChange}/>
                    </div>
                </div>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Company Representative(s)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewEmployeeListTable
                    name="representative_list"
                    defaultValue={representative_list ? [...representative_list, null] : [null]}
                    savable
                    targetItem={{key: "audit_id", item}}
                    insertFn={insertProxyEmployeeAuditRepresentative}
                    deleteFn={deleteProxyEmployeeAuditRepresentative}
                    onAttrs={onEmployeeAttrs}
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Auditor(s)"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewEmployeeListTable
                    name="auditor_list"
                    defaultValue={auditor_list ? [...auditor_list, null] : [null]}
                    savable
                    targetItem={{key: "audit_id", item}}
                    insertFn={insertProxyEmployeeAuditor}
                    deleteFn={deleteProxyEmployeeAuditor}
                    onAttrs={onEmployeeAttrs}
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Definitions"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <DefinitionsTable
                    name="definition_list"
                    defaultValue={definition_list ? [...definition_list, null] : [null]}
                    savable
                    targetItem={{key: "audit_id", item}}
                    insertFn={insertAuditDefinition}
                    deleteFn={deleteAuditDefinition}
                    onAttrs={({title, desc}) => {
                        return {title, desc};
                    }}
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Findings"
                className="row-table"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <AuditFindingItemTable
                    ref="list"
                    name="list"
                    defaultValue={list}
                    savable
                    auditItem={item}
                    onAttrs={({
                                  achieved_score,
                                  audit_findings,
                                  audit_summary,
                                  comments,
                                  compliance,
                                  due_date,
                                  element,
                                  possible_score,
                                  target_date,
                                  responsible_person,
                                  sub_element
                              }) => {
                        return toNoneNullObject({
                            achieved_score,//
                            audit_findings,//
                            audit_summary,//
                            comments,//
                            compliance,//
                            due_date: Dates.formatDateSQL(due_date),//
                            element,//
                            possible_score,//
                            target_date: Dates.formatDateSQL(target_date),//
                            responsible_person_id: responsible_person && responsible_person.id,//
                            sub_element,//
                        });
                    }}
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>);
    }
}

function onEmployeeAttrs({employee, other_person}) {
    if (other_person && !other_person.id) {
        const {job_position} = other_person;
        if (job_position) {
            other_person.job_position_id = job_position.id;
            delete other_person.job_position;
        }
    }

    return {
        employee_id: employee && employee.id,
        other_person_id: other_person && other_person.id ? other_person.id : null,
        other_person: other_person && !other_person.id ? {data: other_person} : null
    };
}

@observer
class DefinitionsTable extends ATableSavable {

    @observable
    selfState = {};

    constructor(props) {
        super(props);
    }

    // onClickComplete(e, el) {
    // 	let {action, idx, item} = el.props;
    // // onPostChange(val, name, el) {
    // 	if(!val) {
    // 		return;
    // 	}
    //
    // 	this.onClick(null, {
    // 		props: {action: "save", idx},
    // 	});
    // }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td fixed-flex min-w-300">{item.title}</div>
                <div className="td">{item.desc}</div>
                <div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td fixed-flex min-w-300">
                    <ClearableInput ref={this.onSetRef} name="title" type="text" required className="form-control"
                                    onChange={this.onChange}/>
                </div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="desc" type="text" required className="form-control"
                                    onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex w-70">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
                        <i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<Table className="DefinitionsTable">
            <THead className="align-left">
                <div className="td fixed-flex min-w-300">Title</div>
                <div className="td">Description</div>
                <div className="td fixed-flex"></div>
            </THead>
            <TBody ref="body" title="Definitions" renderItem={this.renderItem} onClick={this.onClick} state={this.state}
                   onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default EditAuditDialog;
