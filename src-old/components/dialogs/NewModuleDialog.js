// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../utils/Form';
import {setDefaultVal} from '../../utils/Utils';

import {ClearableInput} from '../inputs';
import {NewBillableCompanyListTable} from '../FormTableComponents';
import {FormControls, Row} from '../FormComponents';
import {ANewDialog} from '../dialogs';

import style from "./NewModuleDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewModuleDialog extends ANewDialog {
    pageKey = "NewModuleDialog";
    title = "Create/Edit Module";

    constructor(props) {
        super(props, style);
    }
    
    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            status: ['Installed', 'Not Installed', 'Upcoming'].map(label => {
                return {label, value: label.replace(' ', '')};
            }),
            has_update: ['Yes', 'No'].map(text => {
                return {value: text, text, checked: false};
            })
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentDidMount() {
        const setDefaultValue = setDefaultVal.bind(this);
        
        const {dialog} = this.props;
        dialog.setTitle(this.item ? 'Edit Module' : 'Create Module');
        
        if(this.item) {
            //1
            setDefaultValue('title');
            setDefaultValue('key');
            setDefaultValue('id');
            setDefaultValue('hover');
            setDefaultValue('desc');
            //2
            setDefaultValue('status');
            setDefaultValue('has_update', v => {
                return !!v ? 'Yes' : 'No';
            });
            setDefaultValue('sort');
            setDefaultValue('price');
            setDefaultValue('discount');            
            //3
            setDefaultValue('faIconLeft');
            setDefaultValue('faIconRight');
            setDefaultValue('svgIconLeft');
            setDefaultValue('svgIconRight');            
            //4
            setDefaultValue('company_list', list => {
                return [...(list || []), null];
            });
        } else {
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        
        return true;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {
            //1
            title,
            key,
            id,
            hover,
            desc,
            //2
            status,
            has_update,
            sort,
            price,
            discount,
            //3
            faIconLeft,
            faIconRight,
            svgIconLeft,
            svgIconRight,
            //4
            company_list
        } = form.data;
        const data = {
            //1
            title,
            key,
            id,
            hover,
            desc,
            //2
            status,
            has_update,
            sort,
            price,
            discount,
            //3
            faIconLeft,
            faIconRight,
            svgIconLeft,
            svgIconRight,
            //4
            company_list
        };
        
        console.log("NewModuleDialog.onSubmit", data)
        onSaved(data);
        this.props.close();
    }
    // </editor-fold>

    get item() {
        return this.props.state.item;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        return <FormControls onChange={this.form.onChange}>
                <Row 
                    rendered  
                    activeAlways
                    idx={1}
                    title="1st Section Details" 
                    onFormOpen={onFormOpen} 
                >
                    <ClearableInput ref="title" name="title" type="text" placeholder="Title" className="col-lg-12 form-control"/>
                    <ClearableInput ref="key" name="key" type="text" placeholder="Key" className="col-lg-12 form-control"/>
                    <ClearableInput ref="id" name="id" type="text" placeholder="ID" className="col-lg-12 form-control"/>
                    <ClearableInput ref="hover" name="hover" type="textarea" placeholder="Hover Text" className="col-lg-12 form-control"/>
                    <ClearableInput ref="desc" name="desc" type="textarea" placeholder="Description" className="col-lg-12 form-control"/>
               </Row>
                <Row 
                    rendered  
                    activeAlways
                    idx={2}
                    title="2nd Section Details" 
                    onFormOpen={onFormOpen} 
                >
                    <ClearableInput ref="status" name="status" type="select" placeholder="Status..." className="col-lg-6 form-control" values={this.state.lists.status} returnValue/>
                    <ClearableInput ref="has_update" name="has_update" type="radio" placeholder="Has Update" className="col-lg-6 form-control" values={this.state.lists.has_update} returnValue/>
                    <ClearableInput ref="sort" name="sort" type="number" placeholder="Sort" className="col-lg-4 form-control"/>
                    <ClearableInput ref="price" name="price" type="number" placeholder="Price" className="col-lg-4 form-control"/>
                    <ClearableInput ref="discount" name="discount" type="number" placeholder="Discount" className="col-lg-4 form-control"/>
               </Row>
                <Row 
                    rendered  
                    activeAlways
                    idx={3}
                    title="3rd Section Details" 
                    onFormOpen={onFormOpen} 
                >
                    <ClearableInput ref="faIconLeft" name="faIconLeft" type="text" placeholder="FA Icon Left" className="col-lg-6 form-control"/>
                    <ClearableInput ref="faIconRight" name="faIconRight" type="text" placeholder="FA Icon Right" className="col-lg-6 form-control"/>
                    <ClearableInput ref="svgIconLeft" name="svgIconLeft" type="text" placeholder="SVG Icon Left" className="col-lg-6 form-control"/>
                    <ClearableInput ref="svgIconRight" name="svgIconRight" type="text" placeholder="SVG Icon Right" className="col-lg-6 form-control"/>
                </Row>
                <Row 
                    rendered  
                    activeAlways
                    idx={4}
                    title="4th Section Details" 
                    onFormOpen={onFormOpen} 
                >
                    <NewBillableCompanyListTable ref="company_list" name="company_list"/>
                </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewModuleDialog;
