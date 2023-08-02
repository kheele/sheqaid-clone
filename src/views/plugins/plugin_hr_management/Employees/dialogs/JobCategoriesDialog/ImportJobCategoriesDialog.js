import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import Form from 'utils/Form';

import {Button} from 'components/inputs';
import {Table, TBody, THead, TRow} from 'components/tables';
import {ANewDialog} from 'components/dialogs';

import style from "./ImportJobCategoriesDialog.lazy.css";
import insertJobCategory from "mutations/all/JobCategory/insertJobCategory";

@observer
class ImportJobCategoriesDialog extends ANewDialog {
    pageKey = "ImportJobCategoriesDialog";
    title = "Import Job Categories";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/employees/job-categories/';
    @observable
    state = {
        list: []
    };

    constructor() {
        super();

        this.onUpload = this.onUpload.bind(this);

        this.onClick = this.onClick.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.form = new Form();
    }

    componentDidMount() {

    }

    onLoadList() {
        return Promise.resolve();
    }

    onClick(e, btn) {

    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        const {name} = item;
        return <TRow key={"item-" + n}>
            <div className="td">{name}</div>
        </TRow>;
    }

    mapErrors(err, n) {
        const mapErrors = (v, i) => {
            const {length} = err.value;
            if(i === length-1) {
                return v;
            } else if(i === length-2) {
                return v + ' OR ';
            } else {
                return v + ', ';
            }
        };
        return <TRow key={"item-" + n} className="text-left font-size-15">
            {n+1} - {err.value.map(mapErrors).join('').trim()}
        </TRow>;
    }
    
    onUpload() {
        electronDialog.showOpenDialogSpreadsheetRaw().then(async res => {
            if (res) {
                progressDialog.open();
                const filePath = await FileConverters.asDataUrl(res.path);
                neonBinding.events.emit(this.path + "import/file", filePath).then(res => {
//                    console.log("data", res)
                    if(!res) {
                        infoDialog.open('An error occurred. Please try again');
                        return;
                    }
                    if (res.errors) {
                        infoDialog.open(<div className="info-dialog-content">
                            <THead className="padding-10 margin-b-15">The following Spreadsheet Header Column Cells are required:</THead>
                            {res.errors.map(this.mapErrors)}
                        </div>);
                    } else {
                        this.state.list = res;
                    }
                }).catch(err => {
                    infoDialog.open('An error occured. Please try again');
                }).finally(() => {
                    progressDialog.close();
//                    btn.text("Save").enabled();
                });
            }
        });
    }

    onSubmit(e, btn, onSaved) {
        const {form} = this;

        let {list} = this.state;
        console.log('list', list)

        btn.text("Saving...").disabled();
        progressDialog.open();

        Promise.all(list.map(async (data) => await insertJobCategory(data))).then(list => {
            console.log("res", list)
            if(list) {
                if (onSaved) {
                    list.forEach(item => onSaved(item));
                }
                infoDialog.open("Record successfully saved.");
                infoDialog.close(2000);
                this.props.close();
            } else {
                infoDialog.open("An error occurred. Please try again.");
            }
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });

        // neonBinding.events.emit(this.path + "import/create", toJS(list)).then(res => {
        //     console.log("res", res)
        //     onSaved && onSaved(res);
        //     infoDialog.open(res.length +  " record(s) successfully saved.");
        //     infoDialog.close(2000);
        //     this.props.close();
        // }).finally(() => {
        //     btn.text("Save").enabled();
        // });
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <Button className="btn btn-primary hor-center margin-t-5" onClick={this.onUpload}>Upload Spread Sheet</Button>
                    </div>
                </div>
                <div className="row padding-0">
                    <Table className="w-full min-h-200 margin-0">
                        <THead>
                            <div className="td">Name</div>
                        </THead>
                        <TBody renderItem={this.renderItem} list={this.state.list} onLoadList={this.onLoadList} onClick={this.onClick}/>
                    </Table>
                </div>
            </div>
        </div>);
    }
}

export default ImportJobCategoriesDialog;
