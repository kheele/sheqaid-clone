/**
 * @generated SignedSource<<f84c5bd855f545caef973a0c468d6b4b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "object"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "default_teams",
    "kind": "LinkedField",
    "name": "insert_default_teams_one",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertTeamMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertTeamMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ac4e281a872347c96b137e6d0349e1cd",
    "id": null,
    "metadata": {},
    "name": "insertTeamMutation",
    "operationKind": "mutation",
    "text": "mutation insertTeamMutation(\n  $object: default_teams_insert_input!\n) {\n  insert_default_teams_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "508dac7126a507b77b52c63e8e781dca";

module.exports = node;
