//<editor-fold desc="StatsGroup">
import {observer} from "mobx-react";
import React from "react";
import {Chart} from "../../../../../components/FormComponents";
import {Slider} from '../../../../../components/lists';
import {execWhen} from "../../../../../utils/Utils";

@observer
class StatsGroup extends React.Component {

    constructor(props) {
        super(props);


        this.onAfterChange = this.onAfterChange.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        execWhen(() => this.refs.charts_annual).then(charts => {
            charts.update();
        });
    }

    onAfterChange(idx) {
        const {list, state} = this.refs.slider;
        const subList = list[idx];
//        console.log(this, 'subList', subList.slice())
        subList.forEach((item) => {
            const {list} = state;
            const n = list.indexOf(item);
            const chart = this["charts_day_" + n];
            chart && chart.update();
//            console.log('onAfterChange', n, chart)
        });
    }

    renderItem(item, n, onClick) {
        const {title, charts} = item;
        return <div className="content col-lg-6">
            <label className="text-center padding-5 margin-b-0"><b>{title}</b> / Week Day</label>
            <Chart onRef={ref => this["charts_day_" + n] = ref} options={charts}/>
            <div className="chart-hider"/>
        </div>;
    }

    render() {
        const {title, charts: {charts_annual, charts_day}} = this.props;
//        console.log('StatsGroup', charts_annual)
        const id = title.toLowerCase().replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '-');
        return <div className="Statistics StatsGroup bg-white margin-t-10">
            <label className="text-center padding-5 margin-b-0">Statitistics By {title}</label>
            <hr className="margin-0"/>
            <div className="content">
                <label className="text-center padding-5 margin-b-0">{title} Statitistics Per Month</label>
                <Chart ref="charts_annual" options={charts_annual}/>
                <div className="chart-hider"/>
            </div>
            <Slider ref="slider" name={id + "-carousel"} renderer={this.renderItem} list={charts_day} splitBy={2} colSize="col-lg-12 h-500" onAfterChange={this.onAfterChange}/>
        </div>;
    }
}
//</editor-fold>

export default StatsGroup;