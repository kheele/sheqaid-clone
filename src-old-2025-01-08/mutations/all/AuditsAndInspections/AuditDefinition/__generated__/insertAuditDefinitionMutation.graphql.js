/**
 * @generated SignedSource<<73af1b8a5026feea4617ee550c0af2e2>>
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
    "concreteType": "sheq_compliance_audits_definitions",
    "kind": "LinkedField",
    "name": "insert_sheq_compliance_audits_definitions_one",
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
    "name": "insertAuditDefinitionMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertAuditDefinitionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1c95f66536f750aa2d5b0af82e084217",
    "id": null,
    "metadata": {},
    "name": "insertAuditDefinitionMutation",
    "operationKind": "mutation",
    "text": "mutation insertAuditDefinitionMutation(\n  $object: sheq_compliance_audits_definitions_insert_input!\n) {\n  insert_sheq_compliance_audits_definitions_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "682766e2c8019db374acae0e9476f5b0";

module.exports = node;
