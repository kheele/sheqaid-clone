/**
 * @generated SignedSource<<50a86d86a39962452b04a43b792d5166>>
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
    "concreteType": "sheq_compliance_audits",
    "kind": "LinkedField",
    "name": "insert_sheq_compliance_audits_one",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "created_at",
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
    "name": "insertAuditMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAuditMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6e0376736badbce6d7b95f30b8c0fb3c",
    "id": null,
    "metadata": {},
    "name": "insertAuditMutation",
    "operationKind": "mutation",
    "text": "mutation insertAuditMutation(\n  $object: sheq_compliance_audits_insert_input!\n) {\n  insert_sheq_compliance_audits_one(object: $object) {\n    id\n    created_at\n  }\n}\n"
  }
};
})();

node.hash = "d26332dcb4d6203fca9c1c0764bf4e0a";

module.exports = node;
