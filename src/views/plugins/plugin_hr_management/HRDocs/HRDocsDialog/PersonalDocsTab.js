// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from "mobx";

import {PageTitle} from "components";

import {Permissions} from 'utils/Utils';
import {Button} from 'components/inputs';
import AList from "views/AList";
import style from "./PersonalDocsTab.lazy.css";
import {CircularProgress} from "@mui/material";

import GridGraphsVerticalBarChart from "../../Employees/DashboardTab/GridGraphsVerticalBarChart";

import {PrDPDialog} from "../PrDPs";
import {IDOrPassportDialog} from "../IDOrPassports";
import {WorkPermitsDialog} from '../WorkPermits';
import {LicensesDialog} from "../Licenses";
import {findByIdOrgDashboardStatsByLogged} from "mutations/employeeOrgDashboard";

// </editor-fold>

@observer
class Tab extends AList {
    pageKey = "HRDocsTab";
    title = "Personal Documents";

    compRefs = {};

    @observable state = {
        data: DATA_LOAD_STATUS.LOADING,
    };

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props, style);

        this.onViewDialog = this.onViewDialog.bind(this);

        this.update = this.update.bind(this);
        this.load = this.load.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="elements, navItems, buttons, dialogs">
    @computed
    get elements() {
        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        return [
            {key: 'Licenses', listName: 'license_list', text: 'Licenses', Comp: LicensesDialog},
            {
                key: 'PrDP',
                listName: 'prdp_list',
                onFilter: k => k.startsWith('document_prdp_list'),
                text: 'PrDPs',
                Comp: PrDPDialog
            },
            {
                key: 'IDOrPassports',
                listName: 'id_or_passport_list',
                onFilter: k => k.startsWith('document_id_passport_list'),
                text: 'ID/Passports',
                Comp: IDOrPassportDialog
            },
            {
                key: 'WorkPermits',
                listName: 'work_permit_list',
                text: 'Work Permits (Foreigners)',
                Comp: WorkPermitsDialog
            },
        ].map(({key, text, listName, onFilter, Comp, titleBG, noExpiry, override}) => {
            const c = Permissions.allowMod(key) || override ? "allowed" : "disallowed";
            const className = fontSizeClass + c + " btn btn-primary pull-right _888";
            const compRef = `ref${key.replaceAll(" ", "")}Dialog`;
            return {
                btn: <Button compRef={compRef} text={text} className={className} onClick={this.onViewDialog}/>,
                key, c, compRef, titleBG, text, Comp, noExpiry,
                listName, onFilter
            };
        });
    }

    // </editor-fold>

    @computed
    get buttons() {
        return this.elements.map(({btn}) => btn).reverse();
    }

    // </editor-fold>

    @computed
    get dialogs() {
        return this.elements.map(({compRef, Comp}) => <Comp ref={ref => this.compRefs[compRef] = ref}/>);
    }

    @computed get tiles() {
        return this.elements.filter(({c}) => c === 'allowed');
    }

    componentDidMount() {
        this.update();
    }

    update() {
        const {state} = this;
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
        return findByIdOrgDashboardStatsByLogged();
    }

    // <editor-fold defaultstate="collapsed" desc="onViewDialog, onChangeMoreOptions">
    onViewDialog(evt, el) {
        const {compRef} = el.props;
        this.compRefs[compRef].open();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isContractor, isContractorView} = storage.is;

        const w = $(window).width();
        const fontSizeClass = w < 1100 ? "font-size-12 " : "";

        const writable = isContractor || !isContractorView;
        return <div className="left-buttons pull-left">
            {this.buttons}
        </div>;
    }

    // </editor-fold>

    render() {
        const {permissionKey} = this.props;
        const {isEmployee} = storage.is;

        const {data} = this.state;
        if (isNullable(data) || data === DATA_LOAD_STATUS.LOADING) {
            return <div className="stats-count grid-1 grid-gap-10 margin-b-10 h-100">
                <CircularProgress/>
            </div>;
        }

        if (data === DATA_LOAD_STATUS.ERROR) {
            return null;
        }

        return <div
            className="PersonalDocsTab content pos-relative padding-10 row margin-0 margin-t-45 margin-b-50 h-full">
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

export default Tab;
