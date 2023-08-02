/**
 * @generated SignedSource<<907d69baaaa99fbedf54f0c6b5c8c06d>>
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
    "concreteType": "ppe",
    "kind": "LinkedField",
    "name": "insert_ppe_one",
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
    "cacheID": "73bc94e199ace3da70b3930e64958adb",
    "id": null,
    "metadata": {},
    "name": "insertPPEMutation",
    "operationKind": "mutation",
    "text": "mutation insertPPEMutation(\n  $object: ppe_insert_input!\n) {\n  insert_ppe_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "42496b9831f4a629646287ac17ca8c23";

module.exports = node;
