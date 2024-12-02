//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable, toJS} from 'mobx';

import {Dates, ShouldUpdate} from 'utils/Utils';

import {Button, ClearableInput, UploadButton} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import {upsertAssetDoc} from "mutations/upsert";
//</editor-fold>

//<editor-fold desc="NewDocumentTable">
@observer
class NewDocumentTable extends ATableSavable {

    @observable
    selfState = {
        lists: {
            type: [
                'Clearance Certificate',
                'Vehicle Registration Certificate',
                'Load Test Certificate',
                'Work Manual',
                'Work Procedure',
                'Break Test Report',
                'Certificate of Fitness (C.O.F)',
                'Invoice',
                'Vehicle License',
                'LUX Test Report',
            ]
        }
    };

    constructor(props) {
        super(props);

        const {defaultValue} = this.props;
        if (defaultValue) {
            this.state.list = defaultValue;
        }

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.state.list.filter(v => !!v)), name, this);

        this.insertAt = this.insertAt.bind(this);
    }

    insertAt(list, form) {
        list.insertAt(list.length - 1, form);
        this.ctrl_refs.doc.reset();
    }

    onClickComplete(e, el) {
        let {savable, item: assetItem, onUpdated} = this.props;

        if (savable && assetItem) {
            let {action, idx, item} = el.props;
            let {
                // id,
                data: old_data,
                data: {doc_list}
            } = assetItem;

            const {id, type, title, expiry, desc, doc} = item;
            console.log('onClickComplete item', item)

            if (action === "save" || action === "saveEdit") {
                progressDialog.open();
                let promise;
                if (id) {
                    const attrs = {};
                    ShouldUpdate.check(attrs, item, type, 'type');
                    ShouldUpdate.check(attrs, item, title, 'title');
                    ShouldUpdate.check(attrs, item, desc, 'desc');
                    ShouldUpdate.checkDate(attrs, item, expiry, 'expiry');
                    ShouldUpdate.checkFile(attrs, item, doc, 'doc');
                    promise = upsertAssetDoc({
                        id, ...attrs,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be updated.");
                        } else {
                            infoDialog.open("Record successfully updated.");

                            doc_list.replaceIf(savedItem.data, v => v.id === id);
                        }

                        infoDialog.close(2000);
                    });
                } else {
                    promise = upsertAssetDoc({
                        asset_id: assetItem.id, ...item, expiry: Dates.formatDateSQL(item.expiry)
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be added.");
                        } else {
                            infoDialog.open("Record successfully added.");
                            if (doc_list) {
                                doc_list.push(savedItem.data);
                            } else {
                                extendObservable(old_data, {
                                    doc_list: [savedItem.data]
                                });
                            }
                        }

                        infoDialog.close(2000);
                    });
                }
                promise.catch(err => {
                    infoDialog.open("An error occurred. Please try again later.");
                    infoDialog.close(2000);
                    console.error(err);
                }).finally(() => {
                    setTimeout(() => progressDialog.close());
                });
            } else if (action === "delete") {
                confirmDialog.open("Are you sure you want to remove the item?").then(res => {
                    if (!res) return;

                    progressDialog.open();
                    upsertAssetDoc({
                        id,
                        removed: true,
                    }).then(savedItem => {
                        if (!savedItem) {
                            infoDialog.open("Sorry! Record couldn't be removed.");
                        } else {
                            infoDialog.open("Record successfully removed.");
                            doc_list.removeIf(v => v.id === id);
                        }

                        infoDialog.close(2000);
                    }).catch(err => {
                        infoDialog.open("An error occurred. Please try again later.");
                        infoDialog.close(2000);
                        console.error(err);
                    }).finally(() => {
                        setTimeout(() => progressDialog.close());
                    });
                });
            }
            // onUpdate && onUpdate(e, el);
        }
    }

    renderItem(n, onClick) {
        const {readonly, docActiveId} = this.props;
        const item = this.state.list[n];
        if (item) {
            const {type, title, date, expiry, desc, doc} = item;
            return <TRow key={"item-" + n} className="tr-readonly w-full">
                <div className="td fixed-flex min-w-20"><span className="counter">{n + 1}</span></div>
                <div className="td fixed-flex min-w-160">{type}</div>
                <div className="td fixed-flex min-w-190">{title}</div>
                <div className="td">{desc}</div>
                <div className="td fixed-flex min-w-200">
                    <UploadButton
                        ref={this.onSetRef}
                        name="doc"
                        buttonTitle={!readonly && "Upload Document"}
                        type={['PDF', 'Word']}
                        defaultValue={doc}
                        showOnlyIcon
                        readonly={readonly}
                        className="col-lg-12"
                        onChange={this.onChange}
                    />
                </div>
                <div className="td fixed-flex min-w-110">{Dates.formatDate(date)}</div>
                <div className={`td fixed-flex min-w-${readonly ? 100 : 110}`}>{Dates.formatDate(expiry)}</div>
                {!readonly ? <div className="td fixed-flex min-w-100 padding-l-0">
                    <Button idx={n} action="edit" className="btn btn-primary margin-r-10 pull-right w-40"
                            onClick={onClick}>
                        <i className="fa fa-pen"/>
                    </Button>
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div> : null}
                {readonly ? <div className="td fixed-flex min-w-0 padding-0"/> : null}
            </TRow>;
        } else {
            // alert(this.list.length)
            return <TRow key="item-new" className="w-full grid-1 grid-gap-10 padding-t-10 padding-b-10">
                <ClearableInput ref={this.onSetRef} name="type" type="select" placeholder="Document Type"
                                className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange}
                                values={this.selfState.lists.type} returnValue/>
                <ClearableInput ref={this.onSetRef} name="title" type="text" placeholder="Title"
                                className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange}/>
                <ClearableInput ref={this.onSetRef} name="desc" type="textarea" placeholder="Description"
                                className="col-lg-12 w-full form-control margin-r-10" onChange={this.onChange}/>
                <UploadButton
                    ref={this.onSetRef}
                    name="doc"
                    buttonTitle="Upload Document"
                    type={['PDF', 'Word']}
                    showOnlyIcon
                    className="col-lg-12 w-full"
                    onChange={this.onChange}
                />
                <ClearableInput ref={this.onSetRef} name="date" type="date" placeholder="Date"
                                className="col-lg-12 w-full form-control" onChange={this.onChange}/>
                <ClearableInput ref={this.onSetRef} name="expiry" type="date" placeholder="Expiry Date"
                                className="col-lg-12 w-full form-control" onChange={this.onChange}/>
                <Button idx={n} action="save" className="btn btn-primary hor-center border-radius-20 w-100"
                        onClick={onClick}>
                    <i className="fa fa-check"/> ADD
                </Button>
            </TRow>;
        }
    }

    render() {
        const {readonly} = this.props;
        return (<Table
            className={`NewDocumentTable w-full-calc-add-10 min-h-90 h-auto -margin-t-5 -margin-l-10 margin-b-10 padding-0`}>
            <THead className="align-left">
                <div className="td fixed-flex min-w-20">#</div>
                <div className="td fixed-flex min-w-160 font-size-14">Document Type</div>
                <div className="td fixed-flex min-w-190 font-size-14">Title</div>
                <div className="td font-size-14">Description</div>
                <div className="td fixed-flex min-w-200 font-size-14">Document</div>
                <div className="td fixed-flex min-w-110 font-size-14">Date</div>
                <div className="td fixed-flex min-w-110 font-size-14">Expiry</div>
                <div className={"td fixed-flex padding-0 min-w-" + (!readonly ? "110" : "0")}/>
            </THead>
            <TBody
                ref="body"
                title="Asset Documents"
                renderItem={this.renderItem}
                onClick={this.onClick}
                state={this.state}
                onLoadList={this.onLoadList}
                disablePullToRefresh={false}
            />
        </Table>);
    }
}

//</editor-fold>

export default NewDocumentTable;
