/**
 * @generated SignedSource<<ef00447da583fb055a54640da717b692>>
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
    "concreteType": "sheq_compliance_audits_definitions",
    "kind": "LinkedField",
    "name": "update_sheq_compliance_audits_definitions_by_pk",
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
    "name": "updateAuditDefinitionMutation",
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
    "name": "updateAuditDefinitionMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "2e5d631de97653e347911a2bdb700c45",
    "id": null,
    "metadata": {},
    "name": "updateAuditDefinitionMutation",
    "operationKind": "mutation",
    "text": "mutation updateAuditDefinitionMutation(\n  $id: sheq_compliance_audits_definitions_pk_columns_input!\n  $_set: sheq_compliance_audits_definitions_set_input!\n) {\n  update_sheq_compliance_audits_definitions_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "1090cc0763c3872a30cab1ef19d5a4f0";

module.exports = node;
