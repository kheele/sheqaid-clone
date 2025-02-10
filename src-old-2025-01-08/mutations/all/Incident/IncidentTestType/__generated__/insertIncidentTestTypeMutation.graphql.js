/**
 * @generated SignedSource<<5bc1c016750f55b4f8fafadaf3f900a6>>
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
    "concreteType": "sheq_incident_investigation_test_type_list",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_test_type_list_one",
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
    "name": "insertIncidentTestTypeMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentTestTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f8948e33705a67911680758cd89aa53a",
    "id": null,
    "metadata": {},
    "name": "insertIncidentTestTypeMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentTestTypeMutation(\n  $object: sheq_incident_investigation_test_type_list_insert_input!\n) {\n  insert_sheq_incident_investigation_test_type_list_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "9e3f1fee90c0817c63809c042eb3dfea";

module.exports = node;
