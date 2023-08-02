
// <editor-fold defaultstate="collapsed" desc="Stat">
import {observer} from "mobx-react";
import React from "react";
import {getRandomRolor} from "../utils/UtilsFuns";

@observer
class AggregateStat extends React.Component {

    render() {
        let {props: {title, value, className = ''}} = this;
        className += ' grid-1 flex-center flex-justify-items-center font-size-13 padding-h-5 padding-v-10'
        const style = {background: getRandomRolor()};
        const styleB = {color: style.background};
        return <div style={style} className={className}>
            <span className="color-white -margin-t-5">{title}</span>
            <b style={styleB} className="circled flex flex-justify-center flex-align-center bg-white margin-t-5 -margin-b-5 min-w-25 h-25">{value.aggregate.count}</b>
        </div>;
    }
}

// </editor-fold>

export default AggregateStat;