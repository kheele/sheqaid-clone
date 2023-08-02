import React from "react";

import {onAsyncSelectLoadImpl} from 'utils/AsyncSelect';

// <editor-fold defaultstate="collapsed" desc="AsyncSelectLoad. Click on the + sign on the left to edit the code.">
function onAsyncSelectLoadFlashReportEmployersOrContractors(value) {
    return onAsyncSelectLoadImpl("plugin_sheq_assist/17_Incident_Investigation/flash-reports/list/search_employer_or_contractor_by_name", value, value => {
        return {label: value, value};
    });
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectLoad. Click on the + sign on the left to edit the code.">
function onSelectLoadAssetActionCategories() {
    return neonBinding.events.emit("plugin_sheq_assist/19_Maintenance/actions/categories/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}
function onSelectLoadAssetManufacturers() {
    return neonBinding.events.emit("plugin_sheq_assist/19_Maintenance/tools/manufacturers/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}
function onSelectLoadAssetModels() {
    return neonBinding.events.emit("plugin_sheq_assist/19_Maintenance/tools/models/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}
function onSelectLoadAssetLocations() {
    return neonBinding.events.emit("plugin_sheq_assist/19_Maintenance/tools/locations/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}
function onSelectLoadAssetToolkits() {
    return neonBinding.events.emit("plugin_sheq_assist/19_Maintenance/tools/toolkits/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}
function onSelectLoadAssetConditions() {
    return neonBinding.events.emit("plugin_sheq_assist/19_Maintenance/tools/conditions/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}
function onSelectLoadAssetVendors() {
    return neonBinding.events.emit("plugin_sheq_assist/19_Maintenance/tools/vendors/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}

function onSelectLoadTrainingFrequencies() {
    return neonBinding.events.emit("plugin_sheq_assist/05_Trainings/training-matrix/frequencies/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}

function onSelectLoadSWPCategories() {
    return neonBinding.events.emit("plugin_sheq_assist/09_HIRA_And_Opportunities/swp/category/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}
function onSelectLoadSWPLocations() {
    return neonBinding.events.emit("plugin_sheq_assist/09_HIRA_And_Opportunities/swp/location/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}
function onSelectLoadSOPLocations() {
    return neonBinding.events.emit("plugin_sheq_assist/09_HIRA_And_Opportunities/sop/location/list").then(res => {
        return res.map(value => {
            return {label: value, value};
        });
    });
}

function onSelectLoadAuditElements() {
    return neonBinding.events.emit("plugin_sheq_assist/21_Internal_Audit/audit/elements/list");
}
function onSelectLoadAuditSubElements() {
    return neonBinding.events.emit("plugin_sheq_assist/21_Internal_Audit/audit/sub_elements/list");
}
// </editor-fold>

function getRiskRatingConsequenceList() {
    return ['1) Low', '2) Moderate', '3) High', '4) Very High', '5) Extreme'].map((text, n) => {
        return {text, value: n + 1, checked: false};
    });
}
function getRiskRatingLikelihoodList() {
    return ["1) Rare", "2) Unlikely", "3) Possible", "4) Likely", "5) Almost Certain"].map((text, n) => {
        return {text, value: n + 1, checked: false};
    });
}
function getRiskRatingFrequencyList() {
    return ["1) Rare", "2) Infrequent", "3) Frequent", "4) High Frequent", "5) Continuous"].map((text, n) => {
        return {text, value: n + 1, checked: false};
    });
}

export {
// <editor-fold defaultstate="collapsed" desc="AsyncSelectLoad. Click on the + sign on the left to edit the code.">
onAsyncSelectLoadFlashReportEmployersOrContractors,
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc="SelectLoad. Click on the + sign on the left to edit the code.">
        onSelectLoadAssetActionCategories,
        onSelectLoadAssetManufacturers,
        onSelectLoadAssetModels,
        onSelectLoadAssetLocations,
        onSelectLoadAssetToolkits,
        onSelectLoadAssetConditions,
        onSelectLoadAssetVendors,
        onSelectLoadTrainingFrequencies,
        
        onSelectLoadSWPCategories,
        onSelectLoadSWPLocations,
        onSelectLoadSOPLocations,
        onSelectLoadAuditElements,
        onSelectLoadAuditSubElements,
// </editor-fold>
        getRiskRatingConsequenceList, getRiskRatingLikelihoodList, getRiskRatingFrequencyList
};