// <editor-fold defaultstate="collapsed" desc="imports">
import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {getQuestionnaireTemplateForm} from '../../utils/ArrayMapperUtils';

import AQuestions from './AQuestions';
import style from './TitlePage.lazy.css';

// </editor-fold>

@observer
class TitlePage extends AQuestions {
    key = 'TitlePage';

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable state = {
        formData: { 
            type: 'Title Page', 
            questions: observable(new Map())
        },
        loadingFormData: true
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props, style);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="defaultQuestions">
    get defaultQuestions() {
        const {defaultQuestions} = this.props;
        const create = (questionText, questionType) => {
            return {...this.defaultQuestion, questionText, questionType, ...{open: false}}; 
        };
        if(defaultQuestions) {
            return defaultQuestions.map(({questionText, questionType}) => {
                return create(questionText, questionType);
            });
        }
        return [
            create("Conducted On", "Date"),
            create("Completed By", "Person"),
            create("Location", "Short Answer")
        ];
    }
    // </editor-fold>
        
    // <editor-fold defaultstate="collapsed" desc="getForm">
    async getForm() {
        let {formData: {questions: questionsArray}} = this.state;
        return await getQuestionnaireTemplateForm(questionsArray);
    }
    // </editor-fold>

}

export default TitlePage;//174