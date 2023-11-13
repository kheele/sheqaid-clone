import React from "react";
import {findDOMNode} from "react-dom";
import {isObservable, isObservableArray, isObservableMap, isObservableObject, toJS} from "mobx";
import WebWorker from "../web-worker/WebWorker";
import {Dates} from "./Dates";

function findReactComponent(el) {
    for (const key in el) {
        if (key.startsWith('__reactInternalInstance$')) {
            const fiberNode = el[key];

            return fiberNode && fiberNode.return && fiberNode.return.stateNode;
        }
    }
    return null;
}

async function toDataURI(filePath) {
    const worker = new WebWorker(() => {
        Events.on("process", Utils.toDataURI);
    });
    const res = await worker.emit("process", isObservable(filePath) ? toJS(filePath) : filePath);
    worker.terminate();
    return res;
}

function convertMobx(arg) {
    // if(arg && isFile(arg)) {
    //     return toDataURI(arg);
    // }
    if(arg && isString(arg) && arg.isDate()) {
        return Dates.formatDateSQL(arg);
    }
    if (isObservableArray(arg) || isObservableObject(arg) || isObservableMap(arg)) {
        return convertMobx(toJS(arg));
    }
    if (isArray(arg)) {
        return arg.map(convertMobx);
    }
    if (isObservable(arg)) {
        return toJS(arg);
    }
    return arg;
}

function debounce(func, delay = 0) {
    let timer;
    return function () {     //anonymous function
        const context = this;
        const args = arguments;
        clearTimeout(timer);

        const [el] = args;
        const {type} = el.props;

        delay = type === 'email' || type === 'number' || type === 'text' || type === 'textarea' ? 1000 : delay;

        timer = setTimeout(() => {
            func.apply(context, args)
        }, delay);
    };
}

function isInView(elem) {
    if (!elem) {
        return false;
    }
    const elementRect = elem.getBoundingClientRect();

    const viewportRect = {
        top: 0,
        left: 0,
        width: window.innerWidth,
        right: window.innerWidth,
        height: window.innerHeight,
        bottom: window.innerHeight
    };
    const intersectRect = (r1, r2) => {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    };
    return intersectRect(elementRect, viewportRect);
}

function calculateRightPos(ref, incWidth = true) {
    const elem = $(ref);
    return $(window).width() - (elem.offset().left + (incWidth ? elem.outerWidth() : 0));
}

function randomNumber(max) {
    const list = [];
    for (var n = 0; n < max; n++) {
        list.push(Math.floor(Math.random() * 10));
    }
    return list.join("");
}

const execWhen = (test) => {
    return new Promise((resolve, reject) => {
        const exec = async () => {
            let res = test();
            if (res instanceof Promise) {
                try {
                    res = await res;
                } catch (ex) {
                    setImmediate(exec);
                    return;
                }
            }
            if (res !== false && res !== null && res !== undefined) {
                resolve(res);
            } else {
                setImmediate(exec);
            }
        };
        exec();
    });
};

function getPhoneNumberNew({country, phone}) {
    if (phone) {
        phone = String(phone).replaceAll(' ', '').replaceAll('+', '').replaceAll('(', '').replaceAll(')', '');
    } else {
        phone = "";
    }
    const code = country ? `+${country.phone_code || country.data.phone_code}` : "";
    if (phone.trim().replaceAll(" ", "").startsWith("0")) {
        return code + (phone.length > 0 ? phone.substring(1) : "");
    } else {
        return code + phone;
    }
}

function scrollTo(elem, container) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!container) {
                const {controls} = this.refs;
                container = $(findDOMNode(controls || this)).closest('.dialog-content');
            }

            if (elem.offset() && container.offset()) {
                try {
                    const scrollTop = elem.offset().top - container.offset().top + container.scrollTop() - 8;
                    container.animate({
                        scrollTop
                    }, 1000);
                } catch (err) {
                    // console.error(err);
                }
            }

            resolve();
        }, 100);
    });
}

function setDefaultVal(key, altValFn) {
    // console.log('setDefaultVal', key, altValFn);
    execWhen(() => this.refs[key]).then(ref => {
        let val;
        const data = this.item ? this.item.data || this.item : null;
        if (data && data[key]) {
            val = data[key];
        }
        if (val && isFunction(altValFn)) {
            val = altValFn(val);
        } else if (isFunction(altValFn)) {
            val = altValFn();
        }
        if (val) {
            if (isSetter(ref, 'value') || "value" in ref) {
                if (ref.props.type === "date") {
                    ref.value = Dates.parse(val);
                } else {
                    ref.value = val;
                }
            } else if (isSetter(ref, 'list') || "list" in ref) {
                ref.list = val;
            }
        }
        // console.log(key, val, ref)
    });
}

function createSetter(key) {
    Object.defineProperty(this, key, {
        configurable: true,
        get: () => {
            const {$mobx} = this;
            if ($mobx && $mobx.values) {
                const {values} = $mobx;
                if (values[key]) {
                    return values[key].get();
                }
            }
        },
        set: value => {
            const {$mobx} = this;
            if ($mobx && $mobx.values) {
                const {values} = $mobx;
                if (values[key]) {
                    values[key].set(value);
                }
            }
        }
    });
    // We could've passed this the first time
    // but it triggers a bug in IE11 and Edge 14/15.
    // Calling defineProperty() again should be equivalent.
    // https://github.com/facebook/react/issues/11768
    Object.defineProperty(this, key, {
        enumerable: false
    });
}

function createGetter(key, getter) {
    Object.defineProperty(this, key, {
        configurable: true,
        get: getter
    });
    // We could've passed this the first time
    // but it triggers a bug in IE11 and Edge 14/15.
    // Calling defineProperty() again should be equivalent.
    // https://github.com/facebook/react/issues/11768
    Object.defineProperty(this, key, {
        enumerable: false
    });
}

function createValueSetter(setter) {
    createSetter.call(this, 'value', setter);
}

function createValueGetter(getter) {
    createGetter.call(this, 'value', getter);
}

function createListSetter(setter) {
    createSetter.call(this, 'list', setter);
}

function createListGetter(getter) {
    createGetter.call(this, 'list', getter);
}

function getRandomRolor() {
    const letters = '0123456789'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
}

function getDashboardCounter(v) {
    if (isString(v) || isNumber(v)) {
        return v === 'NaN' ? 0 : parseInt(v, 10);
    }
    const {aggregate: {count}} = v;
    return count;
}

function creatQRCodeLink(type, id) {
    return new Promise((resolve, reject) => {
        const loc = `https://sheqaid/qrcode?type=${type}&id=${id}`;

        const qrCodeElem = document.createElement('div');
        const qrcode = new QRCode(qrCodeElem, {
            text: loc,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        const qrCodeImg = qrCodeElem.querySelector('img');
        //makeImage, makeCode,
        qrCodeImg.onload = e => {
            resolve(qrCodeImg.src);
        };
    });
}

const isTouch = () => (navigator.maxTouchPoints || navigator.msMaxTouchPoints > 0 || 'ontouchstart' in document.documentElement);

const isMobile = () => (/iphone|ipod|ipad|android|ie|iemobile|blackberry|fennec/i).test(navigator.userAgent);

const isWeb = () => !window.process;

function isPackaged() {
    if (isWeb())
        return false;
    let _isPackaged = false;
    const {process} = window;
    if (process) {
        if (process.mainModule && process.mainModule.filename.indexOf('app.asar') !== -1) {
            _isPackaged = true;
        } else if (process.argv.filter(a => a.indexOf('app.asar') !== -1).length > 0) {
            _isPackaged = true;
        }
    }
    return _isPackaged;
}

window.isPackagedElectron = isPackaged();
window.isWeb = isWeb;

export {
    findReactComponent,
    toDataURI,
    convertMobx,
    debounce,
    isInView,
    calculateRightPos,
    randomNumber,
    execWhen,
    //
    getPhoneNumberNew,
    scrollTo,
    setDefaultVal,
    createSetter,
    createGetter,
    createValueSetter,
    createListSetter,
    createValueGetter,
    createListGetter,
    getRandomRolor,
    getDashboardCounter,
    creatQRCodeLink,
    isTouch,
    isMobile,
    isWeb,
    isPackaged
};
