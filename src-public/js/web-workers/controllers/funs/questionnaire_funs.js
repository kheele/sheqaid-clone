
class QuestionnaireFuns {

    static hasQuestionFile(obj) {
        return QuestionnaireFuns.hasQuestionImageInQues(obj) ||
                QuestionnaireFuns.hasQuestionImageInOptions(obj);
    }

    static hasQuestionImageInQues(obj) {
        if (!obj)
            return false;
//        console.log('hasQuestionImageInQues', Object.getPathsByKey(obj, 'questionImage'))
        return !Object.getPathsByKey(obj, 'questionImage').isEmpty();
    }

    static hasQuestionImageInOptions(obj) {
        if (!obj)
            return false;
//        console.log('hasQuestionImageInOptions', Object.getPathsByKey(obj, 'optionImage'))
        return !Object.getPathsByKey(obj, 'optionImage').isEmpty();
    }

    static getQuestionImagesInQues(obj) {
        if (!obj)
            return null;
//        console.log('getQuestionImagesInQues', Object.getPathsByKey(obj, 'questionImage'))
        return Object.getPathsByKey(obj, 'questionImage');
    }

    static getQuestionImagesInOptions(obj) {
        if (!obj)
            return null;
//        console.log('getQuestionImagesInOptions', Object.getPathsByKey(obj, 'optionImage'))
        return Object.getPathsByKey(obj, 'optionImage');
    }

    static unmapQuestionnaires(questionsObj, isContractorQuestionnaire) {
        return async (v, n) => {
//        v.idx = n;

            if (v.questions) {
                const toArray = async questions => {
                    const questionsArr = (await Promise.all(Object.values(questions).map(QuestionnaireFuns.unmapQuestionnaires(questionsObj, isContractorQuestionnaire))));
                    if (questionsObj) {
                        return questionsArr.map(QuestionnaireFuns.createQuestionPath(questionsObj));
                    } else {
                        return questionsArr;
                    }
                };
                v.questions = await toArray(v.questions);
                if (isContractorQuestionnaire) {
                    v.questions = await Promise.all(v.questions.map(ContractorQuestionnaireFuns.getLinkDoc));
                }
                v = QuestionnaireFuns.createQuestionPath(questionsObj)(v);
            } else if (questionsObj) {
                v = QuestionnaireFuns.createQuestionPath(questionsObj)(v);
            }
            if (isContractorQuestionnaire) {
                if (v.linkDoc && !v.linkDoc.id) {
                    v = await ContractorQuestionnaireFuns.getLinkDoc(v);
                }
            }
            if (v.expiry && !isNumber(v.expiry) && isFunction(v.expiry.toDate)) {
                v.expiry = v.expiry.toDate();
            }
            return v;
        };
    }

    static createQuestionPath(questions) {
        return item => {
            const quesPath = Object.getPathByValue(questions, item);
            item.quesPath = quesPath;
            item.idx = quesPath.filter(v => v.isNumeric()).map(v => parseInt(v) + 1).join('.');
            return item;
        };
    }

    static isQuestionFile(ques) {
        if (!ques)
            return false;
        return !!ques.answer && (ques.questionType === 'Photo' || ques.questionType === 'Document');
    }

    static async uploadResponseFile(docId, path, q, quesPath) {
        if (!!q.answer && (q.questionType === 'Photo' || q.questionType === 'Document')) {
            let answers;
            if (!isArray(q.answer)) {
                answers = [q.answer];
            } else {
                answers = q.answer;
            }
            q.answer = await Promise.all(answers.map(async (answer, n) => {
                if (answer.dlUrls)
                    return answer;

                return await files.upload.call(this, answer, async (bucketFile) => {
                    let new_name = this.tbl + '/' + docId + '/' + path + '-';
                    new_name += quesPath.filter(v => v.isNumeric()).map(v => parseInt(v) + 1).join('-') + '-' + n + '/';
                    if (q.questionType === 'Document') {
                        new_name += 'answers-doc/';
                    } else if (q.questionType === 'Photo') {
                        new_name += 'answers-photo/';
                    }
                    return new_name + bucketFile.name;
                }).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                                    throw e;
                });
            }));
        }
        return q;
    }

    static async uploadQuestionFile(docId, list, path) {
        return (await Promise.all(Object.keys(list).map(async (k, n) => {
            const q = list[k];

            if (QuestionnaireFuns.hasQuestionImageInQues(q)) {
                await Promise.all(QuestionnaireFuns.getQuestionImagesInQues(q).map(async pathArray => {
                    const pathArray2 = [...pathArray];
//                                pathArray.pop();
                    const qVal = Object.getValueByPath(q, pathArray);
                    if (qVal !== null && isFile(qVal.questionImage)) {
                        const keysPath = pathArray2.join('-');
                        const gcsUri = await files.upload.call(this, qVal.questionImage, async function (bucketFile) {
                            const new_name = this.tbl + '/' + docId + '/' + path + '-' + keysPath + '/' + bucketFile.name;
                            return new_name;
                        }.bind(this)).catch(e => {
                            //                        doc_ref.delete();//Promise < void >
                            //                            throw e;
                        });
                        qVal.questionImage = gcsUri;
                    }
                    return qVal;
                }));
            }
            if (QuestionnaireFuns.hasQuestionImageInOptions(q)) {
                await Promise.all(QuestionnaireFuns.getQuestionImagesInOptions(q).map(async pathArray => {
                    const pathArray2 = [...pathArray];
                    pathArray.pop();
                    pathArray.pop();
//                                pathArray.pop();
                    const qVal = Object.getValueByPath(q, pathArray);
                    if (qVal !== null && isArray(qVal.options)) {
                        const keysPath = pathArray2.join('-');
                        qVal.options = await Promise.all(qVal.options.filter(opt => isFile(opt.optionImage)).map(async (opt, n) => {
                            const gcsUri = await files.upload.call(this, opt.optionImage, async function (bucketFile) {
                                const new_name = this.tbl + '/' + docId + '/' + path + '-' + keysPath + '--' + n + '/' + bucketFile.name;
                                return new_name;
                            }.bind(this)).catch(e => {
//                        doc_ref.delete();//Promise < void >
//                            throw e;
                            });
                            opt.optionImage = gcsUri;
                        }));
                    }
                    return qVal;
                }));
            }
            return q;
        }))).toObject();
    }

}