import _Promise from 'babel-runtime/core-js/promise';
import _typeof from 'babel-runtime/helpers/typeof';
import _setImmediate from 'babel-runtime/core-js/set-immediate';
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

import util from '../util';

var internal = {};

internal.config = {
  autoStatusBarFill: true,
  animationsDisabled: false,
  warningsDisabled: false
};

internal.nullElement = window.document.createElement('div');

export default internal;