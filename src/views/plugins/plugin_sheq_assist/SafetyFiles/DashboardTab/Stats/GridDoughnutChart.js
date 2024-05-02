//<editor-fold desc="imports">
import * as React from "react";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
//</editor-fold>

//<editor-fold desc="Comp">
const Comp = forwardRef(({data: __data}, ref) => {
	// <editor-fold desc="useImperativeHandle funs">
	useImperativeHandle(ref, () => ({
		setData: (value) => {
		},
	}));
	// </editor-fold>

	return null;
});
//</editor-fold>

export default Comp;
