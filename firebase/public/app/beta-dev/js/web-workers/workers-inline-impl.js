class Utils {
    static toArray(args) {
        const array = [];
        for (let n in args) {
            array.push(args[n]);
        }
        return array;
    }

    //TODO: To remove
    static convertQuestionnaireObjectToArray = async (db, questionsObject) => {
        const unmapQuestionnaires = (v, n) => {
            if (v.question_list) {
                return {
                    ...v, questions: Object.values(v.questions).map(q => {
                        return {...q, linkDoc: q.linkDoc || null};
                    }).map(unmapQuestionnaires)
                };
            }
            return v;
        };

        return questionsObject;
    }

    //keep this one
    static getQuestionnaireAnswerForm = async (db, question_list) => {
        const mapQuestions = (v, n) => {
//            v.idx = n;
            delete v.open;

            if (isArray(v.question_list)) {
            // if ('sectionText' in v) {
                v.question_list = {data: v.question_list.map(mapQuestions)};
            } else {
                const {questionType, answer} = v;
                if (questionType === 'Person' && answer) {
                    const {id: employee_id} = answer;
                    v.answer = {employee_id};
                }
                if (questionType === 'Asset' && answer) {
                    const {id: asset_id} = answer;
                    v.answer = {asset_id};
                }
                if (questionType === 'Signature' && answer) {
                    v.answer = JSON.stringify(answer);
                }

                if (answer && answer.path) {
                    v.answer = answer.path;
                }
            }
            return v;
        };

        return question_list.map(mapQuestions);
    }

    //keep this one
    static getQuestionnaireTemplateForm = async (db, question_list, isEditing) => {
        const mapQuestions = (v, n) => {
//            v.idx = n;
            delete v.open;
            if (!isEditing) {
                if(v.linkDoc) {
                    v.link_doc_id = v.linkDoc.id;
                    delete v.linkDoc;
                }
                if(v.id) {
                    delete v.id;
                }
            }

            if (isArray(v.question_list)) {
            // if ('sectionText' in v) {
                v.question_list = {data: v.question_list.map(mapQuestions)};
            } else {
                if (!isEditing) {
                    v.questionImage && (v.questionImage = v.questionImage.path);
                    (isArray(v.options)) && (v.options = v.options.map(o => {
                        o.optionImage && (o.optionImage = o.optionImage.path);
                        return o;
                    }));
                    // (isArray(v.notified_list)) && (v.notified_list = v.notified_list.map(({id, data = {}, fname, lname, email}) => {
                    //     return {id, fname: fname || data.fname, lname: lname || data.lname, email: email || data.email};
                    // }));
                    (isArray(v.notified_list)) && (v.notified_list = {data: v.notified_list.map(({id: employee_id}) => {
                        return {employee_id};
                    })});
                    v.answer = null;
                }
            }
            return v;
        };

        return question_list.map(mapQuestions);
    }
}

importScripts(self.locationRoot + "js/web-workers/worker-inline.js");
