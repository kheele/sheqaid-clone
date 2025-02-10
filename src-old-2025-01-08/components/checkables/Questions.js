import React from 'react';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {Grid} from '@material-ui/core';

import {scrollTo} from 'utils/Utils';
import {getQuestionnaireAnswerForm} from 'utils/ArrayMapperUtils';

import ProfileDocTemplateDialog
    from 'views/plugins/plugin_extra/__B_Contractors/forms/ProfileDocTemplateDialog';

import TitlePage from './TitlePage';
import FormBodyQuestionList from './FormBodyQuestionList';

import style from './Questions.lazy.css';

@observer
class Questions extends React.Component {

    @observable state = {
        loadingFormData: true
    };
    
    constructor(props) {
        super(props);
        
        this.scrollTo = scrollTo.bind(this);
        this.onFormOpen = this.onFormOpen.bind(this);
        
        this.onViewTemplateDocDialog = this.onViewTemplateDocDialog.bind(this);
    }
    
    componentWillMount(){
        style.use();
    }
    
    componentDidMount() {
        this.state.loadingFormData = false;
    }
    
    componentWillUnmount(){
        style.unuse();
    }
    
    onViewTemplateDocDialog(ques) {
        this.refs.viewTemplateDocDialog.open(ques.linkDoc);
    }
    
    async getForm() {
        const {props: {item}, refs: {titlePage}} = this;
        const {questions: questionsObject} = item.data.form;
        const data = {
            title_page_list: await titlePage.getForm(),
            questions: await getQuestionnaireAnswerForm(questionsObject)
        };
        return data;
    }
    
    onFormOpen(evt, el) {
        const jq = $(evt.target);
        let currRow = jq.closest('.TitlePage');
        if(currRow.length === 0) {
            currRow = jq.closest('.FormBody');
        } 
        
        if (currRow.hasClass('active')) {
            currRow.removeClass('active');
        } else {
            const curr = currRow.addClass('active');
            currRow.prevAll("div").removeClass('active');
            currRow.nextAll("div").removeClass('active');
            this.scrollTo(curr);
        }
    }

    @computed
    get itemData() {
        const {item} = this.props;
        return (item ? item.data : item) || {};
    }

    @computed
    get question_list() {
        return this.itemData.question_list;
    }

    render() {
        if(!this.props.item) return null;
        const {item, item: {data: {status}}, defaultType, readonly, onChange} = this.props;
        return <div className="Questions hor-center">
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid item>
                    <TitlePage 
                        ref="titlePage" 
                        status={status}
                        item={item}
                        readonly={readonly} 
                        onChange={onChange}
                        onFormOpen={this.onFormOpen}
                        onViewTemplateDocDialog={this.onViewTemplateDocDialog} />
                    <FormBodyQuestionList 
                        ref="formBody"
                        status={status}
                        defaultType={defaultType}
                        question_list={this.question_list}
                        readonly={readonly}
                        onChange={onChange}
                        onFormOpen={this.onFormOpen}
                        onViewTemplateDocDialog={this.onViewTemplateDocDialog}
                        parentId="Questions"/>        
                </Grid>
            </Grid>
            <ProfileDocTemplateDialog ref="viewTemplateDocDialog" />
        </div>;
    }
}

export default Questions;