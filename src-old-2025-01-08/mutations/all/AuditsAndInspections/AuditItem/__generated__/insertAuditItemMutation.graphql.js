/**
 * @generated SignedSource<<6419ac40395c659aa9fbf2018d1b15ae>>
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
    "concreteType": "sheq_compliance_audits_items",
    "kind": "LinkedField",
    "name": "insert_sheq_compliance_audits_items_one",
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
    "name": "insertAuditItemMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAuditItemMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "64c63c2c9a83cb306f80e9333b016d1b",
    "id": null,
    "metadata": {},
    "name": "insertAuditItemMutation",
    "operationKind": "mutation",
    "text": "mutation insertAuditItemMutation(\n  $object: sheq_compliance_audits_items_insert_input!\n) {\n  insert_sheq_compliance_audits_items_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "07ba90690eba441a6708b2671e920dd9";

module.exports = node;
