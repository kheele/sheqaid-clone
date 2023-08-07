
//used
function organogramGetBtnRefName(btn) {
    return btn.getAttribute('refName');
}

//used
function organogramIsTeam(btn) {
    const id = btn.getAttribute('id');
    return id.contains('team');
}

//used
function organogramGetParentId(btn) {
    return parseInt(btn.getAttribute('parentId'));
}

function organogramCreateRef(btn) {
    const refName = btn.getAttribute('refName');
    const {refs} = appBody.refs.activePage.refs.mainTabs.refs.tabContent.activeTab;
    return refs[refName].refs.controls.refs.typedWrapper;
}

//used
function organogramOnRemove(fn) {
    try {
//        const id = btn.getAttribute('id');
//        const parentId = btn.getAttribute('parentId');
//        const $this = organogramCreateRef(btn);
        confirmDialog.open('Are you sure you want to remove this item?').then(res => {
            if (res === 1) {
//                const parentId = btn.getAttribute('parentId');
                setTimeout(() => {
//                    if (organogramIsTeam(btn)) {
//                        list.removeIf(function (val) {
//                            const {employee_list, employeeReportedTo} = val;
//                            return employee_list && employeeReportedTo && (employeeReportedTo.id === parentId);
//                        });
//                    } else {
//                        list.removeIf(function (val) {
//                            const {employee} = val;
//                            return employee && (employee.id === btn.id);
//                        });
//                    }

                    fn('list');
                }, 0);
            }
        });
    } catch (err) {
        console.error(err);
    }
}

//function organogramOnEdit(btn, list, onAddImpl) {
//    const id = btn.getAttribute('id');
//    const parentId = btn.getAttribute('parentId');
//    if (id.contains('team')) {
//        const item = list.find(({employee_list, employeeReportedTo}) => {
//            return employee_list && employeeReportedTo && employeeReportedTo.id === parentId;
//        });
////                console.log('onEdit', item)
//        onAddImpl(item, true);
//    } else {
//        const item = list.find(({employee}) => {
//            return employee && employee.id === id;
//        });
////                console.log('onEdit', item)
//        onAddImpl(item, true);
//    }
//}

//function organogramOnAdd(btn, list, onAddImpl) {
//    const item = list.find(({employee}) => {
//        return employee && employee.id === btn.id;
//    });
//    onAddImpl({employeeReportedTo: item.employee});
//}
//function organogramOnAdd(btn) {
//    const id = btn.getAttribute('id');
//    const {list, listDisplay, onAddImpl} = organogramCreateRef(btn);
//    const item = list.find(({employee}) => {
//        return employee && employee.id === id;
//    });
//    onAddImpl({employeeReportedTo: item.employee});
//}

//function organogramOnView(btn, list, profileDialog) {
//    const item = list.find(item => item.employee.id === btn.getAttribute('id'));
////            console.log('selectEmployee1', item)
//    profileDialog.open(item.employee);
//}
//function organogramOnView(btn) {
//    const {list, refs: {profileDialog}} = organogramCreateRef(btn);
//    const item = list.find(item => item.employee.id === btn.getAttribute('id'));
////            console.log('selectEmployee1', item)
//    profileDialog.open(item.employee);
//}