/**
 * @generated SignedSource<<970769326f02e0a155c12e8eaea5abfb>>
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
    "concreteType": "ppe",
    "kind": "LinkedField",
    "name": "update_ppe_by_pk",
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
    "name": "updatePPEMutation",
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
    "name": "updatePPEMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "f93eb3d1adc821a594e97eb96e28e290",
    "id": null,
    "metadata": {},
    "name": "updatePPEMutation",
    "operationKind": "mutation",
    "text": "mutation updatePPEMutation(\n  $id: ppe_pk_columns_input!\n  $_set: ppe_set_input!\n) {\n  update_ppe_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "5038c820060c6b49aed0d673826fbd3c";

module.exports = node;
