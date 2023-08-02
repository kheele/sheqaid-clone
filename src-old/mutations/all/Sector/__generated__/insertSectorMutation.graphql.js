/**
 * @generated SignedSource<<0315db4a0a0c7443f97031635218a7ec>>
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
    "concreteType": "default_sectors",
    "kind": "LinkedField",
    "name": "insert_default_sectors_one",
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
    "name": "insertSectorMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertSectorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f5b97286c704fd2d0518856bbf09ad5a",
    "id": null,
    "metadata": {},
    "name": "insertSectorMutation",
    "operationKind": "mutation",
    "text": "mutation insertSectorMutation(\n  $object: default_sectors_insert_input!\n) {\n  insert_default_sectors_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "5aa5b1599ded626d1494828d4b5b10c0";

module.exports = node;
