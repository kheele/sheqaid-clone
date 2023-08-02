// <editor-fold defaultstate="collapsed" desc="imports">
import {execWhen} from "utils/Utils";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="changeColors">
const changeColors = (dialog, risk_level) => {
    const val = {
        Low: {bg: 'green', color: 'white'},
        Medium: {bg: 'yellow', color: '#888', backBtn: '#777'},
        High: {bg: 'orange', color: 'white'},
        'Very High': {bg: 'red', color: 'white'}
    }[risk_level];
    try {
        const node = dialog.getDOMNode();
        if (node) {
            const jqEl = $(node.querySelector('.dialog-header'));
            const backBtn = jqEl.find('.page-back-btn');
            if (val) {
                jqEl.css({background: val.bg}).find('h3').css({color: val.color});
                backBtn.css({color: val.backBtn || val.color});
            } else {
                jqEl.css({background: '#f5f5f5'}).find('h3').css({color: '#888'});
                backBtn.css({color: '#777'});
            }
        }
    } catch (e) {

    }
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onChangeProduct">
const onChangeProduct = function (el, val) {
    this.state.selectedProduct = val;
    if (val) {
        if (isObject(val)) {
            const {
                id,
                data: {
                    //1
                    name, common_names, chemical_name, empirical_formula, un_num, cas_num, concentration,
                    category, physical_state, type,
                    application_or_use,
                    manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
                    emergency_phone_nums,
                    //4
                    risk_level,
                }
            } = val;

            execWhen(() => this.refs.name).then(ref => {
                ref.value = name;
            });
            execWhen(() => this.refs.physical_state).then(ref => {
                ref.value = physical_state;
            });
            execWhen(() => this.refs.type).then(ref => {
                ref.value = type;
            });
            //
//                    execWhen(() => this.refs.contacts_emergency_name).then(ref => {
//                        ref.value = ;
//                    });
            execWhen(() => this.refs.contacts_emergency_num).then(ref => {
                ref.value = emergency_phone_nums;
            });
            execWhen(() => this.refs.contacts_manufacturer_name).then(ref => {
                ref.value = manufacturer;
            });
            execWhen(() => this.refs.contacts_manufacturer_num).then(ref => {
                ref.value = manufacturer_phone_num;
            });
        }
    }
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onChangeSDS">
const onChangeSDS = function (val) {
    this.state.selectedSDS = val;
    if (val) {
        if (isObject(val)) {
            const {
                id,
                data: {
                    product,
                    name, common_names, chemical_name, empirical_formula, un_num,
                    category, date_identified, //other added
                    application_or_use,
                    manufacturer, manufacturer_addr, manufacturer_phone_num, manufacturer_email, manufacturer_fax, manufacturer_website,
                    emergency_phone_nums,
                    //            emergency_phone, //replaced with emergency_phone_nums
                    risk_level, //other added
                }
            } = val;
            execWhen(() => this.refs.name).then(ref => {
                if (!this.state.selectedProduct) {
                    ref.value = name;
                }
            });
            execWhen(() => this.refs.physical_state).then(ref => {
                if (product) {
                    const {data = {}} = product;
                    const {physical_state} = product;
                    ref.value = physical_state;
                }
            });
            execWhen(() => this.refs.type).then(ref => {
                if (product) {
                    const {data = {}} = product;
                    const {type} = product;
                    ref.value = type;
                }
            });
            //
//                    execWhen(() => this.refs.contacts_emergency_name).then(ref => {
//                        ref.value = ;
//                    });
            execWhen(() => this.refs.contacts_emergency_num).then(ref => {
                if (product) {
                    const {data = {}} = product;
                    const {emergency_phone_nums: _emergency_phone_nums} = product;
                    ref.value = _emergency_phone_nums || emergency_phone_nums;
                } else {
                    ref.value = emergency_phone_nums;
                }
            });
            execWhen(() => this.refs.contacts_manufacturer_name).then(ref => {
                if (product) {
                    const {data = {}} = product;
                    const {manufacturer: _manufacturer} = product;
                    ref.value = _manufacturer || manufacturer;
                } else {
                    ref.value = manufacturer;
                }
            });
            execWhen(() => this.refs.contacts_manufacturer_num).then(ref => {
                if (product) {
                    const {data = {}} = product;
                    const {manufacturer_phone_num: _manufacturer_phone_num} = data;
                    ref.value = _manufacturer_phone_num || manufacturer_phone_num;
                } else {
                    ref.value = manufacturer_phone_num;
                }
            });
        }
    }
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onChangeHasProduct">
const onChangeHasProduct = function (el, val) {
    execWhen(() => this.refs.product_details_sec).then(ref => {
        if (val === 'Yes') {
            ref.show();
        } else {
            ref.hide();
        }
    });
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="onChangeHasSDS">
const onChangeHasSDS = function (el, val) {
    execWhen(() => this.refs.sds_details_sec).then(ref => {
        if (val === 'Yes') {
            ref.show();
        } else {
            ref.hide();
        }
    });
};
// </editor-fold>

export {changeColors, onChangeProduct, onChangeSDS, onChangeHasProduct, onChangeHasSDS};