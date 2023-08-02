// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Page, Text, View} from '@react-pdf/renderer';

import {execWhen} from '../../../../utils/Utils';

import {Panel, ProfilePic, styles} from '../../../../pdf-components';

const PageWrapper = ({size, orientation, style, children}) => (
  <Page wrap size={size} orientation={orientation} style={style}>
    {children}
  </Page>
);
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageFirst">
@observer
class PageFirst extends React.Component {
    
    componentDidMount() {
        setTimeout(() => {
            this.props.counter.pos = "PageFirst";
        }, 100);
    }
    
    render() {
        let {
            data: {
                client, project, site,
                //1
                created_at,
                profile_pic,
                fname, lname, id_num, passport_num, dob, sex,
                phone, email,
                optional_info = {}
            }
        } = this.props.item;
        const {title} = this.props;
        
        const {job_position} = optional_info;
        
        const rowStyle = {margin: '30px auto 0px', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center'};
        
        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={{height: '100%', display: 'flex', flexDirection: 'column', placeItems: "center", justifyContent: 'center', fontSize: 26}}>
                    <Text style={{margin: '20px auto 0'}}>{title}</Text>
                    <Text style={{margin: '0px auto 20px', fontSize: '15px'}}>OF</Text>
                        
                    <View style={rowStyle}>    
                        <View style={[styles.profilePicCover]}>
                            <ProfilePic profilePic={profile_pic}/>
                        </View>
                        <Text style={{marginTop: '10px'}}>{fname} {lname}</Text>
                    </View>
                        
                    {job_position && <View style={rowStyle}>
                        <Text>JOB POSITION</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{job_position.name || job_position.data.name}</Text>
                    </View>}
                        
                    {client && <View style={rowStyle}>
                        <Text>COMPANY</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{client.name || client.data.name}</Text>
                    </View>}
                        
                    {project && <View style={rowStyle}>
                        <Text>PROJECT</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{project.name || project.data.name}</Text>
                    </View>}
                        
                    {site && <View style={rowStyle}>
                        <Text>SITE</Text>
                        <Text style={{marginTop: '10px', fontSize: '15px'}}>{site.name || site.data.name}</Text>
                    </View>}
                </View>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageLast">
@observer
class PageLast extends React.Component {
    
    render() {
        
        return <PageWrapper size="A4" style={styles.page}>
            <View fixed style={[styles.flexRow, {fontSize: 9, justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '4px solid #fafafa', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
                <Text style={{flexGrow: 1}}>Powered by SHEQ Aid</Text>
                <Text style={{borderLeft: '4px solid #ddd', paddingLeft: 10, width: '60px'}}>Last Page</Text>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Page2">
@observer
class Page2 extends React.Component {
    @observable state = {renderer: false};
    
    componentDidMount() {
        execWhen(() => this.props.counter.pos === "PageFirst").then(() => {
            this.state.renderer = true;
            setTimeout(() => {
                this.props.counter.pos = "Page2";
            }, 100);
        });
    }
    
    render() {
        if(!this.state.renderer) return null;
        const {
            data: {
                profile_pic,
                fname, lname, id_num, passport_num, dob, sex,
                client, project, site,
                phone, email,
                optional_info = {}
            }
        } = this.props.item;
        
        const {
            employment_date, employee_num, department, job_position,
            supervisor_name, supervisor_phone, supervisor_email
        } = optional_info;
        
        const {isConsultant} = storage.is;
        
        return <PageWrapper size="A4" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>1. BASIC DETAILS</Text>
                    <View style={[styles.flexRow, styles.gridGap5]}>
                        <Panel title="First Name" value={fname} colStyle={{width: '50%', borderBottom: '4px solid #fafafa', borderRight: '4px solid #fafafa'}}/>
                        <Panel title="Last Name" value={lname} colStyle={{width: '50%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Identification No." value={id_num} colStyle={[styles.col4, {borderRight: '4px solid #fafafa'}]}/>
                        <Panel title="Passport No." value={passport_num} colStyle={[styles.col4, {borderRight: '4px solid #fafafa'}]}/>
                        <Panel title="Date of Birth" value={dob} type="date" colStyle={[styles.col4, {borderRight: '4px solid #fafafa'}]}/>
                        <Panel title="Gender" value={sex} colStyle={[styles.col4]}/>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>2. COMPANY DETAILS</Text>
                    {isConsultant && <View style={[styles.flexRow]}>
                        <Panel title="Company" value={client} renderer={val => val.name || val.data.name} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>}
                    <View style={[styles.flexRow]}>
                        <Panel title="Project" value={project} renderer={val => val.name || val.data.name} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Site" value={site} renderer={val => val.name || val.data.name} colStyle={{width: '100%'}}/>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>3. CONTACT DETAILS</Text>
                    <View style={[styles.flexRow]}>
                        <Panel title="Phone No." value={phone} colStyle={{width: '50%', borderRight: '4px solid #fafafa'}}/>
                        <Panel title="Email Address" value={email} colStyle={{width: '50%'}}/>
                    </View>
                </View>
                <View style={[styles.contentPanel, {textAlign: "left"}]}>
                    <Text style={styles.headingPoint}>4. EMPLOYMENT DETAILS</Text>
                    <View style={[styles.flexRow]}>
                        <Panel title="Date of Employment" value={employment_date} type="date" colStyle={{width: '50%', borderBottom: '4px solid #fafafa', borderRight: '4px solid #fafafa'}}/>
                        <Panel title="Company No. / Employee ID" value={employee_num} colStyle={{width: '50%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Job Position" value={job_position} renderer={val => val.name || val.data.name} colStyle={{width: '50%', borderBottom: '4px solid #fafafa', borderRight: '4px solid #fafafa'}}/>
                        <Panel title="Department" value={department} renderer={val => val.name || val.data.name} colStyle={{width: '50%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Supervisor Name" value={supervisor_name} renderer={v => v.data ? (v.data.fname + ' ' + v.data.lname) : (v.fname + ' ' + v.lname)} colStyle={{width: '100%', borderBottom: '4px solid #fafafa'}}/>
                    </View>
                    <View style={[styles.flexRow]}>
                        <Panel title="Supervisor Phone No." value={supervisor_phone} colStyle={{width: '50%', borderRight: '4px solid #fafafa'}}/>
                        <Panel title="Supervisor Email Address" value={supervisor_email} colStyle={{width: '50%'}}/>
                    </View>
                </View>
            </View>
        </PageWrapper>;
    }
}
// </editor-fold>

export {
    PageFirst, PageLast, Page2
};