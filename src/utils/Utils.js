import {Dates, monthArray, monthShortArray, yearArray} from './Dates';
import ShouldUpdate from './ShouldUpdate';
import ShouldCreate from './ShouldCreate';
import Permissions from './Permissions';
import SAIdUtils from './SAIdUtils';
import RisksCodes from './RisksCodes';
import ExpiryCodes from './ExpiryCodes';
import CalculationUtils from './CalculationUtils';

import {
    calculateRightPos,
    createGetter,
    createListGetter,
    createListSetter,
    createSetter,
    createValueGetter,
    createValueSetter,
    creatQRCodeLink,
    debounce,
    execWhen,
    findReactComponent,
    getRandomRolor,
    isInView,
    isMobile,
    isTouch,
    isWeb,
    randomNumber,
    scrollTo,
    setDefaultVal
} from './UtilsFuns';

export {
    Dates,
    yearArray,
    monthArray,
    monthShortArray,
    //
    findReactComponent,
    debounce,
    isInView,
    ExpiryCodes,
    RisksCodes,
    calculateRightPos,
    randomNumber,
    execWhen,
    Permissions,
    //
    SAIdUtils,
    ShouldCreate,
    ShouldUpdate,
    //
    scrollTo,
    setDefaultVal,
    createSetter,
    createGetter,
    createValueSetter,
    createListSetter,
    createValueGetter,
    createListGetter,
    getRandomRolor,
    CalculationUtils,
    creatQRCodeLink,
    isTouch,
    isMobile,
    isWeb
};
