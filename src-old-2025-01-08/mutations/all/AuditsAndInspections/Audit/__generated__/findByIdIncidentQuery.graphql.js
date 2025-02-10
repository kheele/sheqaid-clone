/**
 * @generated SignedSource<<8d8d2377d0a181b2946c8a482f207e06>>
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
    "name": "id"
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
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "type",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "doc_num",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "doc",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "expiry",
    "storageKey": null
  }
],
v4 = [
  (v1/*: any*/),
  (v2/*: any*/)
],
v5 = [
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
                "variableName": "id"
              }
            ],
            "kind": "ObjectValue",
            "name": "id"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "sheq_compliance_auditsConnection",
    "kind": "LinkedField",
    "name": "sheq_compliance_audits_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_compliance_auditsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_compliance_audits",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "category",
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
                "concreteType": "default_doc_versions",
                "kind": "LinkedField",
                "name": "doc_version_list",
                "plural": true,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": "latest_version",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "order_by",
                    "value": {
                      "expiry": "desc_nulls_last"
                    }
                  }
                ],
                "concreteType": "default_doc_versions",
                "kind": "LinkedField",
                "name": "doc_version_list",
                "plural": true,
                "selections": (v3/*: any*/),
                "storageKey": "doc_version_list(order_by:{\"expiry\":\"desc_nulls_last\"})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_sites",
                "kind": "LinkedField",
                "name": "contractor_site",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "default_contractors",
                "kind": "LinkedField",
                "name": "contractor",
                "plural": false,
                "selections": (v4/*: any*/),
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
    "name": "findByIdAuditQuery",
    "selections": (v5/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdAuditQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "97afed9a3cf23c186a9252c59fb9f937",
    "id": null,
    "metadata": {},
    "name": "findByIdAuditQuery",
    "operationKind": "query",
    "text": "query findByIdAuditQuery(\n  $id: bigint\n) {\n  sheq_compliance_audits_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        category\n        desc\n        doc_version_list {\n          id\n          type\n          doc_num\n          doc\n          expiry\n        }\n        latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}) {\n          id\n          type\n          doc_num\n          doc\n          expiry\n        }\n        contractor_site {\n          id\n          name\n        }\n        contractor {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "6ae360ef222531bc2663ff01a890a53f";

module.exports = node;
