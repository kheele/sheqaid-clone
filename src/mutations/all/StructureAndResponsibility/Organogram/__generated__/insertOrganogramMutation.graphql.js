/**
 * @generated SignedSource<<dd0fdd8ea32caab89c565957ad53d1e9>>
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
    "concreteType": "sheq_organograms",
    "kind": "LinkedField",
    "name": "insert_sheq_organograms_one",
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
    "name": "insertOrganogramMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertOrganogramMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ec97275921973cd242504bab4feae8e0",
    "id": null,
    "metadata": {},
    "name": "insertOrganogramMutation",
    "operationKind": "mutation",
    "text": "mutation insertOrganogramMutation(\n  $object: sheq_organograms_insert_input!\n) {\n  insert_sheq_organograms_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "57335ef498a57d364697d007a94e6039";

module.exports = node;
