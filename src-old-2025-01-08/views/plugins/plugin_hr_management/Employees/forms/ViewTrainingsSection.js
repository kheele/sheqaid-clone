// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {FormControls, Row} from 'components/FormComponents';
import TrainingCourseSection from "./TrainingCourseSection";
import TrainingPlanSection from "./TrainingPlanSection";
import TrainingMatrixSection from "./TrainingMatrixSection";

// </editor-fold>

@observer
class TrainingsSection extends React.Component {
    pageKey = "TrainingsSection";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onCreateTrainingPlan = this.onCreateTrainingPlan.bind(this);
        this.onCreateTrainingMatrix = this.onCreateTrainingMatrix.bind(this);
        this.onCreateTrainingRegister = this.onCreateTrainingRegister.bind(this);
        this.onCreateCertificate = this.onCreateCertificate.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onCreateTrainingPlan">
    onCreateTrainingPlan() {
        this.refs.newTrainingPlanForEmployeeDialog.open(this.props.item).then(res => {

        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onCreateTrainingMatrix">
    onCreateTrainingMatrix() {

    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onCreateTrainingRegister">
    onCreateTrainingRegister() {

    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onCreateCertificate">
    onCreateCertificate() {

    }

    // </editor-fold>

    render() {
        const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;

        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <FormControls lazyLoad>
                <Row
                    rendered
                    idx={idx + ".1"}
                    title={idx + ".1 Training Courses"}
                    sectionClassName="h-380 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                >
                    <TrainingCourseSection item={item}/>
                </Row>
                <Row
                    rendered
                    idx={idx + ".2"}
                    title={idx + ".2 Training Plan"}
                    sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                >
                    <TrainingPlanSection item={item}/>
                </Row>
                <Row
                    rendered
                    idx={idx + ".3"}
                    title={idx + ".3 Training Matrix"}
                    sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                >
                    <TrainingMatrixSection item={item}/>
                </Row>
                {/*<Row*/}
                {/*  rendered*/}
                {/*  idx={idx + ".4"}*/}
                {/*  title={idx + ".4 Training Registers"}*/}
                {/*  sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"*/}
                {/*  onFormOpen={onFormOpen}*/}
                {/*  onFormBack={onFormBack}*/}
                {/*>*/}
                {/*    <TrainingRegisterSection item={item}/>*/}
                {/*</Row>*/}
            </FormControls>
        </div>;
    }
}

export default TrainingsSection;
