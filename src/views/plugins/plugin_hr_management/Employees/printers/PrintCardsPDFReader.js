// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {findDOMNode} from "react-dom";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {Document, Image, Page, Path, PDFViewer, Svg, Text, View} from '@react-pdf/renderer';
import {CircularProgress} from '@material-ui/core';

import {calculateRightPos, creatQRCodeLink, Dates, execWhen} from 'utils/Utils';
import {Button, Clickable} from 'components/inputs';
import NavItem from 'components/navs/NavItem';

import {AProfileDialog} from 'components/dialogs';

import styles from "./PrintCardsPDFReader.style.js";

import style from "./ProfilePDFReader.lazy.css";
// </editor-fold>

const stylesMerge = (...styles) => {
    return styles;
};

// <editor-fold defaultstate="collapsed" desc="Panel">
@observer
class Panel extends React.Component {
    
    constructor(props) {
        super(props, style);

        this.createText = this.createText.bind(this);
        this.createImage = this.createImage.bind(this);
    }
    
    createText(value) {
        let {renderer} = this.props;
        return <Text style={{fontFamily: "Roboto", fontSize: 10}}>{value ? (renderer ? renderer(value) : value) : "N/A"}</Text>;
    }
    
    createImage(src) {
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
            node = <Text style={{fontFamily: "Roboto", fontSize: 10}}>N/A</Text>;
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
        return <View style={stylesMerge(styles.panel, colStyle)}>
            <Text style={{fontFamily: "Roboto", fontWeight: "bold", fontSize: 10}}>{title}</Text>
            {node}
        </View>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Pages">
@observer
class Pages extends React.Component {
    
    constructor() {
        super();
                
        this.renderItemGroupPage = this.renderItemGroupPage.bind(this);
        this.renderItemGroup = this.renderItemGroup.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    
    renderItemGroupPage(groupPage, n) {
        const size = groupPage.length;
        return <View style={stylesMerge(styles.cardPanelGroupPage, {borderBottom: (size === 2 || size === 3) ? '0px solid #fff' : '1px dashed #eee'})}>
            {groupPage.splitAt(1).map(this.renderItemGroup)}
        </View>;
    }
    
    renderItemGroup(group, n) {
        return <View style={stylesMerge(styles.cardPanelGroup, {borderTopWidth: n === 0 ? 0 : 1})}>
            {group.map(this.renderItem)}
        </View>;
    }
    
    renderItem(item, n) {
        const {id, data} = item;
        return <Card key={id} idx={n} id={id} data={data} state={this.props.state}/>;
    }
    
    render() {
        const {item: list} = this.props;
        
        const groupedList = list.splitAt(3);
        
        return <Page size="A4" style={styles.page}>
            <View style={styles.content}>
                {groupedList.map(this.renderItemGroupPage)}
            </View>
        </Page>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ProfilePic">
@observer
class ProfilePic extends React.Component {
    
    render() {
        const {profilePic, style} = this.props;
        if(profilePic && profilePic.dlUrls && profilePic.dlUrls[0]) {
            return <Image style={[styles.profilePic, style || {}]} src={profilePic.dlUrls[0]}/>;
        } else {
            const width = style && style.width || 64;
            const height = style && style.height || 64;
            return <Svg style={[styles.profilePic, {width, height}]} viewBox="0 0 448 512" width={width} height={height}>
                <Path fill="#ddd" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
            </Svg>;
        }
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Card">
@observer
class Card extends React.Component {
    //w2480 x h3508 = 620 x 877
    //attribution: <a href='https://www.freepik.com/vectors/business'>Business vector created by freepik - www.freepik.com</a>
    
    get contacts_emergency() {
        const {emergencyContactsExternal} = storage.list;
        const ambulance  = emergencyContactsExternal.find(v => v.data.org_name.toLowerCase() === 'ambulance') || 'N/A';
        const hospital  = emergencyContactsExternal.find(v => v.data.org_name.toLowerCase() === 'hospital') || 'N/A';
        const contacts = v => isString(v) ? v : v.data.contacts;        
        return [
            ['Emergency', 'Contact No.'],
            ['Ambulance', contacts(ambulance)],
            ['Hospital', contacts(hospital)]
        ];
    }
    
    get contacts_office() {
        const {idx, id, data: {
            client, project, site, client_id, project_id, site_id,
            optional_info = {}, 
        }} = this.props;
        const {supervisor_phone} = optional_info;
        return [
            ['Office No.', 'Contact No.'],
            ['Supervisor', supervisor_phone || 'N/A'],
            ['Office No.', (client && client.data && client.data.phone) || 'N/A']
        ];
    }
    
    get competencies() {
        let {idx, id, data: {
            training_certificate_list = [],
            documents = {}
        }} = this.props;
        training_certificate_list = training_certificate_list.filter(({data: {training}}) => {
            return (training.type || training.data.type) === "Induction";
        });
        training_certificate_list.sortBy('data.issued_date', 'desc');
        const first = training_certificate_list[0];
        let expiryDate;
        if(first) {
            const issued_date = first.data.issued_date.toDate().addYears(1);
            expiryDate = Dates.formatDate(issued_date);
        } else {
            expiryDate = "N/A";
        }
        const {doc_driver_or_operator_licence_expiry} = documents;
        return [
            ['Description', 'Expiry Date'],
            ['Induction Training', expiryDate],
            ['Driver License', Dates.formatDate(doc_driver_or_operator_licence_expiry) || 'N/A']
        ];
    }
    
    render() {
        const {idx, id, data: {
            created_at, 
            profilePic, 
            fname, lname, id_num, passport_num, dob, sex,
            phone, email,
            client, project, site, client_id, project_id, site_id,
            optional_info = {}, 
        }} = this.props;
    
        const {employee_num, department, job_position} = optional_info;
        let {frontBackground, backBackground} = this.props.state;
        frontBackground = frontBackground || "img/card-front.png";
        backBackground = backBackground || "img/card-back.png";
        
        return <React.Fragment>
            <View style={stylesMerge(styles.cardPanel, {borderRightWidth: 1})}>
                <Image src={frontBackground} style={styles.cardPanelBackgroundImg} />
                <View style={stylesMerge(styles.flexColumn)}>
                    <View style={[styles.profilePicCover, {top: 20}]}>
                        <ProfilePic profilePic={client && client.data && client.data.profile_pic} style={{width: 25, height: 25}}/>
                    </View>
                    <Text style={styles.companyName}>{(client && client.data && client.data.name) || 'N/A'}</Text>
                    <View style={styles.profilePicCover}>
                        <ProfilePic profilePic={profilePic}/>
                    </View>
                    <Text style={styles.employeeName}>{lname} {fname}</Text>
                    <Text style={styles.employeePos}>{job_position ? (job_position.name || job_position.data.name) : ''}</Text>
                    <View style={styles.detailsPanel}>
                        <View style={styles.detailsPanelLeft}>
                            <Text>ID/Passport No    :</Text>
                            <Text>Email    :</Text>
                            <Text>Phone    :</Text>
                            <Text>Company No.    :</Text>
                        </View>
                        <View style={styles.detailsPanelRight}>
                            <Text>{id_num || passport_num}</Text>
                            <Text>{email || 'N/A'}</Text>
                            <Text>{phone || 'N/A'}</Text>
                            <Text>{employee_num || 'N/A'}</Text>
                        </View>
                    </View>
                    <Text style={styles.linksPanel}>sheqsolve.com / support@sheqsolve.com / 083 306 3963</Text>
                </View>
            </View>
            <View style={stylesMerge(styles.cardPanel, {borderRightWidth: idx === 0 ? 1 : 0})}>
                <Image src={backBackground} style={styles.cardPanelBackgroundImg} />
                <View style={styles.backDetailsPanel}>
                    <Text style={[styles.backDetailsTitle, {marginBottom: 5}]}>CONTACTS</Text>
                    
                    <Text style={styles.backDetailsTitle}>Emergency</Text>
                    <Table th col={['40%', '60%']} list={this.contacts_emergency}/>
                    <Text style={[styles.backDetailsTitle, {marginTop: -4}]}>Office</Text>
                    <Table th col={['40%', '60%']} list={this.contacts_office}/>
                    
                    <Text style={styles.backDetailsTitle}>COMPETENCY NO.</Text>
                    <Table th col={['40%', '60%']} list={this.competencies}/>
                </View>
                <QRCodeImage id={id}/>
            </View>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Table">
@observer
class Table extends React.Component{
    render() {
        const {list, th, col} = this.props;
        return <View style={styles.backDetailsTable}>
            {list.map((row, ind) =>
                <View key={ind} style={[styles.backDetailsTableRow, th && ind === 0 ? styles.backDetailsTableEm: {}]}>
                    {row.map((cell, j) =>
                        <View key={j} style={[styles.backDetailsTableCell, {width: col[j]}]}>
                            <Text>{cell}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="QRCodeImage">
@observer
class QRCodeImage extends React.Component {
    @observable state = {
        src: null
    };
    
    componentDidMount() {
        creatQRCodeLink('employee', this.props.id).then(src => {
            this.state.src = src;
        });
    }
    
    render() {
        const {src} = this.state;
        if(!src) return null;
        return <View style={styles.qrCodeImgCover}>
            <Image src={src} style={styles.qrCodeImg} />
        </View>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFReader">
@observer
class PDFReader extends AProfileDialog {
    pageKey = "ProfilePDFReader";
    
    constructor(props) {
        super(props, style);

        this.onChangeBackground = this.onChangeBackground.bind(this);
        this.onDownload = this.onDownload.bind(this);
    }

    title() {
        return "Print Employee(s) Card(s)";
    }
    
    onChangeBackground(e, btn) {
        this.refs.controls.onChangeBackground(e, btn);
    }

    onDownload(e, btn) {
        this.refs.controls.onDownload(e, btn);
    }

    @computed get topButtons() {
        const download = ("EmployeeCards_" + Dates.formatDateTime(new Date())).replaceAll(" ", "_") + ".pdf";
        return <React.Fragment>
            <Button className="btn btn-primary margin-r-10" onClick={this.onChangeBackground}>
                <i className="fa fa-images icon-left"/> Change Background
            </Button>
            <Clickable onClick={this.onDownload}>
                <a className="btn btn-primary" download={download} type="application/pdf">
                    <i className="fa fa-download icon-left"/> Download
                </a>
            </Clickable>
        </React.Fragment>;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PDFViewerWrapper">
@observer
class PDFViewerWrapper extends React.Component {

    constructor(props) {
        super(props);
        this.onLoadSuccess = this.onLoadSuccess.bind(this);
        this.onLoadError = this.onLoadError.bind(this);
    }
    
    componentDidMount() {
        execWhen(() => {
            try {
                return findDOMNode(this);
            } catch(e) {
                return false;
            }
        }).then(webview => {
            webview.addEventListener('did-stop-loading', this.onLoadSuccess);
            webview.onload = this.onLoadSuccess;
            this.webview = webview;
        });
    }
    
    onLoadSuccess() {
        const {webview, props: {onLoad}} = this;
        webview.removeEventListener('did-stop-loading', this.onLoadSuccess);
        onLoad(webview);
    }
    
    onLoadError() {
//        if(this.refs.iframe){
//            this.refs.iframe.src = this.src;
//        }
    }
    
    getItem() {
        return this.item || this.props.item;
    }
    
    render() {
        const doc = <Document>
            <Pages state={this.props.state} item={this.getItem()}/>
        </Document>;
        if(this.item) {
//            alert(doc)
            return doc;
        } else {
            const style = {width: "100%", height: "100%"};
            return <PDFViewer style={style}>{doc}</PDFViewer>;
        }
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Loading">
@observer
class Loading extends React.Component {
    render() {
        const {webview} = this.props.state;
        if(!!webview) return null;
        return <div className="results-loading">
            <CircularProgress/>
            Loading...
        </div>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Controls">
@observer
class Controls extends React.Component {
    
    @observable state = {
        webview: null,
        frontBackground: null,
        backBackground: null,
        //state
    };
    
    constructor(props) {
        super(props);
        
        this.onChangeBackgroundImpl = this.onChangeBackgroundImpl.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }
    
    onChangeBackgroundImpl(e, elem) {
        electronDialog.showOpenDialogImage().then(res => {
            console.log(res);
            if(res) {
                const {previewPath, path} = res;
                this.state[elem.props.pos] = previewPath;
//                this.state.path = path;
            }
        });
    }

    onChangeBackground(e, btn) {
        const elem = $(btn.getDOMNode());
        const offset = elem.offset();
        const style = {left: "auto", right: calculateRightPos(elem[0]), top: offset.top + elem.height() + 23, width: 210};
        popover.settings({
            style, 
            isDialog: false,
            contentNode: <div>
                <NavItem pos="frontBackground" onClick={this.onChangeBackgroundImpl} title="Change Front Background"/>
                <NavItem pos="backBackground" onClick={this.onChangeBackgroundImpl} title="Change Back Background"/>
            </div>
        }).open();
    }
    
    onDownload(e, btn) {
        const jqEl = $(e.target);
        let {webview: {src}} = this.state;
        src = decodeURIComponent(src.substring(src.indexOf('file=blob') + 5, src.length));
        jqEl.attr('href', src).click();
    }
    
    onLoad(webview) {
        this.state.webview = webview;
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        
        const {state} = this;
        return (<div className="controls-wrapper h-full">
            <div className="controls padding-0 h-full">
                <div className="row padding-0 h-full">
                    <div className="row sec-group w-full h-full">
                        <Loading state={state}/>
                        <PDFViewerWrapper item={this.item} state={this.state} onLoad={this.onLoad}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}
// </editor-fold>

export default PDFReader;