/**
 * @generated SignedSource<<a88eac230a1a5acbd3ddd76445f17636>>
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
    "concreteType": "ppe_types",
    "kind": "LinkedField",
    "name": "insert_ppe_types_one",
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
    "name": "insertPPEMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertPPEMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "aaf259237df5b20f3f2c87a2ccf8d012",
    "id": null,
    "metadata": {},
    "name": "insertPPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertPPEMutation(\n  $object: ppe_types_insert_input!\n) {\n  insert_ppe_types_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "2cc54702e767d0e85b395343df73d2eb";

module.exports = node;
