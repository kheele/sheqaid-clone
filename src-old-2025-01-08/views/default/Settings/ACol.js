import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import Accordion from '@material-ui/core/Accordion';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {execWhen} from "utils/UtilsFuns";

const LoadingStatus = {
    LOADING: -1,
    LOADED: 1,
    ERROR: 0,
};

@observer
class ACol extends React.Component {

    @observable state = {
        selectedIdx: -1,
        list: [],
    };

    constructor(props) {
        super(props);

        this.setList = this.setList.bind(this);
        this.renderAccordionSummary = this.renderAccordionSummary.bind(this);
        this.renderAccordionDetails = this.renderAccordionDetails.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onRemove = this.onRemove.bind(this);
    }

    @computed get list() {
        return this.state.list;
    }

    update() {
        execWhen(() => this.refs.details).then(ref => ref.update());
    }

    setList(list) {
        this.state.list = list;
    }

    render() {
        return <Accordion expanded>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                {this.title}
            </AccordionSummary>
            <AccordionDetails>
                <div>
                    <Details
                        ref="details"
                        state={this.state}
                        sockets={this.sockets}
                        setList={this.setList}
                        getArgs={this.getArgs}
                        renderAccordionSummary={this.renderAccordionSummary}
                        renderAccordionDetails={this.renderAccordionDetails}
                        onAdd={this.onAdd}
                        onRemove={this.onRemove}
                    />
                </div>
            </AccordionDetails>
        </Accordion>;
    }
}

@observer
class Details extends React.Component {

    @observable state = {
        selectedIdx: -1,
        loadingStatus: LoadingStatus.LOADING,
    };

    constructor(props) {
        super(props);

        this.update = this.update.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    @computed get loadingStatus() {
        return this.state.loadingStatus;
    }

    set loadingStatus(status) {
        this.state.loadingStatus = status;
    }

    @computed get list() {
        return this.props.state.list;
    }

    componentDidMount() {
        this.update();
    }

    update() {
        const {sockets, setList, getArgs} = this.props;

        this.loadingStatus = LoadingStatus.LOADING;

        const listAll = sockets.fn('listAll');
        listAll({
            limit: 0,
            ...(getArgs ? getArgs() : {}),
        }).then(res => {
            setList(res);
            this.loadingStatus = LoadingStatus.LOADED;
        }).catch(err => {
            console.log(err);
            this.loadingStatus = LoadingStatus.ERROR;
        });
    }

    renderItem(item, idx) {
        const {state, renderAccordionSummary, renderAccordionDetails, onAdd, onRemove} = this.props;
        return <Item
            state={state}
            item={item}
            idx={idx}
            renderAccordionSummary={renderAccordionSummary}
            renderAccordionDetails={renderAccordionDetails}
            onAdd={onAdd}
            onRemove={onRemove}
        />;
    }

    render() {
        const {loadingStatus} = this;
        if (loadingStatus === LoadingStatus.LOADING) return <CircularProgress className="fixed-center"/>;
        if (loadingStatus === LoadingStatus.ERROR) return <p className="fixed-center">
            Sorry! Couldn't load results. Please check internet connection or reload the page.
        </p>;
        if (this.list.isEmpty()) return <p className="fixed-center">
            No results available.
        </p>;

        return <>
            {this.list.map(this.renderItem)}
        </>;
    }
}

@observer
class Item extends React.Component {
    constructor(props) {
        super(props);

        this.handleExpand = this.handleExpand.bind(this);
    }

    handleExpand() {
        const {item, idx, state, handleExpand} = this.props;
        if (state.selectedIdx === idx) {
            state.selectedIdx = -1;
        } else {
            state.selectedIdx = idx;
        }
    }

    render() {
        const {
            item,
            idx,
            state: {selectedIdx},
            renderAccordionSummary,
            renderAccordionDetails,
            onAdd,
            onRemove
        } = this.props;
        return <Accordion onChange={this.handleExpand} expanded={idx === selectedIdx}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                {renderAccordionSummary(item, idx)}
            </AccordionSummary>
            <AccordionDetails className="pos-relative min-h-140">
                {idx === selectedIdx && renderAccordionDetails(item, idx)}
            </AccordionDetails>
            {/*<AccordionActions>*/}
            {/*    <Button idx={idx} onClick={onRemove}>Remove</Button>*/}
            {/*    <Button idx={idx} onClick={onAdd}>Add</Button>*/}
            {/*</AccordionActions>*/}
        </Accordion>;
    }
}

export default ACol;
export {LoadingStatus};
