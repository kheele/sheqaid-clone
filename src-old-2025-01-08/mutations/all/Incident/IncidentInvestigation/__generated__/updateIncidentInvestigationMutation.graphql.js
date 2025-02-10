/**
 * @generated SignedSource<<90a63c37bb78678507ab8d7bbd432f21>>
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
    "concreteType": "sheq_incident_investigation_investigations",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_investigations_by_pk",
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
    "name": "updateIncidentInvestigationMutation",
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
    "name": "updateIncidentInvestigationMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "3434aa28c69734f4d453a901eafabd9d",
    "id": null,
    "metadata": {},
    "name": "updateIncidentInvestigationMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentInvestigationMutation(\n  $id: sheq_incident_investigation_investigations_pk_columns_input!\n  $_set: sheq_incident_investigation_investigations_set_input!\n) {\n  update_sheq_incident_investigation_investigations_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "87fe9c8f4170bbc81c1e59981a5d1667";

module.exports = node;
