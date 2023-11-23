import React from "react";
import {isObservableArray} from "mobx";

const renderSpan = (v, title) => {
	console.log(title, v);
	const getVal = (v,) => {
		if (!v) return {color: 'red'};
		if (isObject(v) && Object.keys(v).isEmpty()) return {color: 'red'};
		if (isObject(v)) {
			if (v.external_doc) {
				return {color: 'green'};
			}
		}
		
		const {totalFieldCount: count, totalFieldMax: max} = v;
		if(max === 0 && count === 0) return {color: 'red'};
		
		const perc = parseInt(parseFloat((count / max) * 100).toFixed(0));
		if (count === max) {
			return {color: 'green', perc};
		}
		if (count > 0 && count < max) {
			return {color: 'orange', perc};
		}
		if (count === 0) {
			return {color: 'red', perc};
		}
		return {color: 'red', perc};
	};
	const {color, perc} = getVal(v,);
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
	const {
		data: {
			wcl_2, wcl_4, wcl_5_list, wcl_6, annexture_1,
		}
	} = item;
	const wcl_5_count = (wcl_5_list || []).map(({wcl_5}) => {
		if(wcl_5.external_doc) return 1;
		return wcl_5.totalFieldCount;
	}).reduce((acc, n) => acc + n, 0);
	const wcl_5_max = (wcl_5_list || []).map(({wcl_5}) => {
		if(wcl_5.external_doc) return 1;
		return wcl_5.totalFieldMax;
	}).reduce((acc, n) => acc + n, 0);
	const wcl_5_stats = {totalFieldCount: wcl_5_count, totalFieldMax: wcl_5_max};
	return [
		renderSpan(wcl_2, 'W.Cl.2',),
		renderSpan(wcl_4, 'W.Cl.4',),
		renderSpan(wcl_5_stats, 'W.Cl.5'),
		renderSpan(wcl_6, 'W.Cl.6',)
	];
};

export {getDocsStatus, getWClStatus};
//
