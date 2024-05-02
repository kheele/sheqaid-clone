// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {Image, Page, Text, View} from '@react-pdf/renderer';

import {Dates} from 'utils/Utils';

import styles from './ProfilePDFReader.style';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Panel">
@observer
class Panel extends React.Component {
    
    constructor(props) {
        super(props);

        this.createText = this.createText.bind(this);
        this.createImage = this.createImage.bind(this);
    }
    
    createText(value) {
        let {renderer} = this.props;
        return <Text style={{fontFamily: "Roboto", fontSize: 11}}>{value ? (renderer ? renderer(value) : value) : "N/A"}</Text>;
    }
    
    createImage(src) {
        console.log('createImage', src)
        return <Image style={styles.copyPic} src={src}/>;
    }
    
    get isDoc() {
        let {value, type} = this.props;
        if(type === 'file' && value && value.dlUrls && value.dlUrls[0]) {
            value = value.dlUrls[0];
            return value.contains('.pdf') || value.contains('.docx') || value.contains('.doc');
        }
    }
    
    render() {
        let {title, value, colStyle, renderer, type} = this.props;
        
        let node;
        if(!value) {
            node = <Text style={{fontFamily: "Roboto", fontSize: 11}}>N/A</Text>;
        } else {
            if(type === 'date') {
                node = this.createText(Dates.formatDate(value));
            } else if(type === 'file') {
                if(this.isDoc) {
                    node = this.createImage(value.dlUrls[0]);
                } else {
                    let dlUrls;
                    if(value.dlUrls)
                        dlUrls = value.dlUrls[0];
                    node = this.createImage(dlUrls);
                }
            } else {
                node = this.createText(value);
            }
        }
        return <View style={[styles.panel, colStyle]}>
            <Text style={{fontFamily: "Roboto", fontWeight: "bold", fontSize: 11}}>{title}</Text>
            {node}
        </View>;
    }
}
// </editor-fold>

@observer
class Footer extends React.Component {
    render() {
        return <View fixed style={[styles.flexRow, {justifyContent: 'center', placeItems: "center", padding: '7px', borderTop: '1px solid #000', position: 'absolute', left: 0, right: 0, bottom: 0}]}>
            <Text style={[styles.flexRow, {fontSize: 9}]}>
                Create By SHEQ Aid | Powered By SHEQ Solve
            </Text>
        </View>;
    }
}

// <editor-fold defaultstate="collapsed" desc="Page1">
@observer
class Page1 extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    renderPerson(item, n) {
        const {} = item;
        let id, lname, fname, email;
        if(item.employee) {
            id = item.employee.id;
            lname = item.employee.data.lname;
            fname = item.employee.data.fname;
            email = item.employee.data.email;
        } else if(item.other_person) {
            lname = item.other_person.lname;
            fname = item.other_person.fname;
            email = item.other_person.email;
        } else {
            id = item.id;
            lname = item.lname;
            fname = item.fname;
            email = item.email;
        }
        return <Text style={[styles.subHeading, {margin: 0, padding: '5px', borderLeft: '1px solid #000', borderRight: '1px solid #000', borderBottom: '1px solid #000', width: '100%'}]}>
            {lname + ' ' + fname}
        </Text>;
    }
    
    render() {
        const {item} = this.props;
        const {id, data: {
            created_at, company, scope, date, type, representative_list, auditor_list, definition_list, list
        }} = item;
        
        return <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.header}>
                <Text>AUDIT REPORT</Text>
            </View>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {marginTop: 30}]}>
                    <View style={[styles.flexRow, {border: '1px solid #000', marginBottom: 10}]}>
                        <Panel title="Company" value={company} colStyle={[styles.col3, {borderRight: '1px solid #000'}]}/>
                        <Panel title="Scope Of Audit" value={scope} colStyle={[styles.col3, {borderRight: '1px solid #000'}]}/>
                        <Panel title="Audit Type" value={type} colStyle={[styles.col3, {borderRight: '1px solid #000'}]}/>
                        <Panel title="Audit Date" value={date} type="date" colStyle={styles.col3}/>
                    </View>
                </View>
                <View style={[styles.flexRow, {marginTop: 30, width: '100%'}]}>
                    <View style={[styles.contentPanel, {width: '50%', marginRight: 10}]}>
                        <Text style={[styles.subHeading, {padding: '5px', margin: 0, borderTop: '1px solid #000', borderBottom: 0, borderLeft: '1px solid #000', borderRight: '1px solid #000'}]}>COMPANY REPRESENTATIVE(S)</Text>
                        <View style={[styles.flexColumn, {margin: 0, borderTop: '1px solid #000'}]}>
                            {(representative_list || []).map(this.renderPerson)}
                        </View>
                    </View>
                    <View style={[styles.contentPanel, {width: '50%', marginLeft: 10}]}>
                        <Text style={[styles.subHeading, {padding: '5px', margin: 0, borderTop: '1px solid #000', borderBottom: 0, borderLeft: '1px solid #000', borderRight: '1px solid #000'}]}>AUDITOR(S)</Text>
                        <View style={[styles.flexColumn, {margin: 0, borderTop: '1px solid #000'}]}>
                            {(auditor_list || []).map(this.renderPerson)}
                        </View>
                    </View>
                </View>
            </View>
            <Footer />
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Page2">
@observer
class Page2 extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.renderItemGroup = this.renderItemGroup.bind(this);
    }
    
    @computed get listGroup() {
        const {item} = this.props;
        const {id, data: {list}} = item;
    
        const elements = list.groupBy('element');
        const elementsList = Object.keys(elements).map(k => {
            let list = elements[k];
            return {element: k, list};
        });
        return elementsList;
    }
    
    renderItemGroup(item, n) {
        const {element, list} = item;
        return <ItemGroup elementIdx={n} element={element} list={list}/>;
    }
    
    render() {
        const {item} = this.props;
        const {id, data: {
            created_at, company, scope, date, type, representative_list, auditor_list, definition_list, list
        }} = item;
        
        return <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.contentPanel, {background: '#fff', border: 1}]}>
                    <View style={[styles.flexColumn, {marginBottom: 10}]}>
                        <View style={[styles.flexRow, {borderBottom: 2, textAlign: 'left'}]}>
                            <Text style={{width: 337, padding: '5px', borderRight: 1}}>Audit Findings</Text>  
                            <Text style={{width: 140, padding: '5px', borderRight: 1}}>Audit Summary</Text>  
                              
                            <Text style={{width: 100, padding: '5px', borderRight: 1}}>Possible</Text>  
                            <Text style={{width: 100, padding: '5px', borderRight: 1}}>Achieved</Text>  
                            <Text style={{width: 110, padding: '5px', borderRight: 1}}>Compliance</Text>  
                            
                            <Text style={{width: 300, padding: '5px'}}>Comments</Text>            
                        </View>
                        {this.listGroup.map(this.renderItemGroup)}
                    </View>
                </View>
            </View>
            <Footer />
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageStats">
@observer
class PageStats extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        const {item} = this.props;
        const {id, data: {
            created_at, company, scope, date, type, representative_list, auditor_list, definition_list, list
        }} = item;
        
        const calculateScore = function() {
            const possible_score = list.map(({possible_score}) => possible_score).reduce((n1, n2) => n1 + n2, 0);
            const achieved_score = list.map(({achieved_score}) => achieved_score).reduce((n1, n2) => n1 + n2, 0);
            const compliance = (achieved_score / possible_score * 100).toFixed(1);
            return {possible_score, achieved_score, compliance};
        };
        const {possible_score, achieved_score, compliance} = calculateScore();
        
        const _compliance = parseFloat(compliance);                                                   
        let color;
        if(isNumber(_compliance)) {
            if(_compliance < 25) {
                color = 'red';
            } else if(_compliance < 50) {
                color = 'orange';
            } else if(_compliance < 75) {
                color = 'yellow';
            } else if(_compliance >= 75) {
                color = 'green';
            }
        } else {
            color = 'grey';
        }
        
        return <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.content}>
                <View style={[styles.flexRow, {justifyContent: 'center', placeItems: "center", marginTop: 30}]}>
                    <View style={[styles.flexColumn, {margin: 20, width: 150, height: 150, justifyContent: 'center', placeItems: "center", borderRadius: '50%', border: '5px solid ' + color, marginBottom: 10}]}>
                        <Text style={[styles.flexRow, {fontSize: 19}]}>
                            Possible Score
                        </Text>
                        <Text style={[styles.flexRow, {fontSize: 19}]}>
                            {possible_score}
                        </Text>
                    </View>
                    <View style={[styles.flexColumn, {margin: 20, width: 150, height: 150, justifyContent: 'center', placeItems: "center", borderRadius: '50%', border: '5px solid ' + color, marginBottom: 10}]}>
                        <Text style={[styles.flexRow, {fontSize: 19}]}>
                            Achieved Score
                        </Text>
                        <Text style={[styles.flexRow, {fontSize: 19}]}>
                            {achieved_score}
                        </Text>
                    </View>
                    <View style={[styles.flexColumn, {margin: 20, width: 150, height: 150, justifyContent: 'center', placeItems: "center", borderRadius: '50%', border: '5px solid ' + color, marginBottom: 10}]}>
                        <Text style={[styles.flexRow, {fontSize: 19}]}>
                            Compliance
                        </Text>
                        <Text style={[styles.flexRow, {fontSize: 19}]}>
                            {compliance.replace('.0', '')}%
                        </Text>
                    </View>
                </View>
            </View>
            <Footer />
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PageLast">
@observer
class PageLast extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        const {item} = this.props;
        const {id, data: {
            created_at, company, scope, date, type, representative_list, auditor_list, definition_list, list
        }} = item;
        
        return <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={[styles.content, styles.flexColumn, {justifyContent: 'center', placeItems: "center", textAlign: 'center', border: 1, height: '100%'}]}>
                <Text style={[{fontSize: 13, textAlign: 'center', width: '80%', marginHorizontal: '10%'}]}>
                    Disclaimer
                </Text>
                <Text style={[{fontSize: 10, textAlign: 'center', width: '80%', marginHorizontal: '10%'}]}>
                    The contents hereof were developed and reviewed by industry specialists. However, whilst every effort has been made to ensure the material is accurate and complies with relevant industry standards, it is intended as a guide only and may not be suitable for or specific to your particular industry, geographic location and/or business. We do not warrant that the information contained herein shall guarantee compliance if subject to formal assessment by a relevant regulatory body. SHEQ Aid, powered by SHEQ Solve shall not be held responsible for any direct, indirect or consequential loss or damage that may occur as a result of such inaccuracies or shortcomings. We advise customers to seek professional advice before acting on or relying on the contents hereof for such regulatory or other purposes.
                </Text>
            </View>
        </Page>;
    }
}
// </editor-fold>

@observer
class ItemGroup extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.renderItemGroup = this.renderItemGroup.bind(this);
    }

    @computed get listGroup() {
        const {list} = this.props;
        const sub_elements = list.groupBy('sub_element');
        const sub_elementsList = Object.keys(sub_elements).map(k => {
            let list = sub_elements[k];
            return {sub_element: k, list};
        });
        return sub_elementsList;
    }
    
    renderItemGroup(item, n) {
        const {elementIdx, element} = this.props;
        const {list} = item;
        return <View style={[styles.flexColumn]}>
            <ItemSubGroup list={list} element={element} elementIdx={elementIdx} subElementIdx={n}/>
        </View>;
    }
    
    render() {
        const {elementIdx, element} = this.props;
        return <View style={[styles.flexColumn, {width: '100%'}]}>
            <Text style={{padding: '5px', borderBottom: 1, width: '100%', textAlign: 'left', fontFamily: "Roboto", fontWeight: "bold"}}>{elementIdx + 1}. {element}</Text> 
            {this.listGroup.map(this.renderItemGroup)}
        </View>;
    }
}

@observer
class ItemSubGroup extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.renderItemGroup = this.renderItemGroup.bind(this);
    }

    @computed get listGroup() {
        const sub_elements = this.props.list.groupBy('sub_element');
        const sub_elementsList = Object.keys(sub_elements).map(k => {
            let list = sub_elements[k];
            return {sub_element: k, list};
        });
        return sub_elementsList;
    }
    
    renderItemGroup(item, n) {
        const {subElementIdx, elementIdx} = this.props;
        const {sub_element, list} = item;
        return <View style={[styles.flexColumn]}>
            <Text style={{padding: '5px', borderBottom: 1, width: '100%', textAlign: 'left', fontFamily: "Roboto", fontWeight: "bold"}}>{elementIdx + 1}.{subElementIdx + 1}. {sub_element}</Text> 
            <ItemList list={list} elementIdx={elementIdx} subElementIdx={subElementIdx} />
        </View>;
    }
    
    render() {
        return <View style={[styles.flexColumn, {width: '100%'}]}>
            {this.listGroup.map(this.renderItemGroup)}
        </View>;
    }
}

@observer
class ItemList extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.renderItem = this.renderItem.bind(this);
    }

    renderItem(item, n) {
        const {elementIdx, subElementIdx} = this.props;
        let {
            audit_findings, audit_summary,
            possible_score, achieved_score, compliance,
            comments
        } = item;
        return <View style={[styles.flexRow, {borderBottom: 1, width: '100%', textAlign: 'left'}]}>
            <Text style={{width: 337, padding: '5px', borderRight: 1, fontSize: '11px'}}>{elementIdx + 1}.{subElementIdx + 1}.{n + 1} {audit_findings}</Text>  
            <Text style={{width: 140, padding: '5px', borderRight: 1, fontSize: '11px'}}>{audit_summary}</Text>  
                              
            <Text style={{width: 100, padding: '5px', borderRight: 1, fontSize: '11px'}}>{possible_score}</Text>  
            <Text style={{width: 100, padding: '5px', borderRight: 1, fontSize: '11px'}}>{achieved_score}</Text>  
            <Text style={{width: 110, padding: '5px', borderRight: 1, fontSize: '11px'}}>{compliance}%</Text>  
                            
            <Text style={{width: 300, padding: '5px', fontSize: '11px'}}>{comments}</Text>        
        </View>;
    }
    
    render() {
        const {list} = this.props;
        return <View style={[styles.flexColumn, {width: '100%'}]}>
            {list.map(this.renderItem)}
        </View>;
    }
}

export {Page1, PageStats, Page2, PageLast};
//573
