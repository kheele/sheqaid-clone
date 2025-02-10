// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from "@mui/material";

import Form from 'utils/Form';
import {Dates} from 'utils/Utils';
import {
    Button,
    SelectClientInput,
    SelectDepartmentInput,
    SelectEmployeeInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput,
    SelectTeamInput
} from 'components/inputs';
import {ANewDialog} from 'components/dialogs';

import style from "./ExportDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ExportDialog extends ANewDialog {
    pageKey = "ExportDialog";

    constructor(props) {
        super(props, style);
    }

    get title() {
        return `Export ${this.props.titlePlural}`;
    }

    get topButtons() {
        return <>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
        </>;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

const LoadStatus = {
    NONE: -1,
    LOADING: 0,
    LOADED: 1,
    ERROR: 2,
};

@observer
class Controls extends React.Component {

    @observable state = {
        excelUrl: null,
        loadStatus: LoadStatus.NONE,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onSubmitExport = this.onSubmitExport.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    get title() {
        return "Export";
    }

    // <editor-fold defaultstate="collapsed" desc="onSubmitExport">
    onSubmitExport(e, btn) {
        const {props: {dialog: {props: {titlePlural, exportFn, addHRFilters}}}, form} = this;

        this.state.loadStatus = LoadStatus.LOADING;

        const {selectedClient, selectedProject, selectedSite} = storage.selected;
        const {
            client,
            project,
            site,
            department,
            job_position,
            team,
            supervisor
        } = form.data;

        // const client = client || selectedClient;
        // const project = project || selectedProject;
        // const site = site || selectedSite;

        btn.text("Exporting...").disabled();

        const data = {
            date: new Date().formatDate(),
            ...form.formData,
            // client,
            // project,
            // site,
            // department,
            // job_position,
            // team,
            // supervisor,
        };

        exportFn(data).then(res => {
            console.log('this.exportFn res', res);
            if (!res) {
                this.state.loadStatus = LoadStatus.ERROR;
                infoDialog.open(<>
                    <p>An error occurred. Please try again</p>
                </>);
            } else {
                infoDialog.open(<>
                    <p>{titlePlural} successfully exported.</p>
                    <p><small>The file will be automatically downloaded</small></p>
                </>);
                this.state.excelUrl = res.dlUrls[0];
                this.state.loadStatus = LoadStatus.LOADED;
                saveFileAs(this.state.excelUrl, `${titlePlural.replaceAll(' ', '-')}_${Dates.formatDate(new Date())}.xlsx`);
            }
        }).catch(err => {
            this.state.loadStatus = LoadStatus.ERROR;
            console.error(err);
            infoDialog.open(<>
                <p>An error occurred. Please check your network connection and try again</p>
            </>);
        }).finally(() => {
            btn.text("Export").enabled();
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {isConsultant, hasProjects, isContractor} = storage.is;
        const {
            props: {dialog: {props: {titlePlural, renderExportFilterNode, addHRFilters}}},
            title,
            state: {excelUrl, loadStatus}
        } = this;
        return (<div className="controls-wrapper h-full">
            <div className="controls h-full">
                <div className="row col-lg-3 h-full padding-0 grid-1 align-content-top">
                    <label className="heading text-center h-45">
                        <h4 className="font-size-15">Find {titlePlural} To {title}:</h4>
                    </label>
                    <div
                        className="row sec-group padding-t-10 padding-b-15 padding-l-10 grid-1 grid-gap-10 overflow-y-auto w-full h-full">
                        {!isContractor && hasProjects && <React.Fragment>
                            {isConsultant && <SelectClientInput name="client" group="orgs1"
                                                                placeholder="Company..." required
                                                                className="col-lg-12 margin-0 form-control"
                                                                onChange={this.form.onChange}/>}
                            <SelectProjectInput name="project" group="orgs1"
                                                placeholder="Project..." showAll required
                                                className="col-lg-12 margin-0 form-control"
                                                onChange={this.form.onChange}/>
                            <SelectSiteInput name="site" group="orgs1" placeholder="Site..." showAll
                                             required className="col-lg-12 margin-0 form-control"
                                             onChange={this.form.onChange}/>
                            <hr className="pull-left no-border bg-ddd h-2"/>
                        </React.Fragment>}
                        <Fields ref="fields">
                            {addHRFilters && <>
                                <SelectDepartmentInput name="department" placeholder="Department..."
                                                       className="col-lg-12 form-control" parentClassName="margin-0"
                                                       onChange={this.form.onChange}
                                                       addButton={false}/>
                                <SelectJobPositionInput name="job_position" placeholder="Employee Job Position..."
                                                        className="col-lg-12 form-control" parentClassName="margin-0"
                                                        onChange={this.form.onChange}
                                                        addButton={false}/>
                                <SelectTeamInput name="team" placeholder="Team..." className="col-lg-12 form-control"
                                                 parentClassName="margin-0"
                                                 onChange={this.form.onChange}
                                                 addButton={false}/>
                                <SelectEmployeeInput name="employee" placeholder="Employee..."
                                                     className="col-lg-12 margin-0 form-control"
                                                     onChange={this.form.onChange}
                                                     addButton={false}/>
                                <hr className="pull-left no-border bg-ddd h-2"/>
                            </>}
                            {renderExportFilterNode && renderExportFilterNode.call(this, this.form.onChange)}
                        </Fields>
                    </div>
                    <hr className="pull-left no-border bg-ddd h-2"/>
                    <Button className="btn btn-primary hor-center h-40 margin-b-10" onClick={this.onSubmitExport}>
                        Export {titlePlural}
                    </Button>
                </div>
                <div className="row col-lg-9 h-full pull-right padding-0">
                    {loadStatus === LoadStatus.NONE && <>
                        <p className="margin-0 fixed-center font-size-18">
                            The exported {titlePlural} spreadsheet will appear here
                        </p>
                    </>}
                    {loadStatus === LoadStatus.LOADING && <>
                        <p className="margin-0 fixed-center font-size-18">Please wait...</p>
                        <p className="margin-0 margin-t-30 margin-b-10 fixed-center font-size-18">
                            Exporting {titlePlural}
                        </p>
                        <CircularProgress className="fixed-center margin-t-50"/>
                    </>}
                    {loadStatus === LoadStatus.LOADED && excelUrl && <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${excelUrl}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                    />}
                    {loadStatus === LoadStatus.ERROR && <>
                        <p className="margin-0 fixed-center font-size-18">
                            An error occurred while trying to view the document. Please try again later.
                        </p>
                    </>}
                </div>
            </div>
        </div>);
    }

    // </editor-fold>
}


@observer
class Fields extends React.Component {

    get fieldNames() {
        const {children} = this.props;
        return React.Children.map(children, (child, index) => {
            if (!child || !child.props.name) return null;

            return child.props.name;
        });
    }

    render() {
        const {children} = this.props;
        return <>{children}</>;
    }
}

export default ExportDialog;
