/**
 * @generated SignedSource<<d932f52f46a01f90db6bdc75d0feb67f>>
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
    "concreteType": "sheq_incident_investigation_vehicles",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_vehicles_by_pk",
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
    "name": "updateIncidentVehicleMutation",
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
    "name": "updateIncidentVehicleMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e599b43d0cc18788e13df65f3acfc44c",
    "id": null,
    "metadata": {},
    "name": "updateIncidentVehicleMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentVehicleMutation(\n  $id: sheq_incident_investigation_vehicles_pk_columns_input!\n  $_set: sheq_incident_investigation_vehicles_set_input!\n) {\n  update_sheq_incident_investigation_vehicles_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "345619669056d835ed6e0094036d4151";

module.exports = node;
