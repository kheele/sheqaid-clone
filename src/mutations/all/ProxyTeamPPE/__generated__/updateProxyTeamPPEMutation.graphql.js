/**
 * @generated SignedSource<<4f7c4227cf75a7c5ff958cb80c34d609>>
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
    "concreteType": "proxy_team__ppe_type",
    "kind": "LinkedField",
    "name": "update_proxy_team__ppe_type_by_pk",
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
    "name": "updateProxyTeamPPEMutation",
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
    "name": "updateProxyTeamPPEMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "ab1156a10e686c6e2e9c45760d1dffc3",
    "id": null,
    "metadata": {},
    "name": "updateProxyTeamPPEMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyTeamPPEMutation(\n  $id: proxy_team__ppe_type_pk_columns_input!\n  $_set: proxy_team__ppe_type_set_input!\n) {\n  update_proxy_team__ppe_type_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "ba7e17b3e797751b5deb5735d75d76b8";

module.exports = node;
