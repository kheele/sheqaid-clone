/**
 * @generated SignedSource<<bf0867e056602305d7a3005ee0d4f397>>
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
    "concreteType": "sheq_compliance_audits",
    "kind": "LinkedField",
    "name": "update_sheq_compliance_audits_by_pk",
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
    "name": "updateAuditMutation",
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
    "name": "updateAuditMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "dfd4b6f49082525c1bd3357cb65e98d4",
    "id": null,
    "metadata": {},
    "name": "updateAuditMutation",
    "operationKind": "mutation",
    "text": "mutation updateAuditMutation(\n  $id: sheq_compliance_audits_pk_columns_input!\n  $_set: sheq_compliance_audits_set_input!\n) {\n  update_sheq_compliance_audits_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "b95c4a65ee4f41574c388d9e690236bb";

module.exports = node;
