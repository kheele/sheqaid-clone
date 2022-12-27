/**
 * @generated SignedSource<<87be58ab1fee7400a59d3aa22782d322>>
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
    "concreteType": "default_projects",
    "kind": "LinkedField",
    "name": "insert_default_projects_one",
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
    "name": "insertProjectMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProjectMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2d49fc8345ecb7e3616aa6b90b1c60b8",
    "id": null,
    "metadata": {},
    "name": "insertProjectMutation",
    "operationKind": "mutation",
    "text": "mutation insertProjectMutation(\n  $object: default_projects_insert_input!\n) {\n  insert_default_projects_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "de4fa05f5dbebf43b634801689038fc9";

module.exports = node;
