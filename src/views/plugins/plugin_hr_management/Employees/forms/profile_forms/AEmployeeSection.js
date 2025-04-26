import React from "react";
import {findDOMNode} from "react-dom";

class AEmployeeSection extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onFormGoto = this.onFormGoto.bind(this);
        this.onFormGotoChild = this.onFormGotoChild.bind(this);
    }

    // </editor-fold>

    onFormGoto() {
        const currRow = this.getDOMNodeJQuery().closest('.row.row-component');
        // console.log(currRow);
        // console.log(currRow[0]);

        const currComp = findReactComponent(currRow[0]);
        // console.log('this.refs', this.refs);
        if (currComp) {
            const container = $(currRow).closest('.dialog-content');
            currComp.onFormGoto(container);
        }
    }

    onFormGotoChild(refName) {
        if (refName) {
            const {formControls} = this.refs;
            if (!formControls) {
                const {[refName]: ref} = this.refs;
                ref && ref.onFormGoto();
            } else {
                console.log(refName, 'formControls', formControls)
                console.log(refName, 'formControls', formControls.getFormChildren())

                const {[refName]: ref} = formControls.refs || {};
                if (ref) {
                    ref.onFormGoto();
                } else {

                }
            }
        }
    }

    getDOMNode() {
        return findDOMNode(this);
    }

    getDOMNodeJQuery() {
        return $(this.getDOMNode());
    }

}

function findReactComponent(el) {
    for (const key in el) {
        if (key.startsWith('__reactProps$')) {
            const props = el[key];

            return props && props.row;
        }
    }
    return null;
}


export default AEmployeeSection;
