import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {createColumnChart2, createScatterChartMulti} from 'utils/ChartUtils';
import {ClearableInput} from 'components/inputs';
import {CircularProgress} from "@material-ui/core";

//<editor-fold desc="Investigations">
@observer
class DashboardInvestigations extends React.Component {
    key = 'DashboardInvestigations';

    @observable
    state = {
        lists: {years: []},
        dataLoaded: false,
        dataError: false,
        list: [],
        year: new Date().getFullYear()
    };

    constructor(props) {
        super(props);
        const start = this.state.year;
        const end = start - 2000;
        for (var value = start; value >= 2000; value--) {
            this.state.lists.years.push({label: value, value});
        }

        this.load = this.load.bind(this);

        this.form = new Form();

        this.onChangeYear = this.onChangeYear.bind(this);
        this.form.addChangeOne("year", this.onChangeYear);
    }

    componentDidMount() {
        this.load();
    }

    componentWillUpdate() {
//        this.load();
    }

    onChangeYear(el, val) {
        if (val) {
            this.state.year = parseInt(val);
        }
        this.load();
    }

    @computed get currY() {
        return this.state.year;
    }

    get defaultY() {
        const value = this.state.year;
        return {label: value, value};
    }

    async load() {
        //{year, month, date, day, am_pm}
//        this.state.dataLoaded = false;
        await neonBinding.events.emit(this.props.path, this.currY).then(res => {
            this.state.list = res;
//            console.log('stats', res)
            this.state.dataLoaded = true;
            this.state.dataError = false;
        }).catch(e => {
            console.error(e)
            this.state.dataLoaded = true;
            this.state.dataError = true;
        });

    }

    createCharts(title, supplier) {
        const {currY} = this;
        const groups = this.list.groupBy(supplier);
//        console.log('charts_type groups', groups)
        const data_points_annual = Object.keys(groups).map(k => {
            const list = groups[k];
//            console.log('charts_type groups', k, list)
            let dataPoints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
                const _list = list.filter(({data: {sec9_data}}) => sec9_data && sec9_data.incident_date_split.month === month);
                const sum = _list.length;
                const label = Dates.monthsStr.get(month);
                return {label, y: sum};
            });
            return {name: k, dataPoints};
        });
        const charts_annual = createScatterChartMulti(
            title + " Summary (" + currY + ")",
            "# Of Incidents",
            "Month (" + currY + ")",
            "###0",
            data_points_annual
        );

        const charts_day = Object.keys(groups).map(k => {
            const list = groups[k];
            const createChart = am_pm => {
                const data_points = [0, 1, 2, 3, 4, 5, 6].map(day => {//sec9_data.incident_date_split.day
                    const _list = list.filter(({data: {sec9_data}}) =>
                        sec9_data && (sec9_data.incident_date_split.day === day &&
                            sec9_data.incident_date_split.am_pm === am_pm)
                    );
                    const sum = _list.length;
                    let label = Dates.weekDaysStr.get(day + 1).substring(0, 3);
                    return {label, legendText: am_pm === 'AM' ? 'Morning' : 'After Noon', y: sum};
                });
                return data_points;
            };
            let data_points_1 = createChart("AM");
            let data_points_2 = createChart("PM");

            const __title = title + " Summary (" + currY + ")";
            const title_axis_y = "# Of Incidents";
            const title_axis_x = "Week Day (" + currY + ")";
            const y_value_format_string = "###0";
            const charts = createColumnChart2({
                title: __title,
                title_axis_y,
                title_axis_x,
                y_value_format_string,
                data_points: [data_points_1, data_points_2]
            });
            return {title: k, charts};
        });
        return {charts_annual, charts_day};
    }

    @computed get list() {
        return this.state.list.filter(v => !!v);
    }

    @computed get charts_type() {
        return this.createCharts("Incident Type", ({id, data: {classification, sec3_data}}) => {
            if(classification) {
                sec3_data = classification.sec3_data || sec3_data;
            }
            //'Alcohol Testing', 'Arson', 'Assault', 'Fatality', 'Final Product', 'First Aid Injury', 'Forensic', 'Nearmiss', 'Irreversible Diagnosed Occupational Disease', 'Lost Time Injury', 'Medical Treatment Injury', 'Noise Induced Hearing Loss', 'Restricted Work Injury', 'Rreversible Diagnosed Occupational Disease', 'Structure', 'Vandalism', 'Vehicle', 'Other'
            return sec3_data.type;
        });
    }

    @computed get charts_category_list() {
        return this.createCharts("Incident Category", ({id, data: {classification, sec1_data}}) => {
            if(classification) {
                sec1_data = classification.sec1_data || sec1_data;
            }
            //'Safety', 'Health', 'Environment', 'Quality', 'Financial', 'Food Safety', 'Audit / Non-Conformance'
            if(sec1_data) {
                return (sec1_data.category_list || []).map(v => isString(v) ? v : v.value);
            }
            return [];
        });
    }

    @computed get charts_nature_of_injury_list() {
        return this.createCharts("Incident Nature Of Injury", ({id, data: {classification, sec11_data}}) => {
            //"Abrasions", "Amputation", "Asphyxiation", "Burns (Chemical Burns)", "Burns (Hot Liquids)", "Burns (Hot Surfaces)",
            //"Contusion (Bruises)", "Electrical Shock", "Foreign Object In Eye", "Fracture", "Incision (Knives / Glass Cuts)", "Lacerations (Ragged Etched Wounds)",
            //"No Visible Injury", "Poisoning", "Puncture Wound", "Snake Spitting", "Snake Bite", "Sprains", "Strain", "Unconscious",
            //"Other Injuries (Specify)"
            if(sec11_data) {
                return (sec11_data.nature_of_injury_list || []).map(v => isString(v) ? v : v.value);
            }
            return [];
        });
    }

    @computed get charts_bodily_injury_location_list() {
        return this.createCharts("Incident Bodily Injury Location (Part(s) Of Body Injured)", ({id, data: {classification, sec11_data}}) => {
            //"Abdomen", "Ankle(Left)", "Ankle(Right)", "Arm(Left)", "Arm(Right)", "Chest",
            //"Ear/Hearing(Left)", "Ear/Hearing(Right)", "Elbow(Left)", "Elbow(Right)", "Eye(Left)", "Eye(Right)",
            //"Foot/Toe(s)(Left)", "Foot/Toe(s)(Right)", "Forearm(Left)", "Forearm(Right)",
            //"Hand/Finger(s)(Left)", "Hand/Finger(s)(Right)", "Head/Face", "Knee(Left)", "Knee(Right)",
            //"Leg(Left)", "Leg(Right)", "Mouth", "Neck", "Nose", "Pelvis", "Pubis",
            //"Shoulder(Left)", "Shoulder(Right)", "Thigh(Left)", "Thigh(Right)", "Wrist(Left)", "Wrist(Right)",

            //"Back", "Internal Organs", "Hips", "Respiratory", "Trunk",
            //"Other Injuries (Specify)
            if(sec11_data) {
                return (sec11_data.bodily_injury_location_list || []).map(v => isString(v) ? v : v.value);
            }
            return [];
        });
    }

    @computed get charts_injury_mechanism_list() {
        return this.createCharts("Incident Injury Mechanism (Direct Cause Of Injury)", ({id, data: {classification, sec11_data}}) => {
            //"Animals (All excl snakes)", "Assault", "Caught between or under (Crushed/Amputated)", "Caught In (Pinch & Nip Points)", "Contact With Chemicals",
            //"Contact With Electricity", "Contact With Flames", "Contact With High Temperature", /*"Contact With ...",*/ "Contact With Hot Surfaces",
            //"Contact With Noise", /*"Contact With ..."*/, "Contact With Sharp Object - Other", "Drowning", /*"...",*/,
            //"Falling Into", "Falling Object", /*"...",*/, "Handling (Lifting Or Pushing)", "Slipping",
            ///*"...",*/, "Struck Against (Running Or Bumping Into)", "Struck By Moving Object", /*"...",*/ "Vehicle",
            //"Other Or Multiple Mechanisms (Specify)"
            if(sec11_data) {
                return (sec11_data.injury_mechanism_list || []).map(v => isString(v) ? v : v.value);
            }
            return [];
        });
    }

    update() {
        this.load();
    }

    render() {
        const {state: {value}} = this.props;
        if(value !== this.key) return null;

        const {
            state,
            charts_type,
            charts_category_list,
            charts_nature_of_injury_list,
            charts_bodily_injury_location_list,
            charts_injury_mechanism_list
        } = this;

        const {isConsultant, isHasProjects} = storage.is;
        const {selectedClient = {}, selectedProject = {}, selectedSite = {}} = storage.selected;
        const renderName = (title, titlePlural, selected) => {
            if(!selected) return <React.Fragment>All<br/>{titlePlural}</React.Fragment>;
            const {id, name, data} = selected;
            return <React.Fragment>{title}<br/>{name || data.name}</React.Fragment>;
        };
        return <React.Fragment>
            <div className="filter-input flex">
                {isHasProjects && <label className="margin-b-0 flex">
                    {isConsultant && <span className="counter border-radius-20 font-size-13 h-40 margin-r-10">
                        {renderName("Company", "Companies", selectedClient)}
                    </span>}
                    <span className="counter border-radius-20 font-size-13 h-40 margin-r-10">{renderName("Project", "Projects", selectedProject)}</span>
                    <span className="counter border-radius-20 font-size-13 h-40 margin-r-10">{renderName("Site", "Sites", selectedSite)}</span>
                </label>}
                <ClearableInput name="year" type="select" placeholder="Filter By Year" className="fixed-flex min-w-140 margin-t-5 form-control" onChange={this.form.onChange} defaultValue={this.defaultY} values={this.state.lists.years} returnValue/>
            </div>
            <StatsGroupList
                state={state}
                charts_type={charts_type}
                charts_category_list={charts_category_list}
                charts_nature_of_injury_list={charts_nature_of_injury_list}
                charts_bodily_injury_location_list={charts_bodily_injury_location_list}
                charts_injury_mechanism_list={charts_injury_mechanism_list}/>
        </React.Fragment>;
    }

}
//</editor-fold>

//<editor-fold desc="StatsGroupList">
@observer
class StatsGroupList extends React.Component {

    @computed get list() {
        return this.props.state.list.filter(v => !!v);
    }

    render() {
        const {
            state: {year, dataLoaded, dataError},
            charts_type,
            charts_category_list,
            charts_nature_of_injury_list,
            charts_bodily_injury_location_list,
            charts_injury_mechanism_list
        } = this.props;
        if(!dataLoaded) {
            return <div className="results-loading fixed-center">
                <CircularProgress/>
                Loading <b>{year}</b> incidents statistics...
            </div>;
        }
        if(dataError) {
            return <div className="results-none fixed-center">
                An error occurred while loading
            </div>;
        }
        if(this.list.isEmpty()) {
            return <div className="results-none fixed-center">
                No <b>{year}</b> incidents found
            </div>
        }
        const key = new Date().getTime();
        return <React.Fragment>
            {/*<StatsGroup key={"1-" + key} title="Incident Type" charts={charts_type}/>*/}
            {/*<StatsGroup key={"2-" + key} title="Incident Category" charts={charts_category_list}/>*/}
            {/*<StatsGroup key={"3-" + key} title="Incident Nature Of Injury" charts={charts_nature_of_injury_list}/>*/}
            {/*<StatsGroup key={"4-" + key} title="Incident Bodily Injury Location (Part(s) Of Body Injured)" charts={charts_bodily_injury_location_list}/>*/}
            {/*<StatsGroup key={"5-" + key} title="Incident Injury Mechanism (Direct Cause Of Injury)" charts={charts_injury_mechanism_list}/>*/}
        </React.Fragment>;
    }
}
//</editor-fold>

export default DashboardInvestigations;
