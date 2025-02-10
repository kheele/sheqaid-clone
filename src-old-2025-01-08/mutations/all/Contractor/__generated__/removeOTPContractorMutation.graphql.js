/**
 * @generated SignedSource<<a311157b67a22ed96cd099e3a92fba4c>>
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
    "name": "removeOTPContractorMutation",
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
    "name": "removeOTPContractorMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "129c001d3f54fc090502cfebcd290eb2",
    "id": null,
    "metadata": {},
    "name": "removeOTPContractorMutation",
    "operationKind": "mutation",
    "text": "mutation removeOTPContractorMutation(\n  $id: default_contractors_pk_columns_input!\n  $_set: default_contractors_set_input!\n) {\n  update_default_contractors_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "8e0bea9a441477d591b7ebf7f373ddfc";

module.exports = node;
