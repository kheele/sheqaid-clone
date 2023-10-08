/**
 * @generated SignedSource<<088c04358a59e4f771875a3659e5ebc6>>
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
    "concreteType": "coida_claims",
    "kind": "LinkedField",
    "name": "insert_coida_claims_one",
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
    "name": "insertClaimsClientMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertClaimsClientMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1eb1c7b91f0292334c4a59cb51670e11",
    "id": null,
    "metadata": {},
    "name": "insertClaimsClientMutation",
    "operationKind": "mutation",
    "text": "mutation insertClaimsClientMutation(\n  $object: coida_claims_insert_input!\n) {\n  insert_coida_claims_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a9987e838aa6358a5606ca8b8ca5660d";

module.exports = node;
