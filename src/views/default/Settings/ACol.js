import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import Accordion from '@material-ui/core/Accordion';
import CircularProgress from '@material-ui/core/CircularProgress';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Button} from "components/inputs";

const LoadingStatus = {
    LOADING: 0,
    LOADED: 0,
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
                <Details
                    state={this.state}
                    sockets={this.sockets}
                    setList={this.setList}
                    renderAccordionSummary={this.renderAccordionSummary}
                    renderAccordionDetails={this.renderAccordionDetails}
                    onAdd={this.onAdd}
                    onRemove={this.onRemove}
                />
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
        const {sockets, setList} = this.props;

        const listAll = sockets.fn('listAll');
        listAll({
            exact_orgs: false,
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
        if (loadingStatus === LoadingStatus.LOADING) return <CircularProgress/>;
        if (loadingStatus === LoadingStatus.ERROR) return <></>;

        return <div>
            {this.list.map(this.renderItem)}
        </div>;
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
            <AccordionDetails>
                {renderAccordionDetails(item, idx)}
            </AccordionDetails>
            <AccordionActions>
                <Button idx={idx} onClick={onRemove}>Remove</Button>
                <Button idx={idx} onClick={onAdd}>Add</Button>
            </AccordionActions>
        </Accordion>;
    }
}

export default ACol;
