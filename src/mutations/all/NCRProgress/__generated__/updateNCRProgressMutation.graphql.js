/**
 * @generated SignedSource<<f13123932b9640dd61ab5ec34c116105>>
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
    "concreteType": "sheq_non_conformance_progress",
    "kind": "LinkedField",
    "name": "update_sheq_non_conformance_progress_by_pk",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "outstanding",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "notes",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "date",
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
    "name": "updateNCRProgressMutation",
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
    "name": "updateNCRProgressMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "572fc5ae4e75353384ffb09c30560bc9",
    "id": null,
    "metadata": {},
    "name": "updateNCRProgressMutation",
    "operationKind": "mutation",
    "text": "mutation updateNCRProgressMutation(\n  $id: sheq_non_conformance_progress_pk_columns_input!\n  $_set: sheq_non_conformance_progress_set_input!\n) {\n  update_sheq_non_conformance_progress_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    outstanding\n    notes\n    date\n  }\n}\n"
  }
};
})();

node.hash = "12bd98386158bc76b7b2a7aff67a37c7";

module.exports = node;
