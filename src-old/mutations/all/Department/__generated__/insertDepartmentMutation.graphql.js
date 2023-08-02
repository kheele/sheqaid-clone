/**
 * @generated SignedSource<<75d944512c32cb1847f2a69392c5d429>>
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
    "concreteType": "default_departments",
    "kind": "LinkedField",
    "name": "insert_default_departments_one",
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
    "name": "insertDepartmentMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertDepartmentMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e343a64ff19f6ca3bfe453d87888316c",
    "id": null,
    "metadata": {},
    "name": "insertDepartmentMutation",
    "operationKind": "mutation",
    "text": "mutation insertDepartmentMutation(\n  $object: default_departments_insert_input!\n) {\n  insert_default_departments_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "3a6168a55c224acf442fe862afbb72ce";

module.exports = node;
