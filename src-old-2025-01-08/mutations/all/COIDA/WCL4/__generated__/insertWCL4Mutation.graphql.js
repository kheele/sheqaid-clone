/**
 * @generated SignedSource<<c65b839b91f2efbdd9841cd969a74866>>
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
    "concreteType": "coida_claims_wcl_4",
    "kind": "LinkedField",
    "name": "insert_coida_claims_wcl_4_one",
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
    "name": "insertWCL4Mutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertWCL4Mutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2c51a1a201447a99008b428c4a700a8c",
    "id": null,
    "metadata": {},
    "name": "insertWCL4Mutation",
    "operationKind": "mutation",
    "text": "mutation insertWCL4Mutation(\n  $object: coida_claims_wcl_4_insert_input!\n) {\n  insert_coida_claims_wcl_4_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "2e8f3eecd7366e100929d9f7d60ee908";

module.exports = node;
