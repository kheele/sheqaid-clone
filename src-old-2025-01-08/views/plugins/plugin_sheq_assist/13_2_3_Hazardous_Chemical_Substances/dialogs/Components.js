// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {RisksCodes} from "utils/Utils";
import {Button, ClearableInput, ProfileField} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="SelectedProduct">
@observer
class SelectedProduct extends React.Component {

    @computed
    get productData() {
        const {state = {}, product} = this.props;
        let _prod = product || state.selectedProduct;
        if (_prod) {
            const {id, data} = _prod;
            return data || _prod;
        }
        return null;
    }

    @computed
    get color() {
        const {productData} = this;
        if (productData) {
            return RisksCodes.colorClassName(productData.risk_level);
        }
        return "";
    }

    render() {
        if (!this.productData) return null;
        const {productData: {risk_level}, color} = this;
        return <ProfileField name="risk_level" placeholder="Risk Level" value={risk_level}
                             className={`col-lg-12 selected-product ${color}`}/>;
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ANewListTable">
@observer
class ANewListTable extends ATableSavable {
    @observable
    selfState = {};

    constructor(props) {
        super(props);

        if (!props.readonly) {
            if ('defaultValue' in props) {
                this.state.list.push(null);
            }
        }
        this.insertAt = this.insertAt.bind(this);
    }

    insertAt(list, form) {
        list.insertAt(list.length - 1, form);
    }

    renderItem(n, onClick) {
        const {readonly} = this.props;
        const item = this.state.list[n];
        if (readonly) {
            if (!item) return null;

            return <TRow key={"item-" + n} className="tr-readonly w-full">
                <div className="td fixed-flex min-w-30"><span className="count margin-0">{n + 1}</span></div>
                <div className="td padding-l-0 padding-r-0">{item.value}</div>
            </TRow>;
        }
        if (item) {
            const {value, text} = item;
            return <TRow key={"item-" + n} className="tr-readonly w-full">
                <div className="td fixed-flex min-w-30"><span className="count margin-0">{n + 1}</span></div>
                <div className="td">{text || value}</div>
                <div className="td fixed-flex padding-l-0 min-w-40">
                    <Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
                        <i className="fa fa-times-circle"/>
                    </Button>
                </div>
            </TRow>;
        } else {
            return <TRow key="item-new" className="padding-l-10 w-full">
                <div className="td fixed-flex min-w-0"></div>
                <div className="td">
                    <ClearableInput ref={this.onSetRef} name="text" type="text" placeholder="Type here" required
                                    className="no-border-radius-r form-control" onChange={this.onChange}/>
                </div>
                <div className="td fixed-flex padding-l-0 min-w-40">
                    <Button idx={n} action="save" className="btn btn-primary pull-right w-40" onClick={onClick}>
                        <i className="fa fa-check"/>
                    </Button>
                </div>
            </TRow>;
        }
    }

    render() {
        const {readonly} = this.props;
        return (<Table className={this.className + " padding-0 margin-0 -margin-t-5"}>
            <THead className="align-left">
                <div className="td fixed-flex min-w-0"></div>
                <div className="td padding-l-0 padding-r-0">{this.title}</div>
                {!readonly && <div className="td fixed-flex min-w-50 padding-0"></div>}
            </THead>
            <TBody ref="body" title={this.title} renderItem={this.renderItem} onClick={this.onClick} state={this.state}
                   onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ListTables">
@observer
class NewActiveIngredientListTable extends ANewListTable {
    title = "Active Ingredients";
    className = "NewActiveIngredientListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewPhysicalHazardListTable extends ANewListTable {
    title = "Physical Hazards";
    className = "NewPhysicalHazardListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewReproductiveHazardListTable extends ANewListTable {
    title = "Reproductive Hazards";
    className = "NewReproductiveHazardListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewBiologicalHazardListTable extends ANewListTable {
    title = "Biological Hazards";
    className = "NewBiologicalHazardListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewSplashesInEyesListTable extends ANewListTable {
    title = "Splashes in Eyes";
    className = "NewSplashesInEyesListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewContactWithSkinListTable extends ANewListTable {
    title = "Contact with Skin";
    className = "NewContactWithSkinListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewMouthContactOrEatenListTable extends ANewListTable {
    title = "Mouth Contact or Eaten";
    className = "NewMouthContactOrEatenListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewFumesBreathedInListTable extends ANewListTable {
    title = "Fumes Breathed In";
    className = "NewFumesBreathedInListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewSmallSpillsListTable extends ANewListTable {
    title = "Small Spills (<= 10 Litres)";
    className = "NewSmallSpillsListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewLargeSpillsListTable extends ANewListTable {
    title = "Large Spills (> 10 Litres)";
    className = "NewLargeSpillsListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewUsedContainersInListTable extends ANewListTable {
    title = "Used Containers";
    className = "NewUsedContainersInListTable";

    constructor(props) {
        super(props);
    }
}

@observer
class NewUnusedProductListTable extends ANewListTable {
    title = "Unused Product";
    className = "NewUnusedProductListTable";

    constructor(props) {
        super(props);
    }
}

// </editor-fold>

export {
    SelectedProduct,
    //
    NewActiveIngredientListTable,
    NewPhysicalHazardListTable,
    NewReproductiveHazardListTable,
    NewBiologicalHazardListTable,
    NewSplashesInEyesListTable,
    NewContactWithSkinListTable,
    NewMouthContactOrEatenListTable,
    NewFumesBreathedInListTable,
    NewSmallSpillsListTable,
    NewLargeSpillsListTable,
    NewUsedContainersInListTable,
    NewUnusedProductListTable
};