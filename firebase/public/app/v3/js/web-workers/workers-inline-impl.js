
self.convertIdToBigint = (encodedHasuraRelayID) => {
    try {
        const decodedRelayID = atob(encodedHasuraRelayID);
        const relayIdAsArray = JSON.parse(decodedRelayID);
        const actualDatabaseID = relayIdAsArray[3];
        // console.log(decodedRelayID); // "[1, \"lifeplan\", \"status_plan_header\", 1]"
        // console.log(relayIdAsArray); // [1, "lifeplan", "status_plan_header", 1]
        // console.log(actualDatabaseID); // 1  (the actual database ID)!
        return actualDatabaseID;
    } catch (e) {
        return encodedHasuraRelayID;
    }
};

self.convertMutations = convertMutations = (obj) => {
    if (isArray(obj)) {
        return obj.map(convertMutations);
    } else if (typeof obj === 'object' && !isNullable(obj)) {
        let newObj = {};
        const keys = Object.keys(obj);
        for (let n = 0; n < keys.length; n++) {
            const key = keys[n];
            let value = obj[key];
            if (isDate(value)) {
                value = Dates.parse(value);
            } else if (isArray(value)) {
                value = value.map(convertMutations);
            } else if (typeof value === 'object' && !isNullable(value)) {
                value = convertMutations(value);
            } else {
                if (key === 'id' || (key.endsWith('_id') && key !== 'auth_id')) {
                    value = convertIdToBigint(value);
                } else if (key.endsWith('_list') && isNullable(value)) {
                    value = [];
                }
            }
            if (key !== "__typename") {
                newObj[key] = value;
            }
        }
        return newObj;
    }
    return obj;
};

class Utils {
    static async toDataURI(db, filePath) {
        if (filePath instanceof File) {
            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(filePath);
                reader.onload = function () {
                    resolve(reader.result);//base64encoded string
                };
                reader.onerror = function (err) {
                    console.error(err);
                    reject(err);
                };
            });
        }
    }

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
        // return Object.values(questionsObject).map(unmapQuestionnaires);
    }

    //keep this one
    static getQuestionnaireAnswerForm = async (db, question_list) => {
        const mapQuestions = async (v, n) => {
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
                    v.answer = answer;
                    // v.answer = JSON.stringify(answer);
                }

                if (answer && answer.path) {
                    const {path} = answer;
                    v.answer = {path: await Utils.toDataURI(path)};
                }
            }
            return v;
        };

        return Promise.all(question_list.map(mapQuestions));
    }

    //keep this one
    static getQuestionnaireTemplateForm = async (db, question_list, isEditing) => {
        const mapQuestions = async (v, n) => {
//            v.idx = n;
            delete v.open;
            if (!isEditing) {
                delete v.questionnaire;
                if(v.linkDoc) {
                    v.link_doc_id = v.linkDoc.id;
                    delete v.linkDoc;
                }
                if(v.id) {
                    delete v.id;
                }
            }

            if (isArray(v.question_list) && v.question_list.isNotEmpty()) {
            // if ('sectionText' in v) {
                delete v.options;
                delete v.notified_list;
                delete v.message_list;
                delete v.ques_path_list;

                v.question_list = {data: await Promise.all(v.question_list.map(mapQuestions))};
            } else {
                if (!isEditing) {
                    delete v.question_list;

                    console.log('questionImage', v.questionImage)
                    if(v.questionImage) {
                        const {path} = v.questionImage;
                        v.questionImage = {path: await Utils.toDataURI(path)};
                    }

                    console.log('options', v.options)
                    if(isArray(v.options) && v.options.isNotEmpty()) {
                        v.options = {
                            data: await Promise.all(v.options.map(async (v) => {
                                if(v.optionImage) {
                                    const {path} = v.optionImage;
                                    v.optionImage = {path: await Utils.toDataURI(path)};
                                }
                                return v;
                            })),
                        };
                    } else {
                        delete v.options;
                    }

                    console.log('notified_list', v.notified_list)
                    if(isArray(v.notified_list) && v.notified_list.isNotEmpty()) {
                        v.notified_list = {
                            data: v.notified_list.filter(v => !!v).filter(v => !!v.id).map(({id: employee_id}) => {
                                return {employee_id};
                            }),
                        };
                    } else {
                        delete v.notified_list;
                    }

                    console.log('message_list', v.message_list)
                    if(isArray(v.message_list) && v.message_list.isNotEmpty()) {
                        v.message_list = {
                            data: v.message_list,
                        };
                    } else {
                        delete v.message_list;
                    }

                    console.log('ques_path_list', v.ques_path_list)
                    if(isArray(v.ques_path_list) && v.ques_path_list.isNotEmpty()) {
                        v.ques_path_list = {
                            data: v.ques_path_list,
                        };
                    } else {
                        delete v.ques_path_list;
                    }
                    v.answer = null;
                }
            }
            return v;
        };
        return Promise.all(question_list.map(mapQuestions));
    }
}

importScripts(self.locationRoot + "js/web-workers/worker-inline.js");
