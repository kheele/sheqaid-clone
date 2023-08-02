import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {getQuestionnaireTemplateForm} from '../../utils/ArrayMapperUtils';

import AQuestions from './AQuestionsAsArray';
import style from './Questions.lazy.css';

@observer
class Questions extends AQuestions {
    key = 'Questions';
    
    @observable state = {
        formData: {
            name: 'Untitled Template', 
            desc: '', 
            type: 'Inspection', 
            question_list: []
        },
        item: null,
        loadingFormData: true
    };

    is_page_title = false;
    
    constructor(props) {
        super(props, style);
        
        const {defaultDocTitle} = this.props;
        if(defaultDocTitle) {
            this.state.formData.name = defaultDocTitle;
        }
    }
    
    isValidForm() {
        const {state: {formData}, refs: {titlePage}} = this;
        const {name, desc, type, question_list} = formData;
        if (!name) {
            infoDialog.open('Form name is required');
            return;
        }
        if (question_list.isEmpty()) {
            infoDialog.open('At least one question is required');
            return;
        }
        return true;
    }
    
    async getForm() {
        const {state: {formData}, refs: {titlePage}, props: {isEditting}} = this;
        const {name, desc, type, question_list} = formData;
        
        const data = {name, desc};
        if(type) {
            data.type = type;
        }
        
        data.title_page_list = await titlePage.getForm();
        data.question_list = await getQuestionnaireTemplateForm(question_list, isEditting);
        return data;
    }

    set item(item) {
        this.state.item = item;
        this.defaultQuestionList();
    }
}

export default Questions;//223