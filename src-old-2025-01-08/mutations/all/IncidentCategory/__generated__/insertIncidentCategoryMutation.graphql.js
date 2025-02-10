/**
 * @generated SignedSource<<18224f8dee7ea4f5304ac9a7ed8732c4>>
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
    "concreteType": "sheq_incident_investigation_categories",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_categories_one",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
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
    "name": "insertIncidentCategoryMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentCategoryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1de9e675e7e6094e2f785feaaa16eac4",
    "id": null,
    "metadata": {},
    "name": "insertIncidentCategoryMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentCategoryMutation(\n  $object: sheq_incident_investigation_categories_insert_input!\n) {\n  insert_sheq_incident_investigation_categories_one(object: $object) {\n    id\n    name\n  }\n}\n"
  }
};
})();

node.hash = "c56665de8e3026d2a67b7c9d15425a15";

module.exports = node;
