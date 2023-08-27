/**
 * @generated SignedSource<<ac8331088e86ad0f7533f6148943e3c7>>
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
    "concreteType": "hira_baseline_ra_list",
    "kind": "LinkedField",
    "name": "update_hira_baseline_ra_list_by_pk",
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
    "name": "updateBaselineRAListItemMutation",
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
    "name": "updateBaselineRAListItemMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "2a96db27dcd447788521a28958de8a86",
    "id": null,
    "metadata": {},
    "name": "updateBaselineRAListItemMutation",
    "operationKind": "mutation",
    "text": "mutation updateBaselineRAListItemMutation(\n  $id: hira_baseline_ra_list_pk_columns_input!\n  $_set: hira_baseline_ra_list_set_input!\n) {\n  update_hira_baseline_ra_list_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "856971f550228c7c812dc122921a6fe8";

module.exports = node;
