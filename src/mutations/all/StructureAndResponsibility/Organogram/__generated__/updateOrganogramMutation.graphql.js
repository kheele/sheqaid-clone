/**
 * @generated SignedSource<<4e48a65d3d8693590db95ff6673d2c57>>
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
    "concreteType": "sheq_organograms",
    "kind": "LinkedField",
    "name": "update_sheq_organograms_by_pk",
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
    "name": "updateOrganogramMutation",
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
    "name": "updateOrganogramMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "d181828b484399214b538d696100b1a7",
    "id": null,
    "metadata": {},
    "name": "updateOrganogramMutation",
    "operationKind": "mutation",
    "text": "mutation updateOrganogramMutation(\n  $id: sheq_organograms_pk_columns_input!\n  $_set: sheq_organograms_set_input!\n) {\n  update_sheq_organograms_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "063ca2a754239b1f494bca7ee12d3077";

module.exports = node;
