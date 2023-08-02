/**
 * @generated SignedSource<<c3d6f826c58964febfdd6b7856f960b4>>
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
    "concreteType": "default_teams",
    "kind": "LinkedField",
    "name": "update_default_teams_by_pk",
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
    "name": "updateTeamMutation",
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
    "name": "updateTeamMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "1972519353b3e308266b2d9f992ecb3b",
    "id": null,
    "metadata": {},
    "name": "updateTeamMutation",
    "operationKind": "mutation",
    "text": "mutation updateTeamMutation(\n  $id: default_teams_pk_columns_input!\n  $_set: default_teams_set_input!\n) {\n  update_default_teams_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "6ebe606c460216a06a01437b3a479db6";

module.exports = node;
