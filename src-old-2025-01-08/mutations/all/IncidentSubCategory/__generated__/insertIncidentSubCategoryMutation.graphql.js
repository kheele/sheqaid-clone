/**
 * @generated SignedSource<<7caa3932603f6cbd4e1b3f251bda5984>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "sheq_incident_investigation_sub_categories",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_sub_categories_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_incident_investigation_categories",
        "kind": "LinkedField",
        "name": "category",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
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
    "name": "insertIncidentSubCategoryMutation",
    "selections": (v3/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentSubCategoryMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "510456a02d0e1b3a33287be0c041205e",
    "id": null,
    "metadata": {},
    "name": "insertIncidentSubCategoryMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentSubCategoryMutation(\n  $object: sheq_incident_investigation_sub_categories_insert_input!\n) {\n  insert_sheq_incident_investigation_sub_categories_one(object: $object) {\n    id\n    name\n    category {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "bd9a61f9b21581618b7577e9a066a79c";

module.exports = node;
