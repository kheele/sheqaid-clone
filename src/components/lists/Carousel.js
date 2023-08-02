import React, {createRef} from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import CarouselImpl from "react-material-ui-carousel";

import style from "./Carousel.lazy.css";
import MKBox from "../MK/MKBox";

@observer
class Carousel extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        id: PropTypes.string,
        renderer: PropTypes.func,
        disableNavs: PropTypes.bool,
        index: PropTypes.number,
        splitBy: PropTypes.number.isRequired,
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
        style.use({id: 'Carousel-style'});
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
            index,
            hasViewBtn,
            renderer,
            disableNavs,
            onClick,
            onChange
        } = this.props;
        const props = {};
        if (!!id) {
            props.id = id;
        }
        return (<div {...props} className="row Carousel">
            {/*{!!title && <h1>{title}</h1>}*/}
            <CarouselInner
                ref="inner"
                state={this.state}
                list={this.list}
                index={index}
                hasViewBtn={hasViewBtn}
                disableNavs={disableNavs}
                renderer={renderer}
                getSplitBy={this.getSplitBy}
                onClick={onClick}
                onChange={onChange}
            />
        </div>);
    }
}

@observer
class CarouselInner extends React.Component {

    @observable state = {
        index: 0
    };

    constructor(props) {
        super(props);

        this.carousel = createRef(null);

        const {index} = this.props;
        if (!!index) {
            this.state.index = index;
        }

        this.onChange = this.onChange.bind(this);

        this.move = this.move.bind(this);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);

        this.onClick = this.onClick.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    @computed get index() {
        const {index} = this.state;
        if(index < 0) return 0;
        return index;
    }

    onChange(active, prev) {
        const {onChange} = this.props;
        console.log(`active`, active, `prev`, prev);
        this.state.index = active;
        onChange && onChange(this.state.index);
    }

    move(n) {
        // this.carousel.current.carousel(n);
        this.state.index = n;
    }

    next() {
        // this.carousel.current.carousel('next');
        this.state.index++;
    }

    prev() {
        this.state.index--;
    }

    onClick(e, btn) {
        this.props.onClick(e, btn);
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
        const {disableNavs, list} = this.props;

        return (<MKBox className="carousel">
            {!list.isEmpty() && <CarouselImpl
                ref={this.carousel}
                autoPlay={false}
                swipe={true}
                navButtonsAlwaysVisible={!disableNavs}
                cycleNavigation={true}
                animation="slide"
                index={this.state.index}
                sx={{background: "red", mt: "50px", overflow: "visible"}}
                activeIndicatorIconButtonProps={{
                    style: {
                        backgroundColor: 'rgba(2,168,168, 1)',
                        width: '30px',
                        height: '30px',
                    }
                }}
                indicatorIconButtonProps={{
                    style: {
                        backgroundColor: '#aaa',
                        width: '20px',
                        height: '20px',
                        margin: "0 5px",
                    }
                }}
                indicatorContainerProps={{
                    style: {
                        top: '0px',
                        position: 'absolute',
                    }
                }}
                onChange={this.onChange}
                // next={ (next, active) => {console.log(`we left ${active}, and are now at ${next}`);} }
                // prev={ (prev, active) => {console.log(`we left ${active}, and are now at ${prev}`);} }
            >
                {list.map(this.renderItem)}
            </CarouselImpl>}

            {list.isEmpty() && <div className="carousel-inner-no-results"><p>Not Available</p></div>}
        </MKBox>);
    }
}

export default Carousel;