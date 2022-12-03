import React from 'react';
import {observer} from 'mobx-react';
import {toJS} from 'mobx';

import IconButton from '@material-ui/core/IconButton';
import AccordionActions from '@material-ui/core/AccordionActions';
import Divider from '@material-ui/core/Divider';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import FilterNoneIcon from '@material-ui/icons/FilterNone';

import style from './AnswerActions.lazy.css';

@observer
class AnswerActions extends React.Component {

    constructor(props) {
        super(props);

        this.showAsQuestion = this.showAsQuestion.bind(this);
        this.copyQuestion = this.copyQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
    }
    
    componentWillMount(){
        style.use();
    }
    
    componentWillUnmount(){
        style.unuse();
    }

    showAsQuestion = () => {
        const {ques} = this.props;
        ques.open = false;
    }

    copyQuestion = () => {
        const {ques, questions, expandCloseAll} = this.props;
        expandCloseAll().then(() => {
            const newQ = toJS(ques);
            newQ.open = true;
            questions.push(newQ);
        });
    }

    deleteQuestion = () => {
        const {idx, questions} = this.props;
        questions.removeIf((q, n) => n === idx);
    } 

    render() {
        return <AccordionActions className="AnswerActions">               
            <IconButton aria-label="View" onClick={this.showAsQuestion}>
                <VisibilityIcon />
            </IconButton>
            <IconButton aria-label="Copy" onClick={this.copyQuestion}>
                <FilterNoneIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem/>
            <IconButton aria-label="delete" onClick={this.deleteQuestion}>
                <DeleteOutlineIcon />
            </IconButton>
        </AccordionActions>;
    }
}

export default AnswerActions;