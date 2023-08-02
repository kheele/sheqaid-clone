/**
 * @generated SignedSource<<1dd9edefbe39de5a985d629cef2fbd5c>>
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
    "concreteType": "proxy_team__ppe",
    "kind": "LinkedField",
    "name": "update_proxy_team__ppe_by_pk",
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
    "cacheID": "cb135ca0aa1359c5ae0fec3582f584dc",
    "id": null,
    "metadata": {},
    "name": "updateProxyTeamPPEMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyTeamPPEMutation(\n  $id: proxy_team__ppe_pk_columns_input!\n  $_set: proxy_team__ppe_set_input!\n) {\n  update_proxy_team__ppe_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "d47b5f4ebb00ce73ac34abdba1cd319f";

module.exports = node;
