/**
 * @generated SignedSource<<8b4bfe1e5de4309029035a9e142cf5b0>>
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
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "sheq_compliance_audits_definitions",
    "kind": "LinkedField",
    "name": "delete_sheq_compliance_audits_definitions_by_pk",
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
    "name": "deleteAuditDefinitionMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteAuditDefinitionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d819051bd1e6797f77edbaf7176b8030",
    "id": null,
    "metadata": {},
    "name": "deleteAuditDefinitionMutation",
    "operationKind": "mutation",
    "text": "mutation deleteAuditDefinitionMutation(\n  $id: bigint!\n) {\n  delete_sheq_compliance_audits_definitions_by_pk(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "4a3c7b840ffe636ba7fa82cccd88e30a";

module.exports = node;
