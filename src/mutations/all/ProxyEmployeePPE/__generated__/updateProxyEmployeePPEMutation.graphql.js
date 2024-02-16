/**
 * @generated SignedSource<<dddd12755ef2dc7bc5abd2994d0747e9>>
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
    "concreteType": "proxy_employee__ppe_type",
    "kind": "LinkedField",
    "name": "update_proxy_employee__ppe_type_by_pk",
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
    "name": "updateProxyEmployeePPEMutation",
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
    "name": "updateProxyEmployeePPEMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "19f76734666a3d6ec3de7c4178e2acfc",
    "id": null,
    "metadata": {},
    "name": "updateProxyEmployeePPEMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyEmployeePPEMutation(\n  $id: proxy_employee__ppe_type_pk_columns_input!\n  $_set: proxy_employee__ppe_type_set_input!\n) {\n  update_proxy_employee__ppe_type_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "679989488952d505ce3b95ceb742565f";

module.exports = node;
