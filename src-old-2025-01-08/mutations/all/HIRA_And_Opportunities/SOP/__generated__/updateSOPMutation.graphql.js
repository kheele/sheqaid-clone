/**
 * @generated SignedSource<<0395db13270f44a1301d5b848ffa0a56>>
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
    "concreteType": "hira_sop",
    "kind": "LinkedField",
    "name": "update_hira_sop_by_pk",
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
    "name": "updateSOPMutation",
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
    "name": "updateSOPMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e2d341f2290306bb954a4eb95e31379f",
    "id": null,
    "metadata": {},
    "name": "updateSOPMutation",
    "operationKind": "mutation",
    "text": "mutation updateSOPMutation(\n  $id: hira_sop_pk_columns_input!\n  $_set: hira_sop_set_input!\n) {\n  update_hira_sop_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "667c2bce01b25b2f9289c39d9d03a25d";

module.exports = node;
