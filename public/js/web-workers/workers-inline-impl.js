class Utils {
    static toArray(args) {
        const array = [];
        for (let n in args) {
            array.push(args[n]);
        }
        return array;
    }

    static convertQuestionnaireObjectToArray = async (db, questionsObject) => {
        const unmapQuestionnaires = (v, n) => {
            if (v.questions) {
                return {...v, questions: Object.values(v.questions).map(q => {
                        return {...q, linkDoc: q.linkDoc || null};
                    }).map(unmapQuestionnaires)};
            }
            return v;
        };

        return Object.values(questionsObject).map(unmapQuestionnaires);
        //Object.values(questions || {}).map(unmapQuestionnaires).reduce((a1, a2) => [...a1, ...a2], []);
    }

    static getQuestionnaireAnswerForm = async (db, questionsObject) => {
        const unmapQuestionnaires = (v, n) => {
            if (v.questions) {
                return {...v, questions: Object.values(v.questions).map(unmapQuestionnaires)};
            }
            return v;
        };

        const mapQuestionsToObject = (v, n) => {
//            v.idx = n;
            v.linkDoc && (v.linkDoc = v.linkDoc.id);
            if ('sectionText' in v) {
                (isArray(v.questions)) && (v.questions = v.questions.map(mapQuestionsToObject).toObject());
            } else {
                v.questionImage && (v.questionImage = v.questionImage.path);
                (isArray(v.options)) && (v.options = v.options.map(o => {
                    o.optionImage && (o.optionImage = o.optionImage.path);
                    return o;
                }));
                (isArray(v.notifiedList)) && (v.notifiedList = v.notifiedList.map(({id, data = {}, fname, lname, email}) => {
                    return {id, fname: fname || data.fname, lname: lname || data.lname, email: email || data.email};
                }));
                v.answer = null;
            }
            return v;
        };

        return Object.values(questionsObject).
                map(unmapQuestionnaires).
                map(v => {
                    const {questionType, answer} = v;
                    if (questionType === 'Person' && answer) {
                        const {id, data = {}, fname, lname} = answer;
                        v.answer = {id, fname: fname || data.fname, lname: lname || data.lname};
                    }
                    if (questionType === 'Asset' && answer) {
                        const {id, data = {}, name} = answer;
                        v.answer = {id, name: name || data.name};
                    }
                    if (questionType === 'Signature' && answer) {
                        v.answer = JSON.stringify(answer);
                    }

                    if (answer && answer.path) {
                        v.answer = answer.path;
                    }
                    if (typeof answer === 'undefined') {
                        v.answer = null;
                    }
                    return v;
                }).
                map(mapQuestionsToObject).
                toObject();
    }

    static getQuestionnaireTemplateForm = async (db, questionsArray, isEditting) => {
        const mapQuestionsToObject = (v, n) => {
//            v.idx = n;
            if (!isEditting) {
                v.linkDoc && (v.linkDoc = v.linkDoc.id);
            }

            if ('sectionText' in v) {
                (isArray(v.questions)) && (v.questions = v.questions.map(mapQuestionsToObject).toObject());
            } else {
                if (!isEditting) {
                    v.questionImage && (v.questionImage = v.questionImage.path);
                    (isArray(v.options)) && (v.options = v.options.map(o => {
                        o.optionImage && (o.optionImage = o.optionImage.path);
                        return o;
                    }));
                    (isArray(v.notifiedList)) && (v.notifiedList = v.notifiedList.map(({id, data = {}, fname, lname, email}) => {
                        return {id, fname: fname || data.fname, lname: lname || data.lname, email: email || data.email};
                    }));
                    v.answer = null;
                }
            }
            return v;
        };

        return questionsArray.map(mapQuestionsToObject).toObject();
    }
}

importScripts(self.locationRoot + "js/web-workers/worker-inline.js");
