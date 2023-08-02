/**
 * @generated SignedSource<<ca2988099b57fa2261b8afc81547f76c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "code"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "username",
  "storageKey": null
},
v5 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "default_companies",
  "kind": "LinkedField",
  "name": "company",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v9 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "status",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "default_contractors",
    "kind": "LinkedField",
    "name": "contractor",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "default_sites",
    "kind": "LinkedField",
    "name": "site",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      (v3/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/)
    ],
    "storageKey": null
  }
],
v10 = [
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
          },
          {
            "fields": [
              {
                "kind": "Variable",
                "name": "_eq",
                "variableName": "code"
              }
            ],
            "kind": "ObjectValue",
            "name": "password_otp"
          }
        ],
        "kind": "ObjectValue",
        "name": "where"
      }
    ],
    "concreteType": "default_contractorsConnection",
    "kind": "LinkedField",
    "name": "default_contractors_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_contractorsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_contractors",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "created_at",
                "storageKey": null
              },
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "inc_contractor_pack",
                "storageKey": null
              },
              {
                "alias": "site_pending_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Pending"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Pending\"}})"
              },
              {
                "alias": "site_accepted_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Accepted"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Accepted\"}})"
              },
              {
                "alias": "site_declined_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Declined"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Declined\"}})"
              },
              {
                "alias": "site_cancelled_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Cancelled"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Cancelled\"}})"
              },
              {
                "alias": "site_removed_list",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "status": {
                        "_eq": "Removed"
                      }
                    }
                  }
                ],
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": "site_list(where:{\"status\":{\"_eq\":\"Removed\"}})"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_contractors__sites",
                "kind": "LinkedField",
                "name": "site_list",
                "plural": true,
                "selections": (v9/*: any*/),
                "storageKey": null
              },
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "confirmOTPContractorMutation",
    "selections": (v10/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "confirmOTPContractorMutation",
    "selections": (v10/*: any*/)
  },
  "params": {
    "cacheID": "efdfca21a2348321af9739d9bbceb61e",
    "id": null,
    "metadata": {},
    "name": "confirmOTPContractorMutation",
    "operationKind": "query",
    "text": "query confirmOTPContractorMutation(\n  $id: bigint\n  $code: String\n) {\n  default_contractors_connection(where: {id: {_eq: $id}, password_otp: {_eq: $code}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n        username\n        inc_contractor_pack\n        site_pending_list: site_list(where: {status: {_eq: \"Pending\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_accepted_list: site_list(where: {status: {_eq: \"Accepted\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_declined_list: site_list(where: {status: {_eq: \"Declined\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_cancelled_list: site_list(where: {status: {_eq: \"Cancelled\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_removed_list: site_list(where: {status: {_eq: \"Removed\"}}) {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        site_list {\n          id\n          status\n          contractor {\n            id\n            name\n            username\n          }\n          site {\n            id\n            name\n            company {\n              id\n              name\n            }\n            client {\n              id\n              name\n            }\n            project {\n              id\n              name\n            }\n          }\n        }\n        company {\n          id\n          name\n        }\n        client {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "081109b2964c378cb1d0ee699653432d";

module.exports = node;
