// <editor-fold defaultstate="collapsed" desc="imports">
import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {getQuestionnaireTemplateForm} from '../../utils/ArrayMapperUtils';

import AQuestions from './AQuestions';
import style from './Questions.lazy.css';

// </editor-fold>

@observer
class Questions extends AQuestions {
    key = 'Questions';
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable state = {
        formData: {
            name: 'Untitled Template', 
            desc: '', 
            type: 'Inspection', 
            questions: observable(new Map())
        },
        loadingFormData: true
    };
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props, style);
        
        const {defaultDocTitle} = this.props;
        if(defaultDocTitle) {
            this.state.formData.name = defaultDocTitle;
        }
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="isValidForm">
    isValidForm() {
        const {state: {formData}, refs: {titlePage}} = this;
        const {name, desc, type, questions: questionsArray} = formData;
        if (!name) {
            infoDialog.open('Form name is required');
            return;
        }
        if (questionsArray.isEmpty()) {
            infoDialog.open('At least one question is required');
            return;
        }
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="getForm">
    async getForm() {
        const {state: {formData}, refs: {titlePage}} = this;
        const {name, desc, type, questions: questionsArray} = formData;
        
        const data = {name, desc};
        if(type) {
            data.type = type;
        }
        
        data.title_page_list = await titlePage.getForm();
        data.questions = await getQuestionnaireTemplateForm(questionsArray);
        return data;
    }
    // </editor-fold>

}

export default Questions;//223