/**
 * @generated SignedSource<<9bc029921e2dbc71563e4244448f3171>>
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
    "concreteType": "hira_baseline_ra",
    "kind": "LinkedField",
    "name": "update_hira_baseline_ra_by_pk",
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
    "name": "updateBaselineRAMutation",
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
    "name": "updateBaselineRAMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "456eff8be4ffff354c2349f601e41e74",
    "id": null,
    "metadata": {},
    "name": "updateBaselineRAMutation",
    "operationKind": "mutation",
    "text": "mutation updateBaselineRAMutation(\n  $id: hira_baseline_ra_pk_columns_input!\n  $_set: hira_baseline_ra_set_input!\n) {\n  update_hira_baseline_ra_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "2331f9f1d0168798bd34e2920c7e253a";

module.exports = node;
