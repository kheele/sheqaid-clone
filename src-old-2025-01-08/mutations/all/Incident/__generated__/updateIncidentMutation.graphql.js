/**
 * @generated SignedSource<<54dd60292f7514ab798d4c3229932244>>
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
    "concreteType": "sheq_incident_investigation",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_by_pk",
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
    "name": "updateIncidentMutation",
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
    "name": "updateIncidentMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "8b387cc1b4bbdfb11d55cfd38af312cd",
    "id": null,
    "metadata": {},
    "name": "updateIncidentMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentMutation(\n  $id: sheq_incident_investigation_pk_columns_input!\n  $_set: sheq_incident_investigation_set_input!\n) {\n  update_sheq_incident_investigation_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "65f4522c193929eab788e8e3e9ecbd71";

module.exports = node;
