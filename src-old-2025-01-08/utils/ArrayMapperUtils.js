import {isObservableArray, isObservableObject, toJS} from 'mobx';

import WebWorker from "web-worker/WebWorker";

const mapIncidentPersonDetails = (v) => {
    const {other_person, employee} = v;
    if (other_person) {
        return toJS(other_person);
    } else if (employee) {
        const {id, data, fname, lname} = employee;
        return {id, fname: fname || data.fname, lname: lname || data.lname};
    } else {
        return toJS(v);
    }
};

function mapIncidentCorrectiveActions( {group, sub_group, cause_name, text, cost, responsible_person, date_completed}) {
    const val = {group, sub_group, cause_name, text, cost};
    if (responsible_person) {
        const {id, fname, lname, data} = responsible_person;
        val.responsible_person = {id, fname: fname || data.fname, lname: lname || data.lname};
    }
    val.date_completed = isDate(date_completed) ? date_completed.getTime() : date_completed;

    return val;
}

//keep this one
async function getQuestionnaireAnswerForm(questionsObject) {
    const worker = new WebWorker(() => {
        Events.on("process", Utils.getQuestionnaireAnswerForm);
    });
    const res = await worker.emit("process", toJS(questionsObject));
    worker.terminate();
    return res;
}

//keep this one
async function getQuestionnaireTemplateForm(question_list, isEditting, isLibrary) {
    const worker = new WebWorker(() => {
        Events.on("process", Utils.getQuestionnaireTemplateForm);
    });
    const res = await worker.emit("process", toJS(question_list), isEditting, isLibrary);
    worker.terminate();
    return res;
}

export {
mapIncidentPersonDetails as mapPersonDetails,
        mapIncidentPersonDetails,
        mapIncidentCorrectiveActions,
        getQuestionnaireAnswerForm,
        getQuestionnaireTemplateForm
};
