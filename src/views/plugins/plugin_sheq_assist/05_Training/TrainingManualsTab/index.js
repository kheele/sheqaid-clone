// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import style from "./TrainingManualsTab.lazy.css";

import {Button} from 'components/inputs';
import {Slider} from 'components/lists';
import {PDFPreviewer} from 'components/documents';

import NewDialog from './forms/NewDialog';
import ProfileManualDocDialog from './forms/ProfileManualDocDialog';
import ProfileManualVideoDialog from './forms/ProfileManualVideoDialog';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="TrainingManualsTab">
@observer
class TrainingManualsTab extends React.Component {
//training manuals[text, pdf, video]
    pageKey = "TrainingManualsTab";

    // <editor-fold defaultstate="collapsed" desc="state">
    path;

    @observable
    state = {
        dataLoaded: false,
        dataError: false,
        docList: [],
        videoList: []
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);        
        this.path = props.path + "manuals/";
        
        this.onCreate = this.onCreate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.renderItemDoc = this.renderItemDoc.bind(this);
        this.renderItemVideo = this.renderItemVideo.bind(this);
    }
    // </editor-fold>

    componentWillMount() {
        style.use();
    }

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
        workers.emit(this.path + "list").then(res => {
            this.state.docList = res.doc_list;
            this.state.videoList = res.video_list;
            this.state.dataLoaded = true;
            this.state.dataError = false;
            console.log(res)
        }).catch(err => {
            console.error(err);
            this.state.dataLoaded = true;
            this.state.dataError = true;
        });
    }
    // </editor-fold>

    componentWillUnmount() {
        style.unuse();
    }

    // <editor-fold defaultstate="collapsed" desc="onCreate">
    onCreate(e, btn) {
        this.refs.newDialog.open(res => {

        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onClick">
    onClick(e, btn) {
        const {action, type, idx} = btn.props;
        const {profileManualVideoDialog, profileManualDocDialog} = this.refs;
        const {videoList, docList} = this.state;
        if(type === 'Video') {
            profileManualVideoDialog.extraProp('action', action).open(videoList[idx]);
        } else {
            profileManualDocDialog.open(docList[idx]);
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemDoc">
    renderItemDoc(item, n, onClick) {
        let {id, data: {created_at, title, course_or_module, job_position, training_type, type, doc}} = item;
        if(!title) {
            if(isString(course_or_module)) {
                title = course_or_module;
            } else if(course_or_module && course_or_module.id) {
                title = course_or_module.name || course_or_module.data.name;
            }
        }
        return <div>
            <div className={'doc ' + this.props.colSize}>
                <PDFPreviewer url={doc && doc.dlUrls && doc.dlUrls[0]}/>
                <div className="layer"/>
                <h4>{title || 'N/A'}</h4>
                <Button className="btn btn-primary" idx={n} type="Document" onClick={onClick}>View</Button>
            </div>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItemVideo">
    renderItemVideo(item, n, onClick) {
        let {id, data: {created_at, title, course_or_module, job_position, training_type, type, doc}} = item;
        if(!title) {
            if(isString(course_or_module)) {
                title = course_or_module;
            } else if(course_or_module && course_or_module.id) {
                title = course_or_module.name || course_or_module.data.name;
            }
        }
        const style = {backgroundImage: 'url(' + doc.thumbnail.dlUrls[0] + ')'};
        return <div>
            <div className={'video ' + this.props.colSize} style={style}>
                <div className="layer"/>
                <h4>{title || 'N/A'}</h4>
                <Button className="fa fa-play" idx={n} action="play" type="Video" onClick={onClick}/>
                <Button className="btn btn-primary" idx={n} type="Video" onClick={onClick}>View</Button>
            </div>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee || isContractorView;
        const {dataLoaded, dataError, docList, videoList} = this.state;
        
        console.log('this.state', docList.length, videoList.length)
        return <div className="TrainingManuals">
            <h4>
                Training Manuals {!isReadonly && <Button className="btn btn-primary pull-right" onClick={this.onCreate}>
                    <i className="fa fa-plus icon-left"/>Create
                </Button>}
                {this.props.onRenderCompetenciesBtb()}
            </h4>
            {!dataLoaded && <div className="results-loading">
                <CircularProgress/>
                Loading training manuals...
            </div>}
            {(dataLoaded && dataError) && <div className="results-none">
                An error occurred while loading
            </div>}
            {(dataLoaded && !dataError) && <React.Fragment>
                <div>
                    <Slider name="training-carousel-docs" renderer={this.renderItemDoc} list={this.state.docList} splitBy={6} hasViewBtn={true} title="Documents" colSize="col-lg-2" onClick={this.onClick}/>
                </div>
                <div>
                    <Slider name="training-carousel-videos" renderer={this.renderItemVideo} list={this.state.videoList} splitBy={6} hasViewBtn={true} title="Videos" colSize="col-lg-2" onClick={this.onClick}/>
                </div>
            </React.Fragment>}
            
            <NewDialog ref="newDialog" path={this.path}/>
            <ProfileManualDocDialog ref="profileManualDocDialog"/>
            <ProfileManualVideoDialog ref="profileManualVideoDialog"/>
        </div>;
    }
    // </editor-fold>
}
// </editor-fold>

export default TrainingManualsTab;
