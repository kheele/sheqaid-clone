import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {getQuestionnaireTemplateForm} from '../../utils/ArrayMapperUtils';

import AQuestions from './AQuestionsAsArray';
import style from './TitlePage.lazy.css';

@observer
class TitlePage extends AQuestions {
    key = 'TitlePage';

    @observable state = {
        formData: { 
            type: 'Title Page', 
            question_list: []
        },
        loadingFormData: true
    };

    is_page_title = true;
    
    constructor(props) {
        super(props, style);
    }
    
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
        
    async getForm() {
        let {state: {formData: {question_list}}, props: {isEditting}} = this;
        return await getQuestionnaireTemplateForm(question_list, isEditting);
    }

}

export default TitlePage;//174