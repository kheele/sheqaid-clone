// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {getRandomRolor} from '../../../../utils/Utils';

import style from "./DashboardTab.lazy.css";

// </editor-fold>

@observer
class DashboardTab extends React.Component {
    static key = 'Dashboard';
    
    // <editor-fold defaultstate="collapsed" desc="constructor, componentWillMount, componentWillUnmount">
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }
    
    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>
    
    update() {
        this.refs.chemical_inventory.update();
        this.refs.sds.update();
        this.refs.hazchem_sheet.update();
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {path} = this.props;
        return <div id="DashboardTab" className={"DashboardTab-page"}>
            <div className="page-content flex nice-scrollbars">
                <ContentChemicalProduct ref="chemical_inventory" state={this.state} path={path}/>
                <ContentSDS ref="sds" state={this.state} path={path}/>
                <ContentHazchemSheet ref="hazchem_sheet" state={this.state} path={path}/>
            </div>
        </div>;
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="AContent">
@observer
class AContent extends React.Component { 
    
    @observable state = {
        list: [],
        loadStatus: null
    };
    
    // <editor-fold defaultstate="collapsed" desc="constructor, componentDidMount">
    constructor(props) {
        super(props);
        
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.update();
    }
    // </editor-fold>
    
    @computed get list() {
        return this.state.list;
    }
    
    update() {
        this.state.loadStatus = "LOADING";
        neonBinding.events.emit(`${this.props.path}${this.key}/list`).then(list => {
            this.state.list = list;
            this.state.loadStatus = "SUCCESS";
        }).catch(err => {
            this.state.loadStatus = "ERROR";
        });
    }
    
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ContentChemicalProduct">
@observer
class ContentChemicalProduct extends AContent { 
    key = "chemical-inventory";
    
    //physical_state
    @computed get physicalStateGasList() {
        const {list} = this;
        return list.filter(({data}) => data.physical_state === "Gas");
    }
    
    @computed get physicalStateLiquidList() {
        const {list} = this;
        return list.filter(({data}) => data.physical_state === "Liquid");
    }
    
    @computed get physicalStateSolidList() {
        const {list} = this;
        return list.filter(({data}) => data.physical_state === "Solid");
    }
    
    @computed get physicalStateLiquidCrystalList() {
        const {list} = this;
        return list.filter(({data}) => data.physical_state === "Liquid Crystal");
    }
        
    //risk_level
    @computed get riskLevelLowList() {
        const {list} = this;
        return list.filter(({data}) => data.risk_level === "Low");
    }
    
    @computed get riskLevelMediumList() {
        const {list} = this;
        return list.filter(({data}) => data.risk_level === "Medium");
    }
    
    @computed get riskLevelHighList() {
        const {list} = this;
        return list.filter(({data}) => data.risk_level === "High");
    }
    
    @computed get riskLevelVeryHighList() {
        const {list} = this;
        return list.filter(({data}) => data.risk_level === "Very High");
    }
    
    //is_stable
    @computed get isStableYesList() {
        const {list} = this;
        return list.filter(({data}) => data.is_stable === "Yes");
    }
    
    @computed get isStableNoList() {
        const {list} = this;
        return list.filter(({data}) => data.is_stable === "No");
    }
        
    //is_hazardous
    @computed get isHazardousYesList() {
        const {list} = this;
        return list.filter(({data}) => data.is_hazardous === "Yes");
    }
    
    @computed get isHazardousNoList() {
        const {list} = this;
        return list.filter(({data}) => data.is_hazardous === "No");
    }
        
    //is_combustible
    @computed get isCombustibleYesList() {
        const {list} = this;
        return list.filter(({data}) => data.is_combustible === "Yes");
    }
    
    @computed get isCombustibleNoList() {
        const {list} = this;
        return list.filter(({data}) => data.is_combustible === "No");
    }
        
    //is_flammable
    @computed get isFlammableYesList() {
        const {list} = this;
        return list.filter(({data}) => data.is_flammable === "Yes");
    }
    
    @computed get isFlammableNoList() {
        const {list} = this;
        return list.filter(({data}) => data.is_flammable === "No");
    }
        
    //has_sds
    @computed get hasSDSYesList() {
        const {list} = this;
        return list.filter(({data}) => data.has_sds === "Yes" || !!data.sds || !!data.sds_doc);
    }
    
    @computed get hasSDSNoList() {
        const {list} = this;
        return list.filter(({data}) => data.has_sds === "No" || (!data.sds && !data.sds_doc));
    }
        
    //has_hazchem_sheet
    @computed get hasHazchemSheetYesList() {
        const {list} = this;
        return list.filter(({data}) => data.has_hazchem_sheet === "Yes" || !!data.hazchem_sheet || !!data.hazchem_sheet_doc);
    }
    
    @computed get hasHazchemSheetNoList() {
        const {list} = this;
        return list.filter(({data}) => data.has_hazchem_sheet === "No" || (!data.hazchem_sheet && !data.hazchem_sheet_doc));
    }
        
    //has_risk_assessment
    @computed get hasRAYesList() {
        const {list} = this;
        return list.filter(({data}) => data.has_risk_assessment === "Yes" || !!data.risk_assessment || !!data.risk_assessment_doc);
    }
    
    @computed get hasRANoList() {
        const {list} = this;
        return list.filter(({data}) => data.has_risk_assessment === "No" || (!data.risk_assessment && !data.risk_assessment_doc));
    }
    
    render() {
        const {list, state: {loadStatus}} = this;
        if(!loadStatus || loadStatus === "LOADING") {
            return null;
        } else if(loadStatus === "ERROR") {
            
        }
        return <React.Fragment>
            <div className="margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top">
                <h4 className="margin-0 min-h-20 text-center">Chemical Products Stats</h4>
                <div className="margin-0 grid-1 grid-gap-10">
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Physical State</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.physicalStateGasList} title='Gas'/>
                            <Stats value={this.physicalStateLiquidList} title='Liquid'/>
                            <Stats value={this.physicalStateSolidList} title='Solid'/>
                            <Stats value={this.physicalStateLiquidCrystalList} title='Liquid Crystal'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Risk Level</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.riskLevelLowList} title='Low'/>
                            <Stats value={this.riskLevelMediumList} title='Medium'/>
                            <Stats value={this.riskLevelHighList} title='High'/>
                            <Stats value={this.riskLevelVeryHighList} title='Very High'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Is Stable?</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.isStableYesList} title='Yes'/>
                            <Stats value={this.isStableNoList} title='No'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Is Hazardous?</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.isHazardousYesList} title='Yes'/>
                            <Stats value={this.isHazardousNoList} title='No'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Is Combustible?</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.isCombustibleYesList} title='Yes'/>
                            <Stats value={this.isCombustibleNoList} title='No'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Is Flammable?</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.isFlammableYesList} title='Yes'/>
                            <Stats value={this.isFlammableNoList} title='No'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Has SDS?</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.hasSDSYesList} title='Yes'/>
                            <Stats value={this.hasSDSNoList} title='No'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Has Hazchem Sheet?</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.hasHazchemSheetYesList} title='Yes'/>
                            <Stats value={this.hasHazchemSheetNoList} title='No'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Has Risk Assessment?</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.hasRAYesList} title='Yes'/>
                            <Stats value={this.hasRANoList} title='No'/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ContentSDS">
@observer
class ContentSDS extends AContent {
    key = "msds";
    
    //physical_state
    @computed get physicalStateGasList() {
        const {list} = this;
        return list.filter(({data}) => data.product && (data.product.physical_state === "Gas" || data.product.data.physical_state === "Gas"));
    }
    
    @computed get physicalStateLiquidList() {
        const {list} = this;
        return list.filter(({data}) => data.product && (data.product.physical_state === "Liquid" || data.product.data.physical_state === "Liquid"));
    }
    
    @computed get physicalStateSolidList() {
        const {list} = this;
        return list.filter(({data}) => data.product && (data.product.physical_state === "Solid" || data.product.data.physical_state === "Solid"));
    }
    
    @computed get physicalStateLiquidCrystalList() {
        const {list} = this;
        return list.filter(({data}) => data.product && (data.product.physical_state === "Liquid Crystal" || data.product.data.physical_state === "Liquid Crystal"));
    }
        
    //risk_level
    @computed get riskLevelLowList() {
        const {list} = this;
        return list.filter(({data}) => data.risk_level === "Low");
    }
    
    @computed get riskLevelMediumList() {
        const {list} = this;
        return list.filter(({data}) => data.risk_level === "Medium");
    }
    
    @computed get riskLevelHighList() {
        const {list} = this;
        return list.filter(({data}) => data.risk_level === "High");
    }
    
    @computed get riskLevelVeryHighList() {
        const {list} = this;
        return list.filter(({data}) => data.risk_level === "Very High");
    }
        
    //has_product
    @computed get hasProductYesList() {
        const {list} = this;
        return list.filter(({data}) => !!data.product);
    }
    
    @computed get hasProductNoList() {
        const {list} = this;
        return list.filter(({data}) => !data.product);
    }
    
    render() {
        const {list, state: {loadStatus}} = this;
        if(!loadStatus || loadStatus === "LOADING") {
            return null;
        } else if(loadStatus === "ERROR") {
            
        }
        return <React.Fragment>
            <div className="margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top">
                <h4 className="margin-0 min-h-20 text-center">Safety Data Sheets Stats</h4>
                <div className="margin-0 grid-1 grid-gap-10">
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Physical State</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.physicalStateGasList} title='Gas'/>
                            <Stats value={this.physicalStateLiquidList} title='Liquid'/>
                            <Stats value={this.physicalStateSolidList} title='Solid'/>
                            <Stats value={this.physicalStateLiquidCrystalList} title='Liquid Crystal'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Risk Level</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.riskLevelLowList} title='Low'/>
                            <Stats value={this.riskLevelMediumList} title='Medium'/>
                            <Stats value={this.riskLevelHighList} title='High'/>
                            <Stats value={this.riskLevelVeryHighList} title='Very High'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Has Chemical Product?</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.hasProductYesList} title='Yes'/>
                            <Stats value={this.hasProductNoList} title='No'/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ContentHazchemSheet">
@observer
class ContentHazchemSheet extends AContent { 
    key = "hazchem-sheet";
    
    //physical_state
    @computed get physicalStateGasList() {
        const {list} = this;
        return list.filter(({data}) => data.physical_state === "Gas");
    }
    
    @computed get physicalStateLiquidList() {
        const {list} = this;
        return list.filter(({data}) => data.physical_state === "Liquid");
    }
    
    @computed get physicalStateSolidList() {
        const {list} = this;
        return list.filter(({data}) => data.physical_state === "Solid");
    }
    
    @computed get physicalStateLiquidCrystalList() {
        const {list} = this;
        return list.filter(({data}) => data.physical_state === "Liquid Crystal");
    }
        
    //risk_level
    @computed get riskLevelLowList() {
        const {list} = this;
        return list.filter(({data}) => data.product && (data.product.risk_level === "Low" || data.product.data.risk_level === "Low"));
    }
    
    @computed get riskLevelMediumList() {
        const {list} = this;
        return list.filter(({data}) => data.product && (data.product.risk_level === "Medium" || data.product.data.risk_level === "Medium"));
    }
    
    @computed get riskLevelHighList() {
        const {list} = this;
        return list.filter(({data}) => data.product && (data.product.risk_level === "High" || data.product.data.risk_level === "High"));
    }
    
    @computed get riskLevelVeryHighList() {
        const {list} = this;
        return list.filter(({data}) => data.product && (data.product.risk_level === "Very High" || data.product.data.risk_level === "Very High"));
    }
    
    //has_product
    @computed get hasProductYesList() {
        const {list} = this;
        return list.filter(({data}) => !!data.product);
    }
    
    @computed get hasProductNoList() {
        const {list} = this;
        return list.filter(({data}) => !data.product);
    }
    
    render() {
        const {list, state: {loadStatus}} = this;
        if(!loadStatus || loadStatus === "LOADING") {
            return null;
        } else if(loadStatus === "ERROR") {
            
        }
        return <React.Fragment>
            <div className="margin-0 margin-r-10 grid-1 grid-gap-10 align-content-top">
                <h4 className="margin-0 min-h-20 text-center">Hazchem Sheets Stats</h4>
                <div className="margin-0 grid-1 grid-gap-10">
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Physical State</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.physicalStateGasList} title='Gas'/>
                            <Stats value={this.physicalStateLiquidList} title='Liquid'/>
                            <Stats value={this.physicalStateSolidList} title='Solid'/>
                            <Stats value={this.physicalStateLiquidCrystalList} title='Liquid Crystal'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Risk Level</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.riskLevelLowList} title='Low'/>
                            <Stats value={this.riskLevelMediumList} title='Medium'/>
                            <Stats value={this.riskLevelHighList} title='High'/>
                            <Stats value={this.riskLevelVeryHighList} title='Very High'/>
                        </div>
                    </div>
                    <div className="panel-left margin-0 padding-b-5 fixed-flex">
                        <h4 className="margin-0 min-h-25 font-size-15">Has Chemical Product?</h4>
                        <div className="margin-0 grid-2 grid-gap-5 fixed-flex">
                            <Stats value={this.hasProductYesList} title='Yes'/>
                            <Stats value={this.hasProductNoList} title='No'/>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Stats">
@observer
class Stats extends React.Component {
    
    @observable state = {
        value: null,
        loading: true
    };

    async componentDidMount() {
        const {props: {value}} = this;
        this.state.loading = true;
        if(value instanceof Promise) {
            this.state.value = await value;
        } else {
            this.state.value = value;
        }
        this.state.loading = false;
    }
    
    render() {
        const {props: {title, className = ""}} = this;
        const {value, loading} = this.state;
//        console.log('value', value)
        const style = {background: getRandomRolor()};
        return <div style={style} className={"padding-10 Statistics " + className}>
            <label className="text-center w-full margin-b-10">{title}</label>
            <div className="content">
                {loading && <CircularProgress/>}
                {!loading && ((isArray(value) || isObservableArray(value)) ? value.length : value)}
            </div>
        </div>;
    }
}
// </editor-fold>

export default DashboardTab;
