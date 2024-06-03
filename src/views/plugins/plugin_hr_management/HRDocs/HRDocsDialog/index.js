// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import { observer } from 'mobx-react';
import { observable, computed } from "mobx";

import { PageTitle } from "components";

import siteStore from "mutations/all/Site";
import projectStore from "mutations/all/Project";
import clientStore from "mutations/all/Client";
import companyStore from "mutations/all/Company";
import contractorStore from "mutations/all/Contractor";

import { Permissions } from 'utils/Utils';
import { Button } from 'components/inputs';
import ADialogList from "views/ADialogList";
import style from "./HRDocsDialog.lazy.css";
import Tabs from "components/tabs/Tabs";
import { Grid } from "@mui/material";
import MKBox from "components/MK/MKBox";
import {CircularProgress} from "@mui/material";

import GridGraphsVerticalBarChart from "../../Employees/DashboardTab/GridGraphsVerticalBarChart";

import { PrDPDialog } from "../PrDPs";
import { IDOrPassportDialog } from "../IDOrPassports";
import { LicensesDialog } from '../Licenses';
import { WorkPermitsDialog } from '../WorkPermits';
// </editor-fold>

@observer
class Dialog extends ADialogList {
    pageKey = "HRDocsDialog";
    title = "Employee Documents";
    
	compRefs = {};

    @observable state = {
        data: DATA_LOAD_STATUS.LOADING,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onViewDialog = this.onViewDialog.bind(this);

        this.update = this.update.bind(this);
        this.load = this.load.bind(this);
		this.renderLeftButtons = this.renderLeftButtons.bind(this);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        style.use();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

	componentDidMount() {
		this.update();
	}

    update() {
        const { state } = this;
        state.data = DATA_LOAD_STATUS.LOADING;

        this.load().then(res => {
            console.log('res', res && res.data)
            if (res) {
                state.data = res.data || res;
            }
        }).catch(err => {
            console.error(err);
            state.data = DATA_LOAD_STATUS.ERROR;
        });
    }

    load() {
        const { selectedClient, selectedProject, selectedSite } = storage.selected;
        const { isConsultant, isNoProjects, isContractorView } = storage.is;
        if (isContractorView) {
            const { is: { isContractor, }, loggedContractor } = storage;
            let { selectedContractorSite, selectedContractorClient } = storage.selected;

            return contractorStore.findByIdHRDashboardStatsByLogged(loggedContractor);
        } else {
            if (isConsultant) {
                console.log('load', 'isConsultant')
                if (selectedSite) {
                    console.log('load', 'selectedSite')
                    return siteStore.findByIdHRDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    console.log('load', 'selectedProject')
                    return projectStore.findByIdHRDashboardStatsByLogged(selectedProject);
                } else if (selectedClient) {
                    console.log('load', 'selectedClient')
                    return clientStore.findByIdHRDashboardStatsByLogged(selectedClient);
                } else {
                    console.log('load', 'company')
                    return companyStore.findByIdHRDashboardStatsByLogged();
                }
            } else if (!isNoProjects) {//client with projects
                if (selectedSite) {
                    return siteStore.findByIdHRDashboardStatsByLogged(selectedSite);
                } else if (selectedProject) {
                    return projectStore.findByIdHRDashboardStatsByLogged(selectedProject);
                } else {
                    return companyStore.findByIdHRDashboardStatsByLogged();
                }
            } else {//client with no projects
                return companyStore.findByIdHRDashboardStatsByLogged();
            }
        }
    };

    // <editor-fold defaultstate="collapsed" desc="onViewDialog, onChangeMoreOptions">
    onViewDialog(evt, el) {
        const { compRef } = el.props;
        this.compRefs[compRef].open();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="elements, navItems, buttons, dialogs">
    @computed
    get elements() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return [
            { key: 'Licenses', listName: 'license_list', text: 'Licenses', Comp: LicensesDialog },
            { key: 'PrDP', listName: 'prdp_list', onFilter: k => k.startsWith('document_prdp_list'), text: 'PrDPs', Comp: PrDPDialog },
            { key: 'IDOrPassports', listName: 'id_or_passport_list', onFilter: k => k.startsWith('document_id_passport_list'), text: 'ID/Passports', Comp: IDOrPassportDialog },
            { key: 'WorkPermits', listName: 'work_permit_list', text: 'Work Permits', Comp: WorkPermitsDialog },
        ].map(({ key, text, listName, onFilter, Comp, titleBG, noExpiry, override }) => {
            const c = Permissions.allowMod(key) || override ? "allowed" : "disallowed";
            const className = fontSizeClass + c + " btn btn-primary pull-right _888";
            const compRef = `ref${key.replaceAll(" ", "")}Dialog`;
            return {
                btn: <Button compRef={compRef} text={text} className={className} onClick={this.onViewDialog} />,
                key, c, compRef, titleBG, text, Comp, noExpiry,
                listName, onFilter
            };
        });
    }

    @computed
    get buttons() {
        return this.elements.map(({ btn }) => btn).reverse();
    }

    @computed
    get dialogs() {
        return this.elements.map(({ compRef, Comp }) => <Comp ref={ref => this.compRefs[compRef] = ref} />);
    }

    @computed get tiles() {
        return this.elements.filter(({ c }) => c === 'allowed');
    }

    // </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
	renderLeftButtons() {
		const { isContractor, isContractorView } = storage.is;

		const w = $(window).width();
		const fontSizeClass = w < 1100 ? "font-size-12 " : "";

		const writable = isContractor || !isContractorView;
		return <div className="left-buttons pull-left">
			{this.buttons}
		</div>;
	}

	// </editor-fold>

    renderPage() {
        const { permissionKey } = this.props;
        const { isEmployee } = storage.is;

        const { data } = this.state;
        if (isNullable(data) || data === DATA_LOAD_STATUS.LOADING) {
            return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
                <CircularProgress />
            </div>;
        }

        if (data === DATA_LOAD_STATUS.ERROR) {
            return null;
        }

        return <div className="content pos-relative padding-10 row margin-0 h-full">
            <PageTitle>
				{this.renderLeftButtons()}
			</PageTitle>
            <GridGraphsVerticalBarChart
                ref="gridGraphsVerticalBarChart"
                data={data}
                list={this.tiles}
                onViewDialog={this.onViewDialog}
            />
            {this.dialogs}
        </div>
    }
}

export default Dialog;
