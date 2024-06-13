//<editor-fold desc="imports">
import {observer} from "mobx-react";
import React from "react";
import {DocusealForm} from '@docuseal/react';
import {CircularProgress} from "@mui/material";
import {Button} from "../inputs";
import {Dialog} from "../dialogs";
import style from "./DocSignButton.lazy.css";
//</editor-fold>

const LoadStatus = {
    LOADING: "Loading",
    ERROR: "Error",
    LOADED_DATA: "Loaded Data",
};

@observer
class DocSignButton extends React.Component {

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onSignDocument = this.onSignDocument.bind(this);
    }

    //</editor-fold>

    get customCss() {
        return `
            .sticky.bg-yellow-100:first-of-type{
                visibility: hidden !important;
            }
        `;
    }

    get employee_id() {
        const {isEmployee} = storage.is;
        const {id, data: {linked_employee_id}} = storage.loggedUser.user;
        return isEmployee ? id : linked_employee_id;
    }

    get isSubmitter() {
        const {employee_id} = this;

        const {doc} = this.props;
        const {employee_submitter_list} = doc;
        const employee = employee_submitter_list.find(v => v.is_owning);
        if (employee) {
            if (employee.id === employee_id) {
                return true;
            }
        }


    }

    get submitter() {
        const {employee_id} = this;

        const {doc} = this.props;
        const {employee_submitter_list} = doc;
        const employee = employee_submitter_list.find(v => v.is_owning);
        if (employee) {
            if (employee.id === employee_id) {
                return "Employee";
            }
        }


    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    onSignDocument() {
        this.refs.dialog.open();
    }

    render() {
        const {doc} = this.props;
        if (!doc) return <CircularProgress className="fixed-center"/>;

        // if (!this.isSubmitter) return null;

        const {slug} = doc;

        return <>
            <Button
                key={new Date().getTime()}
                className="btn btn-primary margin-b-10 hor-center border-radius-20"
                onClick={this.onSignDocument}
            >
                <i className="fa fa-eye"/> Sign Document
            </Button>
            <Dialog
                key={'DocSignButton-profile-dialog'}
                ref="dialog"
                className={'DocSignButton-dialog'}
                topButtons={this.topButtons}
                dialog={this}
            >
                <DocusealForm
                    src={`https://docuseal.co/s/${slug}`}
                    submitter="General Manager"
                    customCss={this.customCss}
                />
            </Dialog>
        </>;
    }
}

export default DocSignButton;
