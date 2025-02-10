/**
 * @generated SignedSource<<5718a00cbf8e72f054dec07f0991e06c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "sheq_compliance_audits_items",
    "kind": "LinkedField",
    "name": "update_sheq_compliance_audits_items_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateAuditItemMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateAuditItemMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "b298f985b89ff281f87408453c1f954d",
    "id": null,
    "metadata": {},
    "name": "updateAuditItemMutation",
    "operationKind": "mutation",
    "text": "mutation updateAuditItemMutation(\n  $id: sheq_compliance_audits_items_pk_columns_input!\n  $_set: sheq_compliance_audits_items_set_input!\n) {\n  update_sheq_compliance_audits_items_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "365c90eac68d137f6f0aa21f0c7bcc95";

module.exports = node;
