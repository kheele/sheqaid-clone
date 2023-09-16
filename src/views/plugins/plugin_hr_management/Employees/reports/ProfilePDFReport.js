// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Dates, execWhen} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';

import style from "./ProfilePDFReport.lazy.css";
import findByIdEmployee from "mutations/all/Employee/findByIdEmployee";
import {CircularProgress} from "@mui/material";
import PDFTronViewer from "components/documents/PDFTron/PDFTronViewer";
import {FormControls} from "components/FormComponents";

import DashboardSection from "../forms/DashboardSection";
import html2canvas from "html2canvas";
import DashboardTab from "../../AEmployeeDocDialog/ADashboardTab";
import employeeStore from "mutations/all/Employee";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfilePDFReport";

    constructor(props) {
        super(props, style);
    }

    title() {
        return storage.is.isEmployee ? "My Account" : ("Employee Report (" + (this.props.isRemoved ? "Removed" : "Active") + ")");
    }

    get topButtonsHiddenDelete() {
        return true;
    }

    get topButtonsHiddenPrint() {
        return true;
    }

    get isLoggedUser() {
        const {user} = storage.loggedUser;
        const {item} = this.state;
        return storage.is.isEmployee && item && item.id === user.id;
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        item: null,
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onApplyTemplateValues = this.onApplyTemplateValues.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    async componentDidMount() {
        const {dialog} = this.props;

        try {
            const item = await dialog.execWhen(() => this.props.state.item);

            this.state.item = await findByIdEmployee(item.id);

            const node = await dialog.execWhen(() => {
                try {
                    return dialog.getDOMNode();
                } catch (e) {
                }
            });
            const jqEl = $(node.querySelector('.dialog-header h3'));

            if (this.item.data.removed) {
                jqEl.removeClass('active');
            } else {
                jqEl.addClass('active');
            }
        } catch (e) {

        }
    }

    // </editor-fold>

    //<editor-fold desc="onApplyTemplateValues">
    async onApplyTemplateValues(doc) {
        const dashboardSection = await execWhen(() => this.refs.dashboardSection);
        const dashboardSectionNode = await dashboardSection.getDOMNode();
        const dashboardSectionCanvas = await html2canvas(dashboardSectionNode);
        dashboardSection.hide();
        const analytics = dashboardSectionCanvas.toDataURL('image/jpeg', 1.0);

        const docs_lists = {};
        (await Promise.all([
                "competency_list",
                // "contract_list",
                // "counselling_list",
                // "leave_list",
                // "license_list",
                // "medical_list",
                // "warning_list",
                // "work_permit_list",
            ].map(async key => await execWhen(() => ({key, [key]: this.refs[`dashboard_${key}`]}))
                .then(async v => {
                    const {key} = v;
                    const {[key]: ref} = v;
                    const node = await ref.getDOMNode();
                    ref.hide();
                    return {key, [key]: node};
                })
                .then(async v => {
                    const {key} = v;
                    const {[key]: node} = v;
                    const canvas = await html2canvas(node);
                    return {key, [key]: canvas};
                })
                .then(v => {
                    const {key} = v;
                    const {[key]: canvas} = v;
                    const img = canvas.toDataURL('image/jpeg', 1.0);
                    return {key, [key]: img};
                })))
        ).forEach(v => {
            const {key} = v;
            const {[key]: img} = v;
            docs_lists[`dashboard_${key}_img`] = img;
        });

        console.log('docs_lists', docs_lists)

        let {
            id, data: {
                created_at,
                profile_pic,
                //
                fname, lname, id_num, passport_num, dob, sex,
                //
                phone, email,
                //
                employment_num, employment_date,
                job_position, department,
                supervisor, team,
                //
                living_address_list,
                banking_detail_list,
                //
                next_of_kin_list = [],
                dependent_list = [],
                //
                document_list = [],
                //
                competency_list = [],
                contract_list = [],
                counselling_list = [],
                leave_list = [],
                license_list = [],
                medical_list = [],
                warning_list = [],
                work_permit_list = [],

                ppe_list = [],
                trainer_training_list = [],
                //
                client, project, site,
            }
        } = this.item;

        const {fname: author_fname, lname: author_lname} = storage.loggedUser.user.data;

        const living_address_default = living_address_list.find(v => v.is_default);
        const banking_detail_default = banking_detail_list.find(v => v.is_default);

        const document_id_passport_list = document_list.filter(v => !!v && v.type === "ID/Passport");
        const document_id_prdp_list = document_list.filter(v => !!v && v.type === "PrDP");

        const {
            dashboard_competency_list_img,
            dashboard_contract_list_img,
            dashboard_counselling_list_img,
            dashboard_leave_list_img,
            dashboard_license_list_img,
            dashboard_medical_list_img,
            dashboard_warning_list_img,
            dashboard_work_permit_list_img,
        } = docs_lists;

        const options = {
            logo: {image_url: `${locationRoot}img/profile_cover.jpg`, width: 70, height: 70},
            client: client && client.name.toUpperCase() || "",
            project: project && project.name.toUpperCase() || "",
            site: site && site.name.toUpperCase() || "",

            title: "Employees Report".toUpperCase(),
            author: `${author_lname} ${author_fname}`.toUpperCase(),
            date: Dates.formatTimestamp(new Date()).toUpperCase(),

            //
            profile_pic: {
                image_url: profile_pic ? profile_pic.dlUrls[0] : `${locationRoot}img/profile.png`,
                width: 70,
                height: 70
            },
            name: `${lname} ${fname}`.toUpperCase(),

            //basic details
            fname: fname.toUpperCase(),
            lname: lname.toUpperCase(),
            id_or_passport: id_num || passport_num || "",
            sex: sex && sex.toUpperCase() || "",
            dob: dob && Dates.formatDate(dob).toUpperCase() || "",

            //contact details
            email: email || "",
            phone: phone || "",

            //employment details
            employment_num: employment_num && String(employment_num).toUpperCase() || "",
            employment_date: employment_date && Dates.formatDate(employment_date).toUpperCase() || "",
            job_position: job_position && job_position.name.toUpperCase() || "",
            department: department && department.name.toUpperCase() || "",
            supervisor: supervisor && `${supervisor.lname.toUpperCase()} ${supervisor.fname.toUpperCase()}` || "",
            team: team && team.name.toUpperCase() || "",

            //analytics
            analytics: {image_url: analytics, width: 593, height: 310},

            //living address
            country: (living_address_default && living_address_default.country) ? living_address_default.country.name.toUpperCase() : "",
            zone: (living_address_default && living_address_default.zone) ? living_address_default.zone.name.toUpperCase() : "",
            city: (living_address_default && living_address_default.city) ? living_address_default.city.name.toUpperCase() : "",
            local_address: living_address_default && living_address_default.local_address && living_address_default.local_address.toUpperCase() || "",
            street_address: living_address_default && living_address_default.street_address && living_address_default.street_address.toUpperCase() || "",

            //banking details
            bank_name: banking_detail_default && banking_detail_default.name && banking_detail_default.name.toUpperCase() || "",
            branch: banking_detail_default && banking_detail_default.branch && banking_detail_default.branch.toUpperCase() || "",
            branch_code: banking_detail_default && banking_detail_default.branch_code && banking_detail_default.branch_code.toUpperCase() || "",
            account_num: banking_detail_default && banking_detail_default.account_num && String(banking_detail_default.account_num) || "",

            //dependants details
            dependants: Array.range(1, 6).map((_, n) => dependent_list[n] || {}).map(v => ({
                fname: v.fname || "",
                lname: v.lname || "",
                gender: v.gender || "",
                dob: Dates.formatDate(v.dob) || "",
            })),

            //next of kins details
            next_of_kins: Array.range(1, 4).map((_, n) => next_of_kin_list[n] || {}).map(v => ({
                fname: v.fname || "",
                lname: v.lname || "",
                phone1: v.phone1 || "",
                phone2: v.phone2 || "",
                relationship: v.relationship || ""
            })),

            //
            document_id_passport_count: String(document_id_passport_list.length),
            document_id_pdrp_count: String(document_id_prdp_list.length),

            //
            dashboard_competency_list_img: {image_url: dashboard_competency_list_img, width: 593, height: 310},
            dashboard_contract_list_img: {image_url: dashboard_contract_list_img, width: 593, height: 310},
            dashboard_counselling_list_img: {image_url: dashboard_counselling_list_img, width: 593, height: 310},
            dashboard_leave_list_img: {image_url: dashboard_leave_list_img, width: 593, height: 310},
            dashboard_license_list_img: {image_url: dashboard_license_list_img, width: 593, height: 310},
            dashboard_medical_list_img: {image_url: dashboard_medical_list_img, width: 593, height: 310},
            dashboard_warning_list_img: {image_url: dashboard_warning_list_img, width: 593, height: 310},
            dashboard_work_permit_list_img: {image_url: dashboard_work_permit_list_img, width: 593, height: 310},

            competency_count: String(competency_list.length),
            contract_count: String(contract_list.length),
            counselling_count: String(counselling_list.length),
            leave_count: String(leave_list.length),
            license_count: String(license_list.length),
            medical_count: String(medical_list.length),
            warning_count: String(warning_list.length),
            work_permit_count: String(work_permit_list.length),

            ppe_count: String(ppe_list.length),
            trainer_training_count: String(trainer_training_list.length),
        };

        return options;
    }

    //</editor-fold>

    //<editor-fold desc="lists">
    get lists() {
        const {id} = this.item;
        return [
            {
                key: "competency_list",
                findByIdHRDashboardStats: employeeStore.findByIdHRCompetenciesDashboardStats,
                findByIdHRDateRangeDashboardStats: employeeStore.findByIdHRCompetenciesDateRangeDashboardStats,
            },
            {
                key: "contract_list",
                findByIdHRDashboardStats: employeeStore.findByIdHRContractsDashboardStats,
                findByIdHRDateRangeDashboardStats: employeeStore.findByIdHRContractsDateRangeDashboardStats,
            },
            {
                key: "counselling_list",
                findByIdHRDashboardStats: employeeStore.findByIdHRCounselingsDashboardStats,
                findByIdHRDateRangeDashboardStats: employeeStore.findByIdHRCounselingsDateRangeDashboardStats,
            },
            {
                key: "leave_list",
                findByIdHRDashboardStats: employeeStore.findByIdHRLeavesDashboardStats,
                findByIdHRDateRangeDashboardStats: employeeStore.findByIdHRLeavesDateRangeDashboardStats,
            },
            {
                key: "license_list",
                findByIdHRDashboardStats: employeeStore.findByIdHRLicensesDashboardStats,
                findByIdHRDateRangeDashboardStats: employeeStore.findByIdHRLicensesDateRangeDashboardStats,
            },
            {
                key: "medical_list",
                findByIdHRDashboardStats: employeeStore.findByIdHRMedicalsDashboardStats,
                findByIdHRDateRangeDashboardStats: employeeStore.findByIdHRMedicalsDateRangeDashboardStats,
            },
            {
                key: "warning_list",
                findByIdHRDashboardStats: employeeStore.findByIdHRWarningsDashboardStats,
                findByIdHRDateRangeDashboardStats: employeeStore.findByIdHRWarningsDateRangeDashboardStats,
            },
            {
                key: "work_permit_list",
                findByIdHRDashboardStats: employeeStore.findByIdHRWorkPermitsDashboardStats,
                findByIdHRDateRangeDashboardStats: employeeStore.findByIdHRWorkPermitsDateRangeDashboardStats,
            },
        ].map(({key, findByIdHRDashboardStats, findByIdHRDateRangeDashboardStats}) => {
            const loadDashboard = async () => {
                const topStats = await findByIdHRDashboardStats(id);
                const bottomStats = await findByIdHRDateRangeDashboardStats(id);
                return {topStats, bottomStats};
            };
            return <DashboardTab
                ref={ref => {
                    this.refs[`dashboard_${key}`] = ref;
                }}
                title="Dashboard"
                loadDashboard={loadDashboard}
                topStatsSize={120}
                hidden
            />
        });

        // ppe_list = [],
        // trainer_training_list = [],
    }

    //</editor-fold>

    @computed get item() {
        return this.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
            },
            item, item: {
                id, data: {
                    created_at,
                    profile_pic,
                    fname, lname, id_num, passport_num, dob, sex,
                    client, project, site, phone, email,
                }
            }
        } = this;

        console.log('employee', this.item)

        return <FormControls>
            <PDFTronViewer url="templates/docx/MonthlyReport-EmployeeProfile.docx"
                           onApplyTemplateValues={this.onApplyTemplateValues}/>
            <DashboardSection ref="dashboardSection" item={this.item} hidden/>
            {this.lists}
        </FormControls>;
    }

    // </editor-fold>

}

export default ProfileDialog;