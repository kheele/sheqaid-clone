// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Page, Text, View} from '@react-pdf/renderer';

import {Dates} from 'utils/Utils';

import {getRiskRatingConsequenceList, getRiskRatingLikelihoodList} from 'views/plugins/utils';

import {Panel} from 'pdf-components';

import styles from './ProfilePDFReader.style';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends React.Component {
    
    render() {
        let {
            data: {
                sec9_data, sec11_data
            }
        } = this.props.item;
        
        let incident_date, incident_time, exact_location;
        if (sec9_data && sec9_data.incident_date) {
            incident_date = Dates.formatDate(sec9_data.incident_date);
        }
        if (sec9_data && sec9_data.incident_time) {
            incident_time = sec9_data.incident_time;
        }
        if (sec9_data && sec9_data.exact_location) {
            exact_location = sec9_data.exact_location;
        }
        let person_injured;
        if (sec11_data && sec11_data.person_injured) {
            const {fname, lname} = sec11_data.person_injured;
            person_injured = lname + ' ' + fname;
        }
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{height: '100%', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center', fontSize: 26}}>
                    <Text style={{margin: '35px auto 0'}}>INCIDENT INVESTIGATION</Text>
                    {person_injured && <Text style={{margin: '35px auto 0'}}>OF</Text>}
                    {person_injured && <Text style={{margin: '35px auto 0'}}>{person_injured}</Text>}
                    <Text style={{margin: '37px auto 0'}}>THAT OCCURRED ON</Text>
                    <Text style={{margin: '37px auto 0'}}>{incident_date} {incident_time}</Text>
                    {exact_location && <Text style={{margin: '35px auto 0'}}>AT</Text>}
                    {exact_location && <Text style={{margin: '35px auto 0'}}>{exact_location}</Text>}
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Cover Page</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageLast">
@observer
class PageLast extends React.Component {
    
    render() {
        
        return <Page size="A4" style={styles.page}>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Last Page</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Page2">
@observer
class Page2 extends React.Component {
    render() {
        const {item} = this.props;
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <IncidentDetailsPanel item={item}/>
                <WitnessesPanel item={item}/>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageParticipants">
@observer
class PageParticipants extends React.Component {
    render() {
        let {
            data: {
                classification,
                investigation
            }
        } = this.props.item;
        
        let investigation_team_list;
        if (investigation && investigation.sec1_data && investigation.sec1_data.investigation_team_list) {
            investigation_team_list = investigation.sec1_data.investigation_team_list;
        } else if (classification && classification.sec5_data && classification.sec5_data.investigation_team_list) {
            investigation_team_list = classification.sec5_data.investigation_team_list;
        }
        const Table = ({th, col, list}) => {
            return <View style={[styles.table]}>
                {list.map((val, ind) =>
                    <View key={ind} style={[styles.tableRow, th && ind === 0 ? styles.tableEm: {}]}>
                        <Text>{val.lname + ' ' + val.fname}</Text>
                        {val.job_position && <Text>{val.job_position}</Text>}
                    </View>
                )}
            </View>;
        };
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>1. PARTICIPANTS / PERSONS PRESENT</Text>
                    {investigation_team_list && <Table th col={['50%', '50%']} list={investigation_team_list}/>}
                    {!investigation_team_list && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="IncidentDetailsPanel">
@observer
class IncidentDetailsPanel extends React.Component {
    render() {
        let {
            data: {
                classification,
                sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data,
                sec9_data, sec10_data
            }
        } = this.props.item;
        
        if (classification) {
            sec1_data = classification.sec1_data || sec1_data;
            sec2_data = classification.sec2_data || sec2_data;
            sec3_data = classification.sec3_data || sec3_data;
            sec4_data = classification.sec4_data || sec4_data;
        }
                
        let incident_date, incident_time, exact_location;
        if (sec9_data && sec9_data.incident_date) {
            incident_date = Dates.formatDate(sec9_data.incident_date);
        }
        if (sec9_data && sec9_data.incident_time) {
            incident_time = sec9_data.incident_time;
        }
        if (sec9_data && sec9_data.exact_location) {
            exact_location = sec9_data.exact_location;
        }

        let date_reported, time_reported, person_reported_to, person_reporting;
        if (sec7_data && sec7_data.date_reported) {
            date_reported = Dates.formatDate(sec7_data.date_reported);
        }
        if (sec7_data && sec7_data.time_reported) {
            time_reported = sec7_data.time_reported;
        }
        if (sec7_data && sec7_data.person_reported_to) {
            const {fname, lname} = sec7_data.person_reported_to;
            person_reported_to = lname + ' ' + fname;
        }
        if (sec6_data && sec6_data.person_reporting) {
            const {fname, lname} = sec6_data.person_reporting;
            person_reporting = lname + ' ' + fname;
        }
        
        let person_involved_list;
        if (sec5_data && sec5_data.person_involved_list) {
            person_involved_list = sec5_data.person_involved_list;
        }

        const Table = ({th, col, list}) => {
            return <View style={[styles.table]}>
                {list.map((val, ind) =>
                    <View key={ind} style={[styles.tableRow, th && ind === 0 ? styles.tableEm: {}]}>
                        <Text>{val.lname + ' ' + val.fname}</Text>
                    </View>
                )}
            </View>;
        };
        
        let {category_list, sector_list, group, short_desc} = sec1_data;
        if(category_list) {
            category_list = category_list.filter(v => !!v).map(v => isString(v) ? v : v.value).join(', ');
        }
        if(sector_list) {
            sector_list = sector_list.filter(v => !!v).map(v => isString(v) ? v : v.value).join(', ');
        }
        let {sub_category_list, activity_list} = sec2_data;
        if(sub_category_list) {
            sub_category_list = sub_category_list.filter(v => !!v).map(v => isString(v) ? v : v.value).join(', ');
        }
        if(activity_list) {
            activity_list = activity_list.filter(v => !!v).map(v => isString(v) ? v : v.value).join(', ');
        }

        return <View style={[styles.contentPanel, {textAlign: "left"}]}>
            <Text style={styles.headingPoint}>2. INCIDENT DETAILS</Text>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <Text style={styles.headingPoint2}>2.1 Incident Group</Text>
                <Panel value={group}/>
            </View>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <Text style={styles.headingPoint2}>2.2 Incident Category</Text>
                <Panel value={category_list}/>
            </View>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <Text style={styles.headingPoint2}>2.3 Incident Sub-Category</Text>
                <Panel value={sub_category_list}/>
            </View>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <Text style={styles.headingPoint2}>2.4 Sector(s)</Text>
                <Panel value={sector_list}/>
            </View>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <Text style={styles.headingPoint2}>2.5 Activities</Text>
                <Panel value={activity_list}/>
            </View>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <Text style={styles.headingPoint2}>2.6 Location & Time Of Incident</Text>
                <View style={[styles.flexRow]}>
                    <Panel title="Date Occurred" value={incident_date} colStyle={{width: '50%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                    <Panel title="Time Occurred" value={incident_time} colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <Panel title="Incident Location" value={exact_location}/>
            </View>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <Text style={styles.headingPoint2}>2.7 Incident Reporting</Text>
                <View style={[styles.flexRow]}>
                    <Panel title="Date Reported" value={date_reported} colStyle={{width: '50%', borderBottom: '1px dotted #eee', borderRight: '1px dotted #eee'}}/>
                    <Panel title="Time Reported" value={time_reported} colStyle={{width: '50%', borderBottom: '1px dotted #eee'}}/>
                </View>
                <Panel title="Person Reported To" value={person_reported_to} colStyle={{borderBottom: '1px dotted #eee'}}/>
                <Panel title="Person Reporting" value={person_reporting}/>
            </View>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <Text style={styles.headingPoint2}>2.8 Person(s) Involved In The Incident</Text>
                {person_involved_list && <Table th col={['50%', '50%']} list={person_involved_list}/>}
                {!person_involved_list && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
            </View>
            <View style={[styles.flexColumn, {marginTop: 10}]}>
                <Text style={styles.headingPoint2}>2.9 Incident Description</Text>
                <Panel value={sec10_data && sec10_data.desc}/>
            </View>
        </View>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="WitnessesPanel">
@observer
class WitnessesPanel extends React.Component {
    render() {
        const {
            data: {
                sec8_data
            }
        } = this.props.item;
        
        let witness_list;
        if (sec8_data && sec8_data.witness_list) {
            witness_list = sec8_data.witness_list;
        }
        
        const renderer = v => {
            return v.map(({lname, fname}) => (lname + ' ' + fname)).join(', ');
        };

        return <View style={[styles.contentPanel, {textAlign: "left"}]}>
            <Text style={styles.headingPoint}>3. INCIDENT WITNESS(ES)</Text>
            <Panel value={witness_list} renderer={renderer}/>
        </View>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageIncidentInjuryDetails">
@observer
class PageIncidentInjuryDetails extends React.Component {
    render() {
        const {
            data: {
                sec11_data
            }
        } = this.props.item;
        
        let person_injured, injured_person_dob, injured_person_gender;
        if (sec11_data && sec11_data.person_injured) {
            const {fname, lname} = sec11_data.person_injured;
            person_injured = lname + ' ' + fname;
        }
        if (sec11_data && sec11_data.injured_person_dob) {
            injured_person_dob = Dates.formatDate(sec11_data.injured_person_dob);
        }
        if (sec11_data && sec11_data.injured_person_gender) {
            injured_person_gender = sec11_data.injured_person_gender;
        }
        
        let nature_of_injury_list, bodily_injury_location_list, injury_mechanism_list, injury_desc;
        if (sec11_data && sec11_data.nature_of_injury_list) {
            nature_of_injury_list = sec11_data.nature_of_injury_list.map(v => isString(v) ? v : v.value).join(', ');
        }
        if (sec11_data && sec11_data.bodily_injury_location_list) {
            bodily_injury_location_list = sec11_data.bodily_injury_location_list.map(v => isString(v) ? v : v.value).join(', ');
        }
        if (sec11_data && sec11_data.injury_mechanism_list) {
            injury_mechanism_list = sec11_data.injury_mechanism_list.map(v => isString(v) ? v : v.value).join(', ');
        }
        if (sec11_data && sec11_data.injury_desc) {
            injury_desc = sec11_data.injury_desc;
        }
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>4. INCIDENT INJURY</Text>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={{paddingBottom: '5px'}}>4.1 Person Injured</Text>
                        <View style={[styles.flexRow]}>
                            <Panel title="Name" value={person_injured} colStyle={{width: '33.3333%', borderRight: '1px dotted #eee'}}/>
                            <Panel title="Date Of Birth" value={injured_person_dob} colStyle={{width: '33.3333%', borderRight: '1px dotted #eee'}}/>
                            <Panel title="Gender" value={injured_person_gender} colStyle={{width: '33.3333%'}}/>
                        </View>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>4.2 Nature Of Injury</Text>
                        <Panel value={nature_of_injury_list}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>4.3 Part(s) Of Body Injured</Text>
                        <Panel value={bodily_injury_location_list}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>4.4 Direct Cause Of Injury</Text>
                        <Panel value={injury_mechanism_list}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>4.5 Injury Description</Text>
                        <Panel value={injury_desc}/>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageCauseAnalysis">
@observer
class PageCauseAnalysis extends React.Component {
    render() {
        const {
            data: {
                investigation
            }
        } = this.props.item;
        
        const Table = ({th, col, list}) => {
            return <View style={[styles.table]}>
                {list.map(({text, corrective_actions}, ind) =>
                    <View key={ind} style={[styles.tableRow, th && ind === 0 ? styles.tableEm: {}]}>
                        <Text>{text}</Text>
                    </View>
                )}
            </View>;
        };
        
        let cause_analysis = {};
        if (investigation && investigation.sec4_data && investigation.sec4_data.cause_analysis) {
            cause_analysis = investigation.sec4_data.cause_analysis;
            cause_analysis.immediate_analysis = cause_analysis.immediate_analysis || {};
            cause_analysis.root_analysis = cause_analysis.root_analysis || {};
        }
        const {
            immediate_analysis = {}, 
            root_analysis = {}
        } = cause_analysis;
        const {
            sub_standard_practices_or_unsafe_acts = [],
            custom_sub_standard_practices_or_unsafe_acts = [],
            sub_standard_practices_or_unsafe_conditions = [],
            custom_sub_standard_practices_or_unsafe_conditions = []
        } = immediate_analysis;
        const {
            personal_factors = [],
            custom_personal_factors = [],
            job_factors = [],
            custom_job_factors = []
        } = root_analysis;
        
        const all_sub_standard_practices_or_unsafe_acts = [...sub_standard_practices_or_unsafe_acts, ...custom_sub_standard_practices_or_unsafe_acts];
        const all_sub_standard_practices_or_unsafe_conditions = [...sub_standard_practices_or_unsafe_conditions, ...custom_sub_standard_practices_or_unsafe_conditions];
        const all_personal_factors = [...personal_factors, ...custom_personal_factors];
        const all_job_factors = [...job_factors, ...custom_job_factors];
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>5. CAUSE ANALYSIS</Text>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={[styles.headingPoint2, {fontWeight: 'bold'}]}>5.1 Direct/Immediate Cause(s)</Text>

                        <Text style={[styles.headingPoint2, {marginTop: 7}]}>5.1.1 Sub-Standard Practices / Unsafe Acts</Text>
                        {!all_sub_standard_practices_or_unsafe_acts.isEmpty() && 
                            <Table th col={['50%', '50%']} list={all_sub_standard_practices_or_unsafe_acts}/>
                        }
                        {all_sub_standard_practices_or_unsafe_acts.isEmpty() && 
                            <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>
                        }

                        <Text style={[styles.headingPoint2, {marginTop: 7}]}>5.1.2 Sub-Standard Conditions / Unsafe Conditions</Text>
                        {!all_sub_standard_practices_or_unsafe_conditions.isEmpty() && 
                            <Table th col={['50%', '50%']} list={all_sub_standard_practices_or_unsafe_conditions}/>
                        }
                        {all_sub_standard_practices_or_unsafe_conditions.isEmpty() && 
                            <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>
                        }
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={[styles.headingPoint2, {fontWeight: 'bold'}]}>5.2 Indirect/Basic/Root Cause(s)</Text>

                        <Text style={[styles.headingPoint2, {marginTop: 7}]}>5.2.1 Personal Factors</Text>
                        {!all_personal_factors.isEmpty() && 
                            <Table th col={['50%', '50%']} list={all_personal_factors}/>
                        }
                        {all_personal_factors.isEmpty() && 
                            <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>
                        }
                        <Text style={[styles.headingPoint2, {marginTop: 7}]}>5.2.2 Job Factors</Text>
                        {!all_job_factors.isEmpty() && 
                            <Table th col={['50%', '50%']} list={all_job_factors}/>
                        }
                        {all_job_factors.isEmpty() && 
                            <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>
                        }
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageSeverity">
@observer
class PageSeverity extends React.Component {
    render() {
        const {
            data: {
                investigation,
                sec14_data
            }
        } = this.props.item;
        
        console.log('PageSeverity', investigation, sec14_data)
        
        let risk_rating = null;
        if(investigation && investigation.sec3_data) {
            let {risk_rating: _rr, consequence, likelihood} = investigation.sec3_data;
            risk_rating = _rr || {consequence, likelihood};
        } else if(sec14_data) {
            let {risk_rating: _rr, consequence, likelihood} = sec14_data;
            risk_rating = _rr || {consequence, likelihood};
        }
        
        const consequenceOpts = getRiskRatingConsequenceList();
        const likelihoodOpts = getRiskRatingLikelihoodList();
        
        let {consequence, likelihood} = risk_rating;
        consequence = isNumber(consequence) ? consequence : parseInt(consequence.charAt(0));
        likelihood = isNumber(likelihood) ? likelihood : likelihood.charAt(0);
        if(!isNumber(likelihood)) {
            likelihood = 'ABCDE'.indexOf(likelihood) + 1;
        }
        
        let risk_rank;
        if(isNumber(consequence) && isNumber(likelihood)) {
            risk_rating = consequence * likelihood;
            if(risk_rating > 15) {
                risk_rank = "Extreme";
            } else if(risk_rating >= 9 && risk_rating <= 15) {
                risk_rank = "High";
            } else if(risk_rating >= 5 && risk_rating <= 8) {
                risk_rank = "Moderate";
            } else if(risk_rating < 5) {
                risk_rank= "Low";
            }
        }
        
        if(isNumber(consequence)) {
            consequence = consequenceOpts[consequence - 1];
        }
        if(isNumber(likelihood)) {
            likelihood = likelihoodOpts[likelihood - 1];
        }
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>6. INCIDENT SEVERITY</Text>

                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>Consequence / Severity</Text>
                        <Panel value={consequence} renderer={v => v.text ? v.text.substring(2).trim() : v}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>Likelihood / Probability</Text>
                        <Panel value={likelihood} renderer={v => v.text ? v.text.substring(2).trim() : v}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>Risk Rating</Text>
                        <Panel value={risk_rating}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>Risk Rank</Text>
                        <Panel value={risk_rank}/>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageInvestigation">
@observer
class PageInvestigation extends React.Component {
    render() {
        const {
            data: {
                classification,
                investigation,
                sec1_data, sec2_data, sec3_data, sec4_data, sec5_data, sec6_data, sec7_data, sec8_data, 
                sec9_data, sec10_data, sec11_data, sec12_data, sec13_data, sec14_data, sec15_data
            }
        } = this.props.item;
        
        const TeamTable = ({th, col, index, list}) => {
            return <View style={[styles.table]}>
                {list.map((val, ind) =>
                    <View key={ind} style={[styles.tableRow, th && ind === 0 ? styles.tableEm: {}]}>
                        <Text>{index}.{ind + 1} {val.lname + ' ' + val.fname}</Text>
                        {val.job_position && <Text>{val.job_position}</Text>}
                    </View>
                )}
            </View>;
        };
        const FindingsTable = ({th, col, index, list}) => {
            return <View style={[styles.table]}>
                {list.map((v, ind) =>
                    <View key={ind} style={[styles.tableRow, th && ind === 0 ? styles.tableEm: {}]}>
                        <Text>{index}.{ind + 1} {isString(v) ? v : v.text}</Text>
                    </View>
                )}
            </View>;
        };
        
        let investigation_team_list = null;
        if(investigation && investigation.sec1_data && investigation.sec1_data.investigation_team_list) {
            investigation_team_list = investigation.sec1_data.investigation_team_list;
        } else if(classification && classification.sec5_data && classification.sec5_data.investigation_team_list) {
            investigation_team_list = classification.sec5_data.investigation_team_list;
        }
        
        const investigation_details = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_details : null;
        const investigation_findings_list = (investigation && investigation.sec2_data && investigation.sec2_data.investigation_findings_list) ? 
            investigation.sec2_data.investigation_findings_list : null;
        const investigation_findings_further_desc = (investigation && investigation.sec2_data) ? investigation.sec2_data.investigation_findings_further_desc : null;
        const document_list = (investigation && investigation.sec2_data && investigation.sec2_data.document_list) ? 
            investigation.sec2_data.document_list : null;
            
        let {
            weather_condition_list, 
            protective_equipment_worn_list,
            class_list,
            environment_list,
            //
            estimated_costs_damages = 0, 
            estimated_costs_medical = 0, 
            estimated_costs_salaries_wages = 0, 
            estimated_costs_investigations = 0, 
            estimated_costs_others = 0
        } = investigation || {};
        if(weather_condition_list) {
            weather_condition_list = weather_condition_list.join(', ');
        }    
        if(protective_equipment_worn_list) {
            protective_equipment_worn_list = protective_equipment_worn_list.join(', ');
        }    
        if(class_list) {
            class_list = class_list.join(', ');
        }   
        if(environment_list) {
            environment_list = environment_list.join(', ');
        }
        
        const calcTotalCosts = () => {
            return estimated_costs_damages + 
                    estimated_costs_medical + 
                    estimated_costs_salaries_wages + 
                    estimated_costs_investigations + 
                    estimated_costs_others;
        };
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>7. INCIDENT INVESTIGATION</Text>

                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>7.1 Investigation Description</Text>
                        <Panel value={investigation_details}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>7.2 Investigation Team</Text>
                        {investigation_team_list && <TeamTable th col={['50%', '50%']} index="7.2" list={investigation_team_list}/>}
                        {!investigation_team_list && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>7.3 Investigation Findings</Text>
                        {investigation_findings_list && <FindingsTable th col={['50%', '50%']} index="7.3" list={investigation_findings_list}/>}
                        {!investigation_findings_list && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>7.4 Further Investigation Findings</Text>
                        <Panel value={investigation_findings_further_desc}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>7.5 Weather Conditions</Text>
                        <Panel value={weather_condition_list}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>7.6 Protective Equipment Worn</Text>
                        <Panel value={protective_equipment_worn_list}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>7.7 Class</Text>
                        <Panel value={class_list}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>7.8 Environment</Text>
                        <Panel value={environment_list}/>
                    </View>
                    <View style={[styles.flexColumn, {marginTop: 10}]}>
                        <Text style={styles.headingPoint2}>7.9 Estimated Costs</Text>
                        <View style={[styles.flexRow]}>
                            <Panel title="Damages" value={estimated_costs_damages.toCurrency('R')} colStyle={{borderBottom: '1px dotted #eee'}}/>
                            <Panel title="Medical" value={estimated_costs_medical.toCurrency('R')} colStyle={{borderBottom: '1px dotted #eee'}}/>
                            <Panel title="Salaries / Wages" value={estimated_costs_salaries_wages.toCurrency('R')} colStyle={{borderBottom: '1px dotted #eee'}}/>
                            <Panel title="Investigations" value={estimated_costs_investigations.toCurrency('R')} colStyle={{borderBottom: '1px dotted #eee'}}/>
                            <Panel title="Others" value={estimated_costs_others.toCurrency('R')} colStyle={{borderBottom: '1px dotted #eee'}}/>
                            <Panel title="Total" value={calcTotalCosts().toCurrency('R')}/>
                        </View>
                    </View>
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageEvidence">
@observer
class PageEvidence extends React.Component {
    
    constructor() {
        super();
        this.renderItemGroup = this.renderItemGroup.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    
    renderItemGroup(group, n) {
        return <View style={[styles.evidencePanelGroup, {borderTopWidth: n === 0 ? 0 : 1}]}>
            {group.map(this.renderItem)}
        </View>;
    }
    
    renderItem(item, n) {
        const {dlUrls} = item;
        return <View key={n} >
            {dlUrls && dlUrls[0]}
        </View>;
    }
    
    render() {
        const {
            data: {
                investigation
            }
        } = this.props.item;
                
        const document_list = (investigation && investigation.sec2_data && investigation.sec2_data.document_list) ? 
            investigation.sec2_data.document_list : [];
        
        const groupedList = document_list.splitAt(3);
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>8. INCIDENT EVIDENCE</Text>
                    {groupedList.map(this.renderItemGroup)}
                    {groupedList.isEmpty() && <Text style={{padding: 10, backgroundColor: '#fff'}}>N/A</Text>}
                </View>
            </View>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #eee', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '1px solid #ddd', paddingLeft: 10, width: '60px'}}>Page 1 of 1</Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

export {PageFirst, PageParticipants, Page2, PageIncidentInjuryDetails, PageCauseAnalysis, PageSeverity, PageInvestigation, PageEvidence, PageLast};
//573