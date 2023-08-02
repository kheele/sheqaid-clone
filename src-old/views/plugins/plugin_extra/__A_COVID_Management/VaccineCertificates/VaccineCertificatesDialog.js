import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable} from 'mobx';

import {renderExpiryDateSpan, renderLeftButtonsForExpiryOnly} from '../../../../../utils/ComponentUtils';
import {calculateRightPos, Dates} from '../../../../../utils/Utils';
import ADialogList from "../../../../ADialogList";
import APageListReadWrite from "../../../../APageListReadWrite";
import NavItem from '../../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../../components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, SelectEmployeeInput} from '../../../../../components/inputs';
import {THead, TRow} from '../../../../../components/tables';

import NewVaccineCertificateDialog from './NewVaccineCertificateDialog';
import EditVaccineCertificateDialog from './EditVaccineCertificateDialog';
import ProfileVaccineCertificateDialog from "./ProfileVaccineCertificateDialog";

import style from "./VaccineCertificatesDialog.lazy.css";

@observer
class VaccineCertificatesDialog extends ADialogList {
    path;
    pageKey = "VaccineCertificatesDialog";
    title = "Vaccine Certificates";

    @observable
    selfState = {
        lists: {
            annexture_3: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}],
	    expiry_date: [{label: 'Expired', value: -1}, {label: '1 month', value: 1}, {label: '2 months', value: 2}, {label: '3 months', value: 3}, {label: '4 months +', value: 4}],
	}
    };
    
    constructor(props) {
        super(props);
        this.classNames += "LeftButtonsForExpiryOnlyPage";

        this.path = props.path + 'medicals/';
        
        this.onNewItem = this.onNewItem.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    
    onNewItem(item) {
        const {list} = this.refs.root;
        const existingItem = list.find(v => v.id === item.id);
        if(existingItem) {
            setTimeout(() => {
                extendObservable(existingItem.data, item.data);
                const idx = list.indexOf(existingItem);
                list.removeIf((item, _idx) => _idx === idx);
                list.insertAt(idx, item);
            }, 0);
        } else {
            list.pushFirst(item);
        }
    }
    
    onEdit(e, el) {
        const {idx, btn} = el.props;
        const jqElem = $(btn.getDOMNode());
        const {left} = jqElem.offset();
        
        const item = this.refs.root.list[idx];
        let {id, data: {
                fname, lname, 
                optional_info, client, project, site, client_id, project_id, site_id,
                
                employee_vaccine_certificate_list, sub_collection_keys: {
                    employee_vaccine_certificate_list: {latest, id: ids}
                }
            }
        } = item;
        
        let list = Object.keys(employee_vaccine_certificate_list).map(id => {
            return {id, expiry_date: employee_vaccine_certificate_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        console.log('employees', list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        }))
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_vaccine_certificate_list[id]};
        });
        
        const onClick = (e, el) => {
            const {idx} = el.props;
            const item = list[idx];
            const dialog = this.refs.root.getDialogByRef('editDialog');
            console.log('test', dialog)
            dialog && dialog.open(item).then(data => {
                extendObservable(item.data, data);
            });
        };
        
        const renderItem = (item, n) => {
            const {data: {created_at, annexture_3, restrictions, expiry_date, doc}} = item;
            const comp = () => {
                return <p>Expiry: {Dates.formatDate(expiry_date) || 'N/A'}</p>;
            };
            return <NavItem 
                onClick={onClick} 
                idx={n}
                title={comp()}
            />;
        };
        
        const offset = jqElem.offset();
        const style = {left: "auto", right: calculateRightPos(jqElem[0], false) + 10, top: offset.top, width: 'auto', minWidth: 200};
        popover.settings({
            style,
            className: 'EmployeeDocsActionsPopover',
            contentNode: <div>
                <p className="padding-t-10 text-center">--- Select ---</p>
                <hr className="margin-t-0 margin-b-0"/>
                {list.map(renderItem)}
            </div>
        }).open();
    }

    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}, evt, btn) {
        const {isRemoved} = this.props;
        const permissionKey = "Vaccine Certificates";
        return <Options idx={idx} permissionOtherKey={permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {!isRemoved && <NavItem action="edit" btn={btn} onClick={this.onEdit} faIconLeft="edit" title="Edit"/>}
            {!isRemoved && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
            <ClearableInput name="annexture_3" type="radio" placeholder="Annexture 3?" className="form-control" onChange={onChange} values={this.selfState.lists.annexture_3}/>
            <ClearableInput name="expiry_date" type="select" placeholder="Expiry..." className="form-control" onChange={onChange} values={this.selfState.lists.expiry_date} returnValue/>
        </div>;
    }

    renderTHead() {
        const propIds = this.extraProp('ids');
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Employee</div>
            <div className="td">Annexture 3?</div>
            {!propIds && <div className="td fixed-flex min-w-190">Previous Vaccine Certificates</div>}
            <div className="td fixed-flex min-w-100">Expiry Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const propIds = this.extraProp('ids');
        const item = this.refs.root.list[n];
        console.log('item', item)
        let {id, data: {
                fname, lname, 
                optional_info, client, project, site, client_id, project_id, site_id,
                
                employee_vaccine_certificate_list, sub_collection_keys: {
                    employee_vaccine_certificate_list: {latest, id: ids}
                }
            }
        } = item;
        
        const last = employee_vaccine_certificate_list[latest.id];
        const {created_at, annexture_3, expiry_date} = last;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{lname + ' ' + fname}</div>
            <div className="td">{annexture_3}</div>
            {!propIds && <div className="td fixed-flex min-w-190">{ids.length - 1}</div>}
            <div className="td fixed-flex min-w-100">{renderExpiryDateSpan(expiry_date)}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    renderPage() {
        const {onLoadList, isRemoved} = this.props;
        return <APageListReadWrite 
            ref="root"
            page={this}
            hasBackBtn={false}
            hasCreateBtn={() => !isRemoved}
            createBtnTitle="Create"
            pageId={this.pageKey + '-page'}
            listCountTopTitle="vaccine certificate"
            pageTitleSingular="vaccine certificate"
            path={this.path}
            onLoadList={onLoadList}
            noAnimation={true}
            renderLeftButtons={renderLeftButtonsForExpiryOnly.bind(this)}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewVaccineCertificateDialog ref="newDialog" path={this.path}/>
            <ProfileVaccineCertificateDialog ref="profileDialog" path={this.path}/>
            <EditVaccineCertificateDialog ref="editDialog" path={this.path}/>
        </APageListReadWrite>;
    }

}

export default VaccineCertificatesDialog;
