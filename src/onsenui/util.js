import _Promise from 'babel-runtime/core-js/promise';
import _typeof from 'babel-runtime/helpers/typeof';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _Array$from from 'babel-runtime/core-js/array/from';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import ModifierUtil from './internal/modifier-util';

var util = {};

util.globals = {
  supportsPassive: false
};

util.restoreClass = function (el, defaultClass, scheme) {
  defaultClass.split(/\s+/).forEach(function (c) {
    return c !== '' && !el.classList.contains(c) && el.classList.add(c);
  });
  el.hasAttribute('modifier') && ModifierUtil.refresh(el, scheme);
};

util.prepareQuery = function (query) {
  return query instanceof Function ? query : function (element) {
    return util.match(element, query);
  };
};

util.findParent = function (element, query, until) {
  var match = util.prepareQuery(query);

  var parent = element.parentNode;
  for (;;) {
    if (!parent || parent === document || parent instanceof DocumentFragment || until && until(parent)) {
      return null;
    } else if (match(parent)) {
      return parent;
    }
    parent = parent.parentNode;
  }
};

util.findChild = function (element, query) {
  var match = util.prepareQuery(query);

  // Caution: `element.children` is `undefined` in some environments if `element` is `svg`
  for (var i = 0; i < element.childNodes.length; i++) {
    var node = element.childNodes[i];
    if (node.nodeType !== Node.ELEMENT_NODE) {
      // process only element nodes
      continue;
    }
    if (match(node)) {
      return node;
    }
  }
  return null;
};

util.match = function (e, s) {
  return (e.matches || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector).call(e, s);
};

util.throw = function (message) {
  throw new Error("ONSENUI Custom" + ' ' + message);
};

util.isInteger = function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

util.bindListeners = function (element, listenerNames) {
  listenerNames.forEach(function (name) {
    var boundName = name.replace(/^_[a-z]/, '_bound' + name[1].toUpperCase());
    element[boundName] = element[boundName] || element[name].bind(element);
  });
};
util.addEventListener = function (el, name, handler, opt, isGD) {
  el.addEventListener(name, handler, util.globals.supportsPassive ? opt : (opt || {}).capture);
};
util.removeEventListener = function (el, name, handler, opt, isGD) {
  el.removeEventListener(name, handler, util.globals.supportsPassive ? opt : (opt || {}).capture);
};
export default util;