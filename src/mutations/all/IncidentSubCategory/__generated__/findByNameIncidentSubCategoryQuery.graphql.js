/**
 * @generated SignedSource<<8feede04fad938eef004edbbec5af008>>
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
    "name": "name"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "name"
              }
            ],
            "kind": "ObjectValue",
            "name": "name"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "sheq_incident_investigation_sub_categoriesConnection",
    "kind": "LinkedField",
    "name": "sheq_incident_investigation_sub_categories_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_incident_investigation_sub_categoriesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_incident_investigation_sub_categories",
            "kind": "LinkedField",
            "name": "node",
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
    "name": "findByNameIncidentSubCategoryQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByNameIncidentSubCategoryQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d2271ec1c50df0e89e61223df8934eaf",
    "id": null,
    "metadata": {},
    "name": "findByNameIncidentSubCategoryQuery",
    "operationKind": "query",
    "text": "query findByNameIncidentSubCategoryQuery(\n  $name: String\n) {\n  sheq_incident_investigation_sub_categories_connection(where: {name: {_eq: $name}}) {\n    edges {\n      node {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "db2d2e8bbdf63aa97cae34522033ae69";

module.exports = node;
