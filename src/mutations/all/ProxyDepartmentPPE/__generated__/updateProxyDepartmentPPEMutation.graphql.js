/**
 * @generated SignedSource<<10b244708475933a7161a501f2c16328>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "proxy_department__ppe",
    "kind": "LinkedField",
    "name": "update_proxy_department__ppe_by_pk",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateProxyDepartmentPPEMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateProxyDepartmentPPEMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "2792d0a92170229879243cf5357345b0",
    "id": null,
    "metadata": {},
    "name": "updateProxyDepartmentPPEMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyDepartmentPPEMutation(\n  $id: proxy_department__ppe_pk_columns_input!\n  $_set: proxy_department__ppe_set_input!\n) {\n  update_proxy_department__ppe_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "f7f19776bfef894bddadf05415c8742e";

module.exports = node;
