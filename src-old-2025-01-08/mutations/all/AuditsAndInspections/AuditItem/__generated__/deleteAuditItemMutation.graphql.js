/**
 * @generated SignedSource<<ae9148d2eed6e8ef5370f38d90bad7b0>>
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
    "concreteType": "sheq_compliance_audits_items",
    "kind": "LinkedField",
    "name": "delete_sheq_compliance_audits_items_by_pk",
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
    "name": "deleteAuditItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteAuditItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9723c656e84cd6566d1a580666184c1e",
    "id": null,
    "metadata": {},
    "name": "deleteAuditItemMutation",
    "operationKind": "mutation",
    "text": "mutation deleteAuditItemMutation(\n  $id: bigint!\n) {\n  delete_sheq_compliance_audits_items_by_pk(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "ac1e1629666dd5ea532ff84ebfa0cbee";

module.exports = node;
