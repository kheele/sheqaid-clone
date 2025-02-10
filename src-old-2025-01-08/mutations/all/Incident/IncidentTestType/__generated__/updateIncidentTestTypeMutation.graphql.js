/**
 * @generated SignedSource<<4d66106518500becb98b17b364548bd2>>
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
    "concreteType": "sheq_incident_investigation_test_type_list",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_test_type_list_by_pk",
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
    "name": "updateIncidentTestTypeMutation",
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
    "name": "updateIncidentTestTypeMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c31185603bb53eb4a1cdce72aa346fbc",
    "id": null,
    "metadata": {},
    "name": "updateIncidentTestTypeMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentTestTypeMutation(\n  $id: sheq_incident_investigation_test_type_list_pk_columns_input!\n  $_set: sheq_incident_investigation_test_type_list_set_input!\n) {\n  update_sheq_incident_investigation_test_type_list_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "8c6b38f55b0c18003946a7eaafaf7757";

module.exports = node;
