import React from "react";
import {observer} from 'mobx-react';
import {Carousel} from 'components/lists';
import MKBox from "components/MK/MKBox";
import {computed, extendObservable, observable} from "mobx";
import {Tabs} from "components/tabs";
import DashboardTab from "./AEmployeeDocDialog/ADashboardTab";
import {CircularProgress} from "@mui/material";
import {Dates, execWhen} from "utils/Utils";
import {CreateAndEditBar} from "components/FormComponents";

@observer
class AEmployeeDocControls extends React.Component {

    @observable
    state = {
        index: 0,
        list: [],
    };

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.loadDashboard = this.loadDashboard.bind(this);
    }

    //</editor-fold>

    get slider() {
        return this.refs.slider;
    }

    // </editor-fold>

    @computed get isEmbedded() {
        const {isEmbedded, item} = this.props;
        return isEmbedded || !!item;
    }

    //</editor-fold>

    @computed get item() {
        const {item, state} = this.props;
        return this.isEmbedded ? item : state.item;
    }

    //</editor-fold>

    @computed get list() {
        if (!this.item) return this.state.list;

        const {item: {data: {[this.listName]: list = []}}} = this;
        return list || [];
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    async componentDidMount() {
        const {dialog} = this.props;

        if (dialog) {
            try {
                const node = await execWhen(() => dialog.getDOMNode());
                const jqEl = $(node.querySelector('.dialog-header h3'));

                if (this.item.data.removed) {
                    jqEl.removeClass('active');
                } else {
                    jqEl.addClass('active');
                }
            } catch (e) {
            }

            const {formData, defaultValue, isNewEmployee} = this.props;
            console.log('AEmployeeDocControls', formData);
            if (isNewEmployee) {
                if (defaultValue || (formData && formData[this.listName])) {
                    this.state.list = defaultValue || formData[this.listName];
                }

                execWhen(() => this.slider && this.slider.tabWrapper).then(tabWrapper => {
                    tabWrapper.updateDashboard();
                });
            }
        }
    }

    //</editor-fold>

    //<editor-fold desc="onChange">
    onChange(index) {
        const {state} = this;
        state.index = index;

        execWhen(() => this.slider && this.slider.createAndEditBar).then(ref => {
            if (index === 0) {
                ref.hideEditableButtons();
            } else {
                ref.showEditableButtons();
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="loadDashboard">
    async loadDashboard() {
        const {isNewEmployee} = this.props;
        if (isNewEmployee) {
            let {list} = this;

            list = list.map(v => v.contract_details || v);
            const listWithExpiry = list.filter(({expiry_date}) => !!expiry_date);

            const mon = new Date().addMonths(1).getTime();
            const mon2 = new Date().addMonths(2).getTime();
            const mon3 = new Date().addMonths(3).getTime();

            const monStart = new Date().addMonths(-4);
            const monEnd = new Date().addMonths(12);

            const dates = Dates.getMonthsStartAndEndDateRange(monStart, monEnd);

            const bottomStats = dates.map(({year, month, start: dateStart, end: dateEnd}) => {
                const count = listWithExpiry.filter(({expiry_date}) => expiry_date.getTime() >= dateStart.getTime() && expiry_date.getTime() <= dateEnd).length;

                return {month_year: `${month}-${year}`, count};
                // return {month_year: dateStart.formatMonthYear(), count: 0};
            });

            return {
                topStats: {
                    data: {
                        list_active_aggregate: {aggregate: {count: this.list.length}},
                        list_removed_aggregate: {aggregate: {count: 0}},
                        list_no_expiry_aggregate: {aggregate: {count: list.filter(({expiry_date}) => !expiry_date).length}},
                        list_expired_aggregate: {aggregate: {count: listWithExpiry.filter(({expiry_date}) => expiry_date.getTime() <= new Date().getTime()).length}},
                        list_mon_expiry_aggregate: {aggregate: {count: listWithExpiry.filter(({expiry_date}) => expiry_date.getTime() > new Date().getTime() && expiry_date.getTime() <= mon).length}},
                        list_2mon_expiry_aggregate: {aggregate: {count: listWithExpiry.filter(({expiry_date}) => expiry_date.getTime() > mon && expiry_date.getTime() <= mon2).length}},
                        list_3mon_expiry_aggregate: {aggregate: {count: listWithExpiry.filter(({expiry_date}) => expiry_date.getTime() > mon2 && expiry_date.getTime() <= mon3).length}},
                        list_4mon_expiry_aggregate: {aggregate: {count: listWithExpiry.filter(({expiry_date}) => expiry_date.getTime() > mon3).length}},
                    },
                },
                bottomStats,
            };
        }

        const item = await execWhen(() => this.item);

        const {id} = item;
        const topStats = await this.loadDashboardTopStats(id);
        const bottomStats = await this.loadDashboardBottomStats(id);//[{id, month_year: date.formatMonthYear(), count}]
        return {topStats, bottomStats};
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    onSaveAsPDF(e, btn) {
        this.refs.pdfReader.open(this.item);
    }

    //<editor-fold desc="onCreate">
    onCreate() {
        let {listName, type} = this;
        const {isNewEmployee, onChange} = this.props;

        const {tabWrapper, tabWrapper: {index}, newDialog} = this.slider;

        if (isNewEmployee) {
            newDialog.open().then(newItem => {
                const {list} = this;

                list.push(newItem);

                if (type) {
                    // listName = `${listName}__${type}`;
                }

                onChange && onChange(list, listName, this);

                if (index === 0) {
                    tabWrapper.updateDashboard();
                } else if (index === 1) {
                    tabWrapper.moveToSlide(list.indexOf(newItem));
                }
            });
        } else {
            newDialog.open(this.item).then(newItem => {
                const newData = newItem.data;

                if (type) {
                    // listName = `${listName}__${type}`;
                }

                const {item: {data, data: {[listName]: list}}} = this;
                if (list) {
                    list.push(newData);
                } else {
                    extendObservable(data, {[listName]: [newData]});
                }

                if (index === 0) {
                    tabWrapper.updateDashboard();
                } else if (index === 1) {
                    tabWrapper.moveToSlide(list.indexOfWithPredicate(v => v.id === newData.id));
                }
            });
        }
    }

    //<editor-fold desc="onEdit">
    onEdit() {
        const {isNewEmployee, onChange} = this.props;
        const {tabWrapper, tabWrapper: {index}, editDialog} = this.slider;
        if (index === 0) {
            return;
        }

        if (isNewEmployee) {
            const {list} = this;

            const sliderIndex = tabWrapper.sliderIndex || 0;
            let updateItem = list[sliderIndex];

            editDialog.open({data: updateItem}).then(editedItem => {
                extendObservable(updateItem, editedItem);
                // const editData = editItem.data;
                // list.push(newData);

                if (index === 0) {
                    tabWrapper.updateDashboard();
                } else if (index === 1) {
                    // tabWrapper.moveToSlide(list.indexOfWithPredicate(v => v.id === editData.id));
                }
            });
        } else {
            const {[this.listName]: list = []} = this.item.data;

            const sliderIndex = tabWrapper.sliderIndex || 0;
            let updateData = list[sliderIndex];
            const updateItem = {id: updateData.id, data: updateData};

            editDialog.open(updateItem).then(editedItem => {
                if (editedItem) {
                    extendObservable(updateData, editedItem.data);
                }
                // const editData = editItem.data;
                // list.push(newData);

                if (index === 0) {
                    tabWrapper.updateDashboard();
                } else if (index === 1) {
                    // tabWrapper.moveToSlide(list.indexOfWithPredicate(v => v.id === editData.id));
                }
            });
        }
    }

    //<editor-fold desc="onRemove">
    onRemove(evt, btn) {
        const {onUpdate} = this;
        const {isNewEmployee, onChange} = this.props;
        const {tabWrapper, tabWrapper: {index}} = this.slider;
        if (index === 0) {
            return;
        }

        confirmDialog.open('Are you sure you want to remove the record').then(res => {
            if (res) {
                const sliderIndex = tabWrapper.sliderIndex || 0;

                if (isNewEmployee) {
                    const {list} = this;

                    list.removeAt(sliderIndex);
                    infoDialog.open("Record successfully removed.");
                    infoDialog.close(2000);
                } else {
                    const {[this.listName]: list = []} = this.item.data;

                    const removeItem = list[sliderIndex];

                    onUpdate && onUpdate({id: removeItem.id, removed: true}).then(res => {
                        if (res) {
                            list.removeAt(sliderIndex);
                            infoDialog.open("Record successfully removed.");
                            infoDialog.close(2000);
                        } else {
                            infoDialog.open("Sorry! The record couldn't be removed. Please try again later.");
                        }
                    });
                }
            }
        });
    }

    //<editor-fold desc="render">
    render() {
        const {
            NewDialog,
            EditDialog,
            listName,
            props: {tabsHeight, isNewEmployee},
            isEmbedded,
        } = this;

        if (!isEmbedded && !this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        if (isEmbedded) {
            const {props: {activeId}, list} = this;
            return <Slider
                ref="slider"
                isEmbedded
                activeId={activeId}
                list={list}
                item={this.item}
                listName={listName}
                tabsHeight={tabsHeight}
                isNewEmployee={isNewEmployee}
                NewDialog={NewDialog}
                EditDialog={EditDialog}
                onRemove={this.onRemove}
                onEdit={this.onEdit}
                onCreate={this.onCreate}
                loadDashboard={this.loadDashboard}
                renderBarActions={this.renderBarActions}
                renderItem={this.renderItem}
                onClick={this.onClick}
            />;
        }

        const {
            props: {
                dialog, dialog: {renderProfileCover},
            },
            ProfilePDFReader,
            item: {
                id,
                data: {
                    fname, lname,
                },
            },
            list,
        } = this;

        const activeId = dialog.extraProp('activeId');

        const title = isFunction(dialog.title) ? dialog.title() : dialog.title;

        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<>
                    <h3>{lname + ' ' + fname}</h3>
                    <h5>{list.length + ' ' + title}</h5>
                </>)}
                <Slider
                    ref="slider"
                    activeId={activeId}
                    list={list}
                    item={this.item}
                    listName={listName}
                    tabsHeight={tabsHeight}
                    isNewEmployee={isNewEmployee}
                    NewDialog={NewDialog}
                    EditDialog={EditDialog}
                    onRemove={this.onRemove}
                    onEdit={this.onEdit}
                    onCreate={this.onCreate}
                    onChange={this.onChange}
                    loadDashboard={this.loadDashboard}
                    renderItem={this.renderItem}
                    renderBarActions={this.renderBarActions}
                    onClick={this.onClick}
                />
            </div>
            {ProfilePDFReader && <ProfilePDFReader ref="pdfReader"/>}
        </div>;
    }

    //</editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="Slider">
@observer
class Slider extends React.Component {

    get tabWrapper() {
        return this.refs.tabWrapper;
    }

    get createAndEditBar() {
        return this.refs.createAndEditBar;
    }

    get newDialog() {
        return this.refs.newDialog;
    }

    get editDialog() {
        return this.refs.editDialog;
    }

    render() {
        const {
            activeId,
            isEmbedded,
            list,
            item,
            listName,
            tabsHeight,
            isNewEmployee,
            NewDialog,
            EditDialog,
            onRemove,
            onEdit,
            onCreate,
            onChange,
            loadDashboard,
            renderItem,
            renderBarActions,
            onClick,
        } = this.props;
        console.log('Slider.render', list.slice());
        const sliderIndex = activeId ? list.indexOfWithPredicate(item => item.id === activeId) : 0;
        const tabIndex = activeId ? 1 : 0;

        const {isEmployee} = storage.is;

        return <>
            <MKBox
                className={isEmbedded ? 'EmbeddedBtnBar' : ''}
                sx={{
                    background: "none",
                    borderBottom: "1px solid #ddd",
                    p: isEmbedded ? '3px' : '10px',
                    mb: isEmbedded ? '-40px' : '0',
                    height: "40px",
                    alignItems: "end",
                    justifyContent: "center",
                    margin: "0",
                    zIndex: "1",
                    top: "4px",
                    position: "relative",
                    border: "none",
                    // position: isEmbedded ? 'absolute' : 'relative',
                    // top: isEmbedded ? '0' : 'unset',
                    // right: isEmbedded ? '0' : 'unset',
                }}>
                {!isEmployee && <CreateAndEditBar
                    ref="createAndEditBar"
                    onRemove={onRemove}
                    onEdit={onEdit}
                    onCreate={onCreate}
                    list={list}
                    isEmbedded={isEmbedded}
                    isContained
                >
                    {renderBarActions}
                </CreateAndEditBar>}
            </MKBox>
            <TabWrapper
                ref="tabWrapper"
                onChange={onChange}
                loadDashboard={loadDashboard}
                renderItem={renderItem}
                onSliderClick={onClick}
                list={list}
                tabIndex={tabIndex}
                sliderIndex={sliderIndex}
                listName={listName}
                tabsHeight={tabsHeight}
                isEmbedded={isEmbedded}
            />
            {NewDialog && <NewDialog ref="newDialog" isNewEmployee={isNewEmployee} embeddedEmployee={item}/>}
            {EditDialog &&
                <EditDialog ref="editDialog" isNewEmployee={isNewEmployee} embeddedEmployee={item}/>}
        </>;
    }
}

//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="TabWrapper">
@observer
class TabWrapper extends React.Component {

    @observable
    state = {
        index: 0,
        sliderIndex: null,
    };

    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onCarouselChange = this.onCarouselChange.bind(this);
        this.updateDashboard = this.updateDashboard.bind(this);
        this.moveToSlide = this.moveToSlide.bind(this);
    }

    get index() {
        return this.state.index;
    }

    @computed get sliderIndex() {
        return this.state.sliderIndex;
    }

    get mainTabs() {
        return this.refs.mainTabs;
    }

    componentDidMount() {
        this.onChange(this.props.tabIndex || 0);
    }

    onChange(index) {
        const {state, props: {onChange}} = this;
        state.index = index;
        onChange && onChange(index);
    }

    onCarouselChange(index) {
        this.state.sliderIndex = index;
    }

    updateDashboard() {
        execWhen(() => this.mainTabs && this.mainTabs.getTabByRef("dashboard")).then(ref => {
            ref.update();
        });
    }

    moveToSlide(index) {
        execWhen(() => this.mainTabs && this.mainTabs.getTabByRef("slider")).then(ref => {
            ref.move(index);
        });
    }

    render() {
        const {
            permissionKey,
            loadDashboard,
            listName,
            renderItem,
            list,
            sliderIndex,
            onSliderClick,
            tabsHeight,
            isEmbedded,
        } = this.props;

        return (
            <Tabs key="tabs" ref="mainTabs" tabsHeight={tabsHeight} permissionKey={permissionKey}
                  index={this.state.index} className={isEmbedded ? "Embedded-Tabs" : ""}
                  onChange={this.onChange}>
                <DashboardTab
                    ref="dashboard"
                    title="Dashboard"
                    loadDashboard={loadDashboard}
                    topStatsSize={120}
                />
                <Carousel
                    ref="slider"
                    title="Details"
                    sliderIndex={sliderIndex}
                    renderer={renderItem}
                    list={list}
                    splitBy={1}
                    colSize="col-lg-12"
                    onClick={onSliderClick}
                    onChange={this.onCarouselChange}
                />
            </Tabs>);
    }
}

// </editor-fold>

export default AEmployeeDocControls;
