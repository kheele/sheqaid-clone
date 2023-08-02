import React from 'react';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Grid} from '@material-ui/core';

import {getQuestionnaireAnswerForm} from '../../utils/ArrayMapperUtils';

import FormBodyQuestionList from './FormBodyQuestionList';

import style from './TitlePage.lazy.css';

@observer
class TitlePage extends React.Component {

    @observable state = {
        loadingFormData: true
    };
    
    constructor(props) {
        super(props);
    }
    
    componentWillMount(){
        style.use();
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    async getForm() {
        let {questions: questionsObject} = this.props;
        return await getQuestionnaireAnswerForm(questionsObject);
    }

    @computed
    get itemData() {
        const {item} = this.props;
        return (item ? item.data : item) || {};
    }

    @computed
    get page_title_list() {
        return this.itemData.page_title_list;
    }

    render() {
        const {readonly, status, onChange, onFormOpen, onViewTemplateDocDialog} = this.props;
        return <div key="TitlePage" className="TitlePage hor-center margin-t-15 margin-b-15">
            <Grid key="Grid" container direction="column" justify="center" alignItems="center">
                <Grid key="Grid" item> 
                    <FormBodyQuestionList 
                        key="FormBodyQuestionList"
                        ref="itemBody"
                        defaultType="Title Page"
                        status={status}
                        question_list={this.page_title_list}
                        readonly={readonly}
                        onChange={onChange}
                        onFormOpen={onFormOpen}
                        onViewTemplateDocDialog={onViewTemplateDocDialog}
                        parentId="TitlePage"/>        
                </Grid>
            </Grid>
        </div>;
    }
}

export default TitlePage;