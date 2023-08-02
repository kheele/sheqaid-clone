import React from "react";
import {observer} from 'mobx-react';

import style from "./NewEmergencyDrillSec.lazy.css";
import {Button, ClearableInput} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

@observer
class NewEmergencyDrillSec extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        return <div id="NewEmergencyDrillSec" className="NewEmergencyDrillSec">
            <Controls/>
        </div>;
    }
}

@observer
class Controls extends ATableSavable {

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        if (item) {
            return <TRow key={"item-" + n} className="tr-readonly">
                <div className="td"><span>{item.fname}</span></div>
                <div className="td"><span>{item.lname}</span></div>
                <div className="td fixed-flex">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new">
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="fname" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="lname" type="text" placeholder="Type here" required className="form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex">
                    <Button idx={n} action="save" className="btn btn-primary pull-right" onClick={onClick}>
			<i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <Table>
                    <THead>
                        <div className="td">First Name</div>
                        <div className="td">Last Name</div>
                        <div className="td fixed-flex"></div>
                    </THead>
                    <TBody ref="body" title="Team Members" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
                </Table>
            </div>
        </div>);
    }
}

export default NewEmergencyDrillSec;
