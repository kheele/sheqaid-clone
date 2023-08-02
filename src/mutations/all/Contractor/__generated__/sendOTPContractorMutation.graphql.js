/**
 * @generated SignedSource<<da5f95db32809fdcaf318dc5f4650b5a>>
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
    "concreteType": "default_contractors",
    "kind": "LinkedField",
    "name": "update_default_contractors_by_pk",
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
    "name": "sendOTPContractorMutation",
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
    "name": "sendOTPContractorMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "95c86e7121c3ee98d4aa1e0f4a457078",
    "id": null,
    "metadata": {},
    "name": "sendOTPContractorMutation",
    "operationKind": "mutation",
    "text": "mutation sendOTPContractorMutation(\n  $id: default_contractors_pk_columns_input!\n  $_set: default_contractors_set_input!\n) {\n  update_default_contractors_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "f5bbdd406d79ae6a937ab44d10d9fbcb";

module.exports = node;
