// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Dates} from '../../../../../../utils/Utils';

import {ProfileField} from '../../../../../../components/inputs';
import {FormControls, Row} from '../../../../../../components/FormComponents';
import {AProfileDialog} from '../../../../../../components/dialogs';

import style from "./ProfileTrainingPlanDialog.lazy.css";
import findByIdClient from "../../../../../../mutations/all/Client/findByIdClient";
import findByIdProject from "../../../../../../mutations/all/Project/findByIdProject";
import findByIdSite from "../../../../../../mutations/all/Site/findByIdSite";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileTrainingPlanDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Training Plan";
    }

    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    @observable
    state = {
        lists: {}
    };

    constructor(props) {
        super(props);
    }

    get item() {
        return this.props.state.item;
    }

    //<editor-fold desc="isView funs">
    get isViewCourse() {
        const {props: {dialog: {props: {state}}}} = this;
        const {view, target_view} = state;
        const {id, target} = target_view || {};
        return view === 'Course';
    }

    get isViewYear() {
        const {props: {dialog: {props: {state}}}} = this;
        const {view, target_view} = state;
        const {id, target} = target_view || {};
        return view === 'Year';
    }

    get isViewJobPosition() {
        const {props: {dialog: {props: {state}}}} = this;
        const {view, target_view} = state;
        const {id, target} = target_view || {};
        return view === 'Job Position';
    }

    get isViewEmployee() {
        const {props: {dialog: {props: {state}}}} = this;
        const {view, target_view} = state;
        const {id, target} = target_view || {};
        return view === 'Employee';
    }
    //</editor-fold>

    //<editor-fold desc="renderByCourse">
    get renderByCourse() {
        if (!this.isViewCourse) return null;

        const {
            item, item: {
                // group,
                // group: {data: {name}},
                // list,
                // results,
                // status,
                // employee_list,
                // job_position_list,

                id,
                data: {
                    name,
                    job_position_list_count,
                    training_cost,
                    employee_list_count,
                    year_list,
                    results_failed,
                    results_passed,
                    status_not_started,
                    status_in_progress,
                    status_outstanding,
                    status_completed,
                    results_average,
                }
            }
        } = this;

        return <>
            <ProfileField title="Course" value={name} className="col-lg-12"/>
        </>
    }
    //</editor-fold>

    //<editor-fold desc="renderByYear">
    get renderByYear() {
        if (!this.isViewYear) return null;

        const {
            item, item: {
                // group,
                // list,
                // results,
                // status,
                // employee_list,
                // job_position_list,
                // course_list,

                year,
                training_cost,
                course_list_count,
                job_position_list_count,
                employee_list_count,
                status_outstanding,
                status_completed,
                status_not_started,
                results_failed,
                results_passed,
                results_average,
            }
        } = this;

        return <>
            <ProfileField title="Year" value={year} className="col-lg-12"/>
        </>
    }
    //</editor-fold>

    //<editor-fold desc="renderByJobPosition">
    get renderByJobPosition() {
        if (!this.isViewJobPosition) return null;

        const {
            item, item: {
                // list,
                // results,
                // status,
                // employee_list,
                // course_list,
                // status_outstanding,
                // status_completed,
                // status_not_started,
                // results_failed,
                // results_passed,
                // results_average,

                id,
                name,
                course_list_count,
                training_cost,
                employee_list_count,
                year_list,
            }
        } = this;

        return <>
            <ProfileField title="Job Position" value={name} className="col-lg-12"/>
        </>
    }
    //</editor-fold>

    //<editor-fold desc="renderByEmployee">
    get renderByEmployee() {
        if (!this.isViewEmployee) return null;

        const {
            item, item: {
                // list,
                // results,
                // status,
                // course_list,
                // status_outstanding,
                // status_completed,
                // status_not_started,
                // results_failed,
                // results_passed,
                // results_average,

                data: {
                    lname,
                    fname,
                    profile_pic,
                    job_position,
                    course_list_count,
                    training_cost,
                    year_list,
                }
            }
        } = this;

        return <>
            <ProfileField title="Employee" value={`${lname} ${fname}`} className="col-lg-12"/>
        </>
    }
    //</editor-fold>

    //<editor-fold desc="orgs">
    get orgs() {
        const {item, item: {data}} = this;
        const {client, project, site, client_id, project_id, site_id} = data || item;
        console.log('orgs', data || item);
        return {
            client_id: client_id || (client ? client.id : null),
            project_id: project_id || (project ? project.id : null),
            site_id: site_id || (site ? site.id : null),
        };
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        if (!this.item) {
            return null;
        }

        const {
            props: {onFormNext, onFormBack, onFormOpen},
            renderByCourse, renderByYear, renderByJobPosition, renderByEmployee
        } = this;

        const {isConsultant, isNoProjects} = storage.is;
        const {client_id, project_id, site_id} = this.orgs;

        return <FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {isConsultant && <ProfileFieldLoader value={findByIdClient(client_id)}>
                    <ProfileField name="client" title="Company" className="col-lg-12"/>
                </ProfileFieldLoader>}
                <ProfileFieldLoader value={findByIdProject(project_id)}>
                    <ProfileField name="project" title="Project" className="col-lg-12"/>
                </ProfileFieldLoader>
                <ProfileFieldLoader value={findByIdSite(site_id)}>
                    <ProfileField name="site" title="Site" className="col-lg-12"/>
                </ProfileFieldLoader>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Training Plan Details"
                onFormOpen={onFormOpen}
                onFormBack={!isNoProjects && onFormBack}
            >
                {renderByCourse}
                {renderByYear}
                {renderByJobPosition}
                {renderByEmployee}
            </Row>
        </FormControls>;
    }

    //</editor-fold>

}

//<editor-fold desc="ProfileFieldLoader">
@observer
class ProfileFieldLoader extends React.Component {

    @observable state = {
        value: null,
        loaded: false,
    };

    async componentDidMount() {
        const {value} = this.props;
        this.state.loaded = false;
        this.state.value = await value;
        this.state.loaded = true;
    }

    get children() {
        const {value, props: {children}} = this;
        return React.Children.map(children, (child, index) => {
            const props = {
                value,
                renderer: val => val.data.name,
            };

            return React.cloneElement(child, props);
        });
    }

    @computed get value() {
        return this.state.value;
    }

    render() {
        const {value, state: {loaded}} = this;
        if (!loaded) return null;

        return <>
            {this.children}
        </>
    }
}

//</editor-fold>

export default ProfileDialog;
