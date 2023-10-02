import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import style from "./Slider.lazy.css";
import {execWhen} from "../../utils/Utils";

@observer
class Slider extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        name: PropTypes.string.isRequired,
        id: PropTypes.string,
        renderer: PropTypes.func,
        disableNavs: PropTypes.bool,
        index: PropTypes.number,
        splitBy: PropTypes.number.isRequired,
        colSize: PropTypes.string.isRequired,
//		list: PropTypes.array.isRequired
    };

    @observable state = {
        list: [],
        splitBy: 3
    };

    constructor(props) {
        super(props);

        const {list, splitBy} = this.props;
        this.state.list = list;
        this.state.splitBy = splitBy;

        this.move = this.move.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
    }

    componentWillMount() {
        style.use({id: 'Slider-style'});
    }

    componentWillUnmount() {
        style.unuse();
    }

    @computed get index() {
        return this.refs.inner.index;
    }

    @computed get list() {
        const {list, splitBy} = this.state;
        return !!splitBy ? list.splitAt(splitBy) : list;
    }

    move(n) {
        this.refs.inner.move(n);
    }

    next() {
        this.refs.inner.next();
    }

    prev() {
        this.refs.inner.prev();
    }

    render() {
        const {
            id,
            title,
            name,
            index,
            dataInterval,
            hasViewBtn,
            renderer,
            colSize,
            disableNavs,
            onClick,
            onBeforeChange,
            onAfterChange
        } = this.props;
        const props = {};
        if (!!id) {
            props.id = id;
        }
        return (<div {...props} className="row Slider">
            {!!title && <h1>{title}</h1>}
            <CarouselInner ref="inner" state={this.state} list={this.list} dataInterval={dataInterval} name={name}
                           index={index} hasViewBtn={hasViewBtn} disableNavs={disableNavs} renderer={renderer}
                           getSplitBy={this.getSplitBy} colSize={colSize} onClick={onClick}
                           onBeforeChange={onBeforeChange} onAfterChange={onAfterChange}/>
            {!disableNavs && <>
                <a className="left carousel-control" href={"#" + name} role="button" data-slide="prev">
                    <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="right carousel-control" href={"#" + name} role="button" data-slide="next">
                    <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </>}
        </div>);
    }
}

@observer
class CarouselInner extends React.Component {

    @observable state = {
        index: 0
    };

    root;

    constructor(props) {
        super(props);

        const {index} = this.props;
        if (!!index) {
            this.state.index = index;
        }

        this.onBeforeChange = this.onBeforeChange.bind(this);
        this.onAfterChange = this.onAfterChange.bind(this);
        this.move = this.move.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);

        this.onClick = this.onClick.bind(this);
        this.renderIndicator = this.renderIndicator.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        setTimeout(async () => {
            if (this.unmounted) return;

            const node = await execWhen(() => {
                try {
                    return ReactDOM.findDOMNode(this);
                } catch (e) {
                }
            });
            this.node = window.$(node);
            this.node.on('slide.bs.carousel', this.onBeforeChange);
            this.node.on('slid.bs.carousel', this.onAfterChange);
            //e = {
            //direction: 'left | right',
            //relatedTarget: The DOM element that is being slid into place as the active item,
            //from: The index of the current item,
            //to: The index of the next item
            //}
        });
    }

    componentWillUnmount() {
        this.unmounted = true;
        if (this.node) {
            this.node.off('slide.bs.carousel');
            this.node.off('slid.bs.carousel');
        }
    }

    @computed get index() {
        return this.state.index;
    }

    onBeforeChange(e) {
        const {onBeforeChange} = this.props;
//		console.log('onBeforeChange', this.state.index)
        onBeforeChange && onBeforeChange(this.state.index);
    }

    onAfterChange(e) {
        const {onAfterChange} = this.props;
        this.state.index = this.node.find('.active').index();
		console.log('onAfterChange', e, this.state.index)
        onAfterChange && onAfterChange(this.state.index);
    }

    move(n) {
        this.node.carousel(n);
    }

    next() {
        this.node.carousel('next');
    }

    prev() {
        this.node.carousel('prev');
    }

    onClick(e, btn) {
        this.props.onClick(e, btn);
    }

    renderIndicator(val, n) {
        const {name} = this.props;
        let props = {};
        if (n === this.state.index) {
            props.className = "active";
        }
        //return <li data-target={"#" + name} data-slide-to={n} {...props}></li>;
        return <li key={n} data-target={"#" + name} data-slide-to={n} {...props}></li>;
    }

    renderItem(val, n0) {
        const {list} = this.props.state;
        //if (n0 !== activeIndex) return undefined;
        let className = "item";
        if (n0 === this.state.index) {
            className += " active";
        }
        //console.log(val)

        const idx = n0;
        return (<div key={n0} className={className}>
            <div className="row" data-idx0={n0}>
                {val.map ? val.map((item) => {
                        //console.log(item)
                        return this.props.renderer(item, list.indexOf(item), this.onClick);
                    }) :
                    this.props.renderer(val, idx, this.onClick)}
            </div>
        </div>);
    }

    render() {
        const {disableNavs, name, dataInterval, list} = this.props;
        const props = {
            id: name,
            className: "carousel slide",
            // dataRide: "carousel",
            "data-interval": dataInterval || "false",
            interval: "false",
        };
        return (<div {...props}>
            {!disableNavs && <ol className="carousel-indicators">{list.map(this.renderIndicator)}</ol>}
            {!list.isEmpty() && <div className="carousel-inner" role="listbox">{list.map(this.renderItem)}</div>}
            {list.isEmpty() && <div className="carousel-inner-no-results"><p>Not Available</p></div>}
        </div>);
    }
}

export default Slider;