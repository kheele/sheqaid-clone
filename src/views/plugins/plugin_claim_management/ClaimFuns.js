import React from "react";
import {isObservableArray} from "mobx";

const renderSpan = (v, title, counter) => {
    const getVal = (v, counter) => {
        if(!v) return {color: 'red'};
        if((isArray(v) || isObservableArray(v)) && v.isEmpty()) return {color: 'red'};
        if(isObject(v) && Object.keys(v).isEmpty()) return {color: 'red'};
        if(isObject(v) && (v.dlUrls || v.wcl_2_external_doc || v.wcl_4_external_doc || v.wcl_6_external_doc)) return {color: 'green'};
        
        if(!counter) {
            return {color: 'green'};
        }
        const {count, max} = counter;
        const perc = parseInt(parseFloat((count / max) * 100).toFixed(0));
        if(count === max) {
            return {color: 'green', perc};
        }
        if(count > 0 && count < max) {
            return {color: 'orange', perc};
        }
        if(count === 0) {
            return {color: 'red', perc};
        }
        return {color: 'red', perc};
    };
    const {color, perc} = getVal(v, counter);
    console.log('renderSpan', title, color, perc, isNumber(perc))
    return <span className={`bg-${color} color_white font-size-11 pos-relative wcl-status-span`}>
        {title}
        {((isNumber(perc) && !Number.isNaN(perc)) || color === 'green') && <b>{color === 'green' ? 100 : perc}%</b>}
        {(!isNumber(perc) || Number.isNaN(perc)) && color !== 'green' && <b>0%</b>}
    </span>;
};

const getDocsStatus = item => {
    const {data: {wcl_2 = {}}} = item;
    const {doc_certified_id, doc_salary_slip} = wcl_2 || {};

    return [
        renderSpan(doc_certified_id, 'Certified ID/Passport'),
        renderSpan(doc_salary_slip, 'Salary Slip')
    ];
};

const getWClStatus = item => {
    const {data: {
            wcl_2, wcl_4, wcl_5_list, wcl_6, annexture_1,
            wcl_2_field_count, wcl_2_field_max,
            wcl_4_field_count, wcl_4_field_max,
            wcl_6_field_count, wcl_6_field_max,
            annexture_1_field_count, annexture_1_field_max
        }
    } = item;

    return [
        renderSpan(wcl_2, 'W.Cl.2', {count: wcl_2_field_count, max: wcl_2_field_max}),
        renderSpan(wcl_4, 'W.Cl.4', {count: wcl_4_field_count, max: wcl_4_field_max}),
        renderSpan(wcl_5_list, 'W.Cl.5'),
        renderSpan(wcl_6, 'W.Cl.6', {count: wcl_6_field_count, max: wcl_6_field_max})
    ];
};

export {getDocsStatus, getWClStatus};
//
