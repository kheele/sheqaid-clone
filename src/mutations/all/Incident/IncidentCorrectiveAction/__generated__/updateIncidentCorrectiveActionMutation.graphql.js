/**
 * @generated SignedSource<<1d7d419171905037b83c03b452352706>>
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
    "concreteType": "sheq_incident_investigation_corrective_actions_factors",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_corrective_actions_factors_by_pk",
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
    "name": "updateIncidentCorrectiveActionMutation",
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
    "name": "updateIncidentCorrectiveActionMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "6d37ef7566c16ae3003717f3d76f1514",
    "id": null,
    "metadata": {},
    "name": "updateIncidentCorrectiveActionMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentCorrectiveActionMutation(\n  $id: sheq_incident_investigation_corrective_actions_factors_pk_columns_input!\n  $_set: sheq_incident_investigation_corrective_actions_factors_set_input!\n) {\n  update_sheq_incident_investigation_corrective_actions_factors_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "37599cefa401a9ee7fa3c333f3656c68";

module.exports = node;
