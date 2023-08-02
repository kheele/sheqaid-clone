/**
 * @generated SignedSource<<4f5a6d66e7c1f4702fc02d6cb7abb10e>>
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
    "concreteType": "sheq_incident_investigation_severity",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_severity_by_pk",
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
    "name": "updateIncidentSeverityMutation",
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
    "name": "updateIncidentSeverityMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "a7f19c039d9db44a32aac4cc85d78998",
    "id": null,
    "metadata": {},
    "name": "updateIncidentSeverityMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentSeverityMutation(\n  $id: sheq_incident_investigation_severity_pk_columns_input!\n  $_set: sheq_incident_investigation_severity_set_input!\n) {\n  update_sheq_incident_investigation_severity_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "f3ac0b71319430cd00b3db98c6dab105";

module.exports = node;
