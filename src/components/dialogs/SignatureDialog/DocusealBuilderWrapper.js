//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {DocusealBuilder} from '@docuseal/react';

import {Dialog} from '../../dialogs';

import {Button,} from "../../inputs";
import {updateSignableDocTemplate} from "../../../mutations/update";
//</editor-fold>

//<editor-fold desc="DocusealBuilderWrapper">
@observer
class DocusealBuilderWrapper extends React.Component {

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onSetUpSignature = this.onSetUpSignature.bind(this);

        this.onSaveTemplate = this.onSaveTemplate.bind(this);

        this.onLoad = this.onLoad.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    //</editor-fold>

    @computed get template() {
        /*
        id,
        external_id,
        name,
        doc_type,
        slug,
        preview_image_url,
        doc,
        is_employee_owning,
        module,
        plugin,
        signing_employee_list,
        signing_job_position_list,
        * */
        return this.propState.template;
    }

    @computed get token() {
        return this.propState.token;
    }

    @computed get roles() {
        const {template} = this;
        if (!template) return [];
        const {is_employee_owning, signing_employee_list, signing_job_position_list} = template;

        const roles = [];
        if (is_employee_owning) {
            roles.push("Employee");
        }

        if (signing_employee_list) {
            const employee_list = signing_employee_list.map(
                (
                    {
                        employee: {full_name, email, job_position},
                    }
                ) => `${full_name}${email ? ` (${email})` : ''}${job_position ? ` - ${job_position.name}` : ''}`
            );
            roles.push(...employee_list);
        }
        if (signing_job_position_list) {
            const job_position_list = signing_job_position_list.map(v => v.job_position.name);
            roles.push(...job_position_list);
        }

        return roles;
    }

    @computed get propState() {
        return this.props.state;
    }

    @computed get form() {
        return this.props.form;
    }

    get customCss() {
        return `
            .sticky.bg-yellow-100:first-of-type, 
            #sign_yourself_button, 
            #send_button{
                display: none !important;
            }
            
            #main_container{
                max-height: calc(100% - 50px);
                height: 100%;
            }
            #pages_container{
                border-right: 2px solid #e1e1e1;
                padding: 0;
                margin-right: 10px;
            }
        `;
    }

    onSaveTemplate(detail) {
        const {form, template} = this;
        const {
            name,
        } = form.data;

        const {
            id: external_id,
        } = detail;

        updateSignableDocTemplate({id: template.id, external_id}).then((res) => {
            if (res) {

            } else {

            }
        }).catch((error) => {
            console.error("Error:", error);
            // setSubmitting(false);
        });
    }

    onSetUpSignature() {
        this.refs.dialog.open();
    }

    //
    // load(data) {
    //     const dom = findDOMNode(this);
    //     if (dom) {
    //         return;
    //     }
    //
    //     const {roles} = this;
    //
    //     let {
    //         plugin, //
    //         module,//
    //         doc,
    //         name,//
    //         is_employee_owning,
    //         signature_settings_list,
    //     } = data;
    //
    //     signature_settings_list = (signature_settings_list || []).map(({job_position, employee,}) => ({
    //         job_position: job_position && {id: job_position.id, name: job_position.data.name},
    //         employee: employee && {id: employee.id, full_name: employee.data.full_name, email: employee.data.email},
    //     }));
    //
    //     if (is_employee_owning) {
    //         roles.push("Employee");
    //     }
    //
    //     const job_position_list = signature_settings_list.filter(v => !!v.job_position && !v.employee).map(v => v.job_position.name);
    //     roles.push(...job_position_list);
    //
    //     const employee_list = signature_settings_list.filter(v => !v.job_position && !!v.employee).map(v => v.employee.full_name);
    //     roles.push(...employee_list);
    //
    //     this.propState.token = null;
    //     const buildToken = sockets.of('doc-signing-settings/api/docuseal').fn('builder_token');
    //     buildToken({
    //         plugin_key: plugin.data.key,
    //         module_key: module.module.key,
    //         doc,
    //         name,
    //     }).then(res => {
    //         this.propState.token = res;
    //     });
    // }

    onLoad(detail) {
        console.log('onLoad', detail);
    }

    onUpload(detail) {
        console.log('onUpload', detail);
    }

    onChange(detail) {
        console.log('onChange', detail);
    }

    render() {
        const {token} = this;
        if (token === null) return null;

        const {doc, roles, customCss} = this;

        return <>
            <hr/>
            <Button
                className="btn btn-primary margin-t-20 margin-b-5 hor-center"
                onClick={this.onSetUpSignature}
            >
                <i className="fa fa-check"/> Set Up Signature(s)
            </Button>
            <Dialog
                key={'DocusealBuilderWrapper-profile-dialog'}
                ref="dialog"
                className={'DocusealBuilderWrapper-dialog'}
                topButtons={this.topButtons}
                open={true}
                dialog={this}
            >
                <DocusealBuilder
                    ref="docusealBuilder"
                    token={token}
                    roles={roles}
                    autosave={true}
                    withRecipientsButton={false}
                    withSendButton={false}
                    withSignYourselfButton={false}
                    withUploadButton={false}
                    customCss={customCss}
                    onLoad={this.onLoad}
                    onUpload={this.onUpload}
                    onSave={this.onSaveTemplate}
                    onChange={this.onChange}
                />
            </Dialog>
        </>;
    }
}

//</editor-fold>

export default DocusealBuilderWrapper;
