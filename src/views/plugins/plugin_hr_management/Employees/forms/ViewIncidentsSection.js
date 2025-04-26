// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Dates} from "utils/Utils";
import {ActionsButton} from 'components/inputs';
import {Row} from 'components/FormComponents';
import {IncidentStatus} from 'views/plugins/plugin_sheq_assist/17_Incident_Investigation/dialogs/IncidentComponentRows';
import {THead, TRow} from 'components/tables';

// </editor-fold>

@observer
class ViewIncidentsSection extends React.Component {
    pageKey = "ViewIncidentsTab";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        person_injured: [],
        driver: [],
        person_involved_list: [],
        witness_list: [],
        person_reporting: [],
        person_reported_to: [],
        investigation_team_list: [],
        corrective_action_list: [],
        distribution_list: []
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentMount">
    componentDidMount() {
        const {
            id, data: {
                incident_list = {}
            }
        } = this.props.item;

        const {
            person_involved_list = [],
            driver = [],
            person_reporting = [],
            person_reported_to = [],
            witness_list = [],
            person_injured = [],
            investigation_team_list = [],
            corrective_action_list = [],
            distribution_list = []
        } = incident_list;

        // const path = "plugin_sheq_assist/17_Incident_Investigation/";
        //
        // workers.emit(path + "find_by_ids", person_injured).then(res => {
        //     this.state.person_injured = res;
        // });
        // workers.emit(path + "find_by_ids", driver).then(res => {
        //     this.state.driver = res;
        // });
        // workers.emit(path + "find_by_ids", person_involved_list).then(res => {
        //     this.state.person_involved_list = res;
        // });
        // workers.emit(path + "find_by_ids", witness_list).then(res => {
        //     this.state.witness_list = res;
        // });
        // workers.emit(path + "find_by_ids", person_reporting).then(res => {
        //     this.state.person_reporting = res;
        // });
        // workers.emit(path + "find_by_ids", person_reported_to).then(res => {
        //     this.state.person_reported_to = res;
        // });
        // workers.emit(path + "find_by_ids", investigation_team_list).then(res => {
        //     this.state.investigation_team_list = res;
        // });
        // workers.emit(path + "find_by_ids", corrective_action_list).then(res => {
        //     this.state.corrective_action_list = res;
        // });
        // workers.emit(path + "find_by_ids", distribution_list).then(res => {
        //     this.state.distribution_list = res;
        // });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Incident Date</div>
            <div className="td fixed-flex min-w-140">Type</div>
            <div className="td">Category</div>
            <div className="td">Description</div>
            <div className="td">Location</div>
            <div className="td fixed-flex min-w-120">Status</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(item, n, onClick) {
        let {
            id, data: {
                created_at, status,
                client, project, site,
                classification,
                investigation,
                sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data,
                sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data,
//                sec1_data: {category_list, short_desc},//1
//                sec2_data: {sub_category_list},//2
//                sec3_data: {type},//3
//                sec4_data: {secondary_type_list},//4
//                sec5_data: {person_involved_list},//5
//                sec6_data: {person_reporting},//6
//                sec7_data: {person_reported_to, date_reported, time_reported},//7
//                sec8_data: {witness_list},//8
//                sec9_data: {incident_date, incident_time, exact_location},//9
//                sec10_data: {document_list, desc},//10
//                sec11_data: {person_injured, injured_person_dob, injured_person_gender, nature_of_injury_list, bodily_injury_location_list, injury_mechanism_list},//11
//                sec12_data: {test_undertaken, test_type_list, test_type_drug_undertaken, test_type_alcohol_undertaken, test_type_mobile_device_undertaken},//12
//                sec13_data: {is_vehicle_incident, is_infringement_issued, did_police_attend_scene, collision_reported_to_police_station, have_charges_been_laid},//13
//                sec14_data: {consequence, frequency, risk_rating},//15
//                sec15_data: {distribution_list}//16
            }
        } = item;
//        console.log('Incidents', item)

        if (classification) {
            sec1_data = classification.sec1_data || sec1_data;
            sec2_data = classification.sec2_data || sec2_data;
            sec3_data = classification.sec3_data || sec3_data;
            sec4_data = classification.sec4_data || sec4_data;
        }

        return <TRow key={id}>
            <div className="td fixed-flex min-w-120">
                <h6 className="xs-shown font-size-13">Incident Date</h6>
                {sec9_data && sec9_data.incident_date ? Dates.formatDate(sec9_data.incident_date) : 'N/A'}
            </div>
            <div className="td fixed-flex min-w-140">
                <h6 className="xs-shown font-size-13">Type</h6>
                {sec3_data && sec3_data.type ? sec3_data.type : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Category</h6>
                {sec1_data && sec1_data.category_list ? sec1_data.category_list.map(v =>
                    <span>{isString(v) ? v : v.value}</span>) : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Description</h6>
                {sec1_data && sec1_data.short_desc ? sec1_data.short_desc : 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Location</h6>
                {sec9_data && sec9_data.exact_location ? sec9_data.exact_location : 'N/A'}
            </div>
            <IncidentStatus key={new Date().getTime()} item={item}/>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
            onFormNext, onFormBack, onFormOpen,
            item, item: {
                id,
                data: {},
            },
            idx,
        } = this.props;

        const {
            person_injured,
            driver,
            person_involved_list,
            witness_list,
            person_reporting,
            person_reported_to,
            investigation_team_list,
            corrective_action_list,
            distribution_list
        } = this.state;

        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls pos-relative">
                    <Row
                        rendered idx={idx + ".1"}
                        title={idx + ".1 Incidents Injured"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >

                    </Row>
                    <Row
                        rendered idx={idx + ".2"}
                        title={idx + ".2 Incidents Where Is A Driver"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >

                    </Row>
                    <Row
                        rendered idx={idx + ".3"}
                        title={idx + ".3 Incidents Involved"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >

                    </Row>
                    <Row
                        rendered
                        idx={idx + ".4"}
                        title={idx + ".4 Incidents Reported"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >

                    </Row>
                    <Row
                        rendered
                        idx={idx + ".5"}
                        title={idx + ".5 Incidents Reported To"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >

                    </Row>
                    <Row
                        rendered
                        idx={idx + ".6"}
                        title={idx + ".6 Incidents Investigating"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >

                    </Row>
                    <Row
                        rendered
                        idx={idx + ".7"}
                        title={idx + ".7 Incidents With Corrective Actions"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >

                    </Row>
                    <Row
                        rendered
                        idx={idx + ".8"}
                        title={idx + ".8 Incidents Distributed To"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >

                    </Row>
                </div>
            </div>
        </div>;
    }

    // </editor-fold>
}

export default ViewIncidentsSection;