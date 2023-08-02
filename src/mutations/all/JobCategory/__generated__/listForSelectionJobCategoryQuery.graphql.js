/**
 * @generated SignedSource<<4694874891a25c7f294f1b73eaedaff4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "default_job_categoriesConnection",
    "kind": "LinkedField",
    "name": "default_job_categories_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_job_categoriesEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_job_categories",
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "desc",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "job_category_owner",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "company_id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "client_id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "project_id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "site_id",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "listForSelectionJobCategoryQuery",
    "selections": (v0/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "listForSelectionJobCategoryQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "cff357236b183f51f57c1c89e6de4da6",
    "id": null,
    "metadata": {},
    "name": "listForSelectionJobCategoryQuery",
    "operationKind": "query",
    "text": "query listForSelectionJobCategoryQuery {\n  default_job_categories_connection {\n    edges {\n      node {\n        id\n        name\n        desc\n        job_category_owner\n        company_id\n        client_id\n        project_id\n        site_id\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "416ec96bcd873aa6d73a8f4b24a37cbc";

module.exports = node;
