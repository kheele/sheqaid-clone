import {isObservableArray, isObservableObject, toJS} from 'mobx';

import WebWorker from "../web-worker/WebWorker";

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

function mapQuestionnaires(v, n) {
    if (isObservableObject(v.questions) || isObject(v.questions)) {
        return Object.values(v.questions).map(mapQuestionnaires);
    } else if (isObservableArray(v.questions) || isArray(v.questions)) {
        return v.questions.map(mapQuestionnaires);
    }
    return [v];
}

async function convertQuestionnaireObjectToArray(questionsObject) {
    if (isArray(questionsObject) || isObservableArray(questionsObject)) {
        return questionsObject;
    }
    const worker = new WebWorker(() => {
        Events.on("process", Utils.convertQuestionnaireObjectToArray);
    });
    const res = await worker.emit("process", toJS(questionsObject));
    worker.terminate();
    return res;
}

async function getQuestionnaireAnswerForm(questionsObject) {
    const worker = new WebWorker(() => {
        Events.on("process", Utils.getQuestionnaireAnswerForm);
    });
    const res = await worker.emit("process", toJS(questionsObject));
    worker.terminate();
    return res;
}

async function getQuestionnaireTemplateForm(questionsArray) {
    const worker = new WebWorker(() => {
        Events.on("process", Utils.getQuestionnaireTemplateForm);
    });
    const res = await worker.emit("process", toJS(questionsArray));
    worker.terminate();
    return res;
}

export {
mapIncidentPersonDetails as mapPersonDetails,
        mapIncidentPersonDetails,
        mapIncidentCorrectiveActions,
        convertQuestionnaireObjectToArray,
        getQuestionnaireAnswerForm,
        getQuestionnaireTemplateForm
};
