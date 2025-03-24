//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {onSelectLoadSOPLocations} from 'views/plugins/utils';

import {
    ClearableInput,
    SelectClientInput,
    SelectEmployeeInput,
    SelectProjectInput,
    SelectSiteInput,
    UploadButton,
} from 'components/inputs';

import {AEditDialog} from 'components/dialogs';

import {
    NewCloseDownListTable,
    NewCustomSafetyPreRequesiteListTable,
    NewKeyPointListTable,
    NewOperationListTable,
    NewProcedureListTable,
    NewRiskListTable,
    NewSafetyPreRequesiteListTable,
    SelectWrapper,
} from './SOPComponents';

import {FormControls, Row} from "components/FormComponents";
import {ShouldUpdate} from "utils/Utils";

import {updateSOP} from "mutations/update";
import {findByIdSOP} from "mutations/findById";

import style from "./EditSOPDialog.lazy.css";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class EditSOPDialog extends AEditDialog {
    pageKey = "EditSOPDialog";
    findById = findByIdSOP;
    removeById = updateSOP;

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Edit Safe Operating Procedure";
    }

    get topButtonsHiddenSave() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

//</editor-fold>

@observer
class Controls extends React.Component {

    //<editor-fold desc="fields">
    @observable
    state = {
        lists: {
            category: [{text: 'Machine', value: 'Machine'}, {text: 'Task', value: 'Task'}, {
                text: 'Action',
                value: 'Action'
            }],
            risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {text: 'High', value: 'High'}],
            location: []
        },
        loadedSelectLists: false,
    };

    //</editor-fold>

    constructor() {
        super();

        this.form = new Form();
    }

    @computed get item() {
        return this.props.state.item;
    }

    //</editor-fold>

    //<editor-fold desc="componentDidMount">
    componentDidMount() {
        const loads = {location: onSelectLoadSOPLocations};
        Promise.all(Object.keys(loads).map(k => {
            return loads[k]().then(res => {
                this.state.lists[k].push(...res);
                this.state.lists[k] = this.state.lists[k].distinct();
            });
        })).then(res => {
            this.state.loadedSelectLists = true;
        });
    }

    //</editor-fold>

    //<editor-fold desc="onFormSave">
    onFormSave(e, btn) {
        const {
            form,
            item: {id, data: old_data},
        } = this;
        const {is: {isContractor}, loggedContractor} = storage;

        const onSubmit = (data, onSaved) => {
            if (Object.keys(data).isEmpty()) {
                infoDialog.open("Nothing changed!");
                return;
            }

            console.log(data)

            btn.text("Saving...").disabled();
            progressDialog.open();
            updateSOP({id: this.item.id, ...data}).then(res => {
                console.log("res", res)
                onSaved && onSaved(res);
                infoDialog.open("Record successfully updated.");
                infoDialog.close(2000);
            }).finally(() => {
                btn.text("Save").enabled();
                setTimeout(() => progressDialog.close());
            });
        };

        const {idx} = btn.props;
        if (idx === 0) {
            // const {isConsultant} = storage.is;
            // if (isConsultant && !form.isValid('client')) {
            //     infoDialog.open('Company is required');
            //     return;
            // }

            const {
                //0
                site, project, client,
            } = form.data;

            const data = {};

            if (isContractor) {
                ShouldUpdate.checkSite(data, old_data, site, 'contractor_site_id');
            } else {
                ShouldUpdate.checkClient(data, old_data, client);
                ShouldUpdate.checkProject(data, old_data, project);
                ShouldUpdate.checkSite(data, old_data, site);
            }

            onSubmit(data);
            return;
        }

        if (idx === 1) {
            if (!form.isValid('category')) {
                infoDialog.open('Category is required');
                return;
            }
            if (!form.isValid('risk_level')) {
                infoDialog.open('Risk Assessment Level is required');
                return;
            }

            const {
                //1
                category,
                risk_level,
                location,
                prepared_by,
                date_created,
                date_revised,
            } = form.data;

            const data = {};
            ShouldUpdate.check(data, old_data, category, 'category');
            ShouldUpdate.check(data, old_data, risk_level, 'risk_level');
            ShouldUpdate.check(data, old_data, location, 'location');
            ShouldUpdate.checkEmployee(data, old_data, prepared_by, 'prepared_by');
            ShouldUpdate.checkDate(data, old_data, date_created, 'date_created');
            ShouldUpdate.checkDate(data, old_data, date_revised, 'date_revised');

            onSubmit(data);
            return;
        }

        if (idx === 2) {
            const {
                //2
                doc,
            } = form.data;
            const data = {};
            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        if (idx === 3) {
            const {
                //3
                risk_list,
            } = form.data;
            const data = {};
            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        if (idx === 4) {
            const {
                //4
                close_down_list,
            } = form.data;
            const data = {};
            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        if (idx === 5) {
            const {
                //5
                safety_pre_requesite_list,
            } = form.data;
            const data = {};
            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        if (idx === 6) {
            const {
                //6
                custom_safety_pre_requesite_list,
            } = form.data;
            const data = {};
            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        if (idx === 7) {
            const {
                //7
                procedure_list,
                key_point_list,
                operation_list,
            } = form.data;
            const data = {};
            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        if (idx === 8) {
            const {
                //8
                other,
            } = form.data;
            const data = {};
            ShouldUpdate.checkFile(data, old_data, doc, 'doc');

            onSubmit(data);
            return;
        }

        return true;
    }

    //<editor-fold desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        let {
            item, item: {
                id, data: {
                    created_at,
                    //0
                    client,
                    project,
                    site,
                    //1
                    category,
                    risk_level,
                    location,
                    prepared_by,
                    date_created,
                    date_revised,
                    //2
                    doc,
                    //3
                    risk_list,
                    //4
                    close_down_list,
                    //5
                    safety_pre_requesite_list,
                    //6
                    custom_safety_pre_requesite_list,
                    //7
                    procedure_list,
                    key_point_list,
                    operation_list,
                    //8
                    other,
                }
            }
        } = this;

        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {isConsultant, isNoProjects} = storage.is;

        console.log(this.item)

        return <FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormSave={this.onFormSave}
            >
                {isConsultant && <SelectClientInput
                    name="client"
                    placeholder="Company..."
                    defaultValue={RenderUtils.selectedClient.call(this)}
                    showAll
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />}
                <SelectProjectInput
                    name="project"
                    placeholder="Project..."
                    defaultValue={RenderUtils.selectedProject.call(this)}
                    showAll
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
                <SelectSiteInput
                    name="site"
                    placeholder="Site..."
                    defaultValue={RenderUtils.selectedSite.call(this)}
                    showAll
                    className="col-lg-12 form-control"
                    onChange={this.form.onChange}
                />
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Basic Details"
                sectionClassName="-margin-r-10"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <ClearableInput name="category" type="radio" placeholder="Category" defaultValue={category} required
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.category}/>
                <ClearableInput name="risk_level" type="radio" placeholder="Risk Level" defaultValue={risk_level}
                                required
                                className="col-lg-12 form-control" onChange={this.form.onChange}
                                values={this.state.lists.risk_level}/>
                <SelectWrapper state={this.state} name="location" placeholder="Risk Task Location"
                               defaultValue={location}
                               className="col-lg-12 form-control" onChange={this.form.onChange} values="location"/>

                <SelectEmployeeInput name="prepared_by" placeholder="Prepared By..." defaultValue={prepared_by} required
                                     className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="date_created" type="date" placeholder="Date Created..."
                                defaultValue={date_created} required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
                <ClearableInput name="date_revised" type="date" placeholder="Date Revised..."
                                defaultValue={date_revised} required className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Reference Document"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <UploadButton
                    name="doc"
                    buttonTitle="Reference Document (PDF/Word/Image)"
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon
                    defaultValue={doc}
                    className="col-lg-12"
                    onChange={this.form.onChange}
                />
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Risks Associated With The Equipment / Procedure"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <NewRiskListTable name="risk_list" defaultValue={risk_list || []} onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Close Down"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <NewCloseDownListTable name="close_down_list" defaultValue={close_down_list || []}
                                       onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={5}
                title="5. Safety Pre-requisites"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <NewSafetyPreRequesiteListTable name="safety_pre_requesite_list"
                                                defaultValue={safety_pre_requesite_list || []}
                                                onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={6}
                title="6. Custom Safety Pre-requisites"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <NewCustomSafetyPreRequesiteListTable name="custom_safety_pre_requesite_list"
                                                      defaultValue={custom_safety_pre_requesite_list || []}
                                                      onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={7}
                title="7. Procedures"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <FormControls>
                    <Row
                        rendered
                        activeAlways
                        idx={7.1}
                        title="7.1. Pre-start Check"
                    >
                        <NewProcedureListTable name="procedure_list" defaultValue={procedure_list || []}
                                               onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        activeAlways
                        idx={7.2}
                        title="7.2. Key Points"
                    >
                        <NewKeyPointListTable name="key_point_list" defaultValue={key_point_list || []}
                                              onChange={this.form.onChange}/>
                    </Row>
                    <Row
                        rendered
                        activeAlways
                        idx={7.3}
                        title="7.3. Operations"
                    >
                        <NewOperationListTable name="operation_list" defaultValue={operation_list || []}
                                               onChange={this.form.onChange}/>
                    </Row>
                </FormControls>
            </Row>
            <Row
                rendered
                idx={8}
                title="8. OTHER - Add exit text into the block below if required. You can/paste from a text document."
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormSave={this.onFormSave}
            >
                <ClearableInput name="other" type="textarea" placeholder="Other" defaultValue={other}
                                className="col-lg-12 form-control"
                                onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }

    //</editor-fold>
}

export default EditSOPDialog;
