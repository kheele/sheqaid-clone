/**
 * @generated SignedSource<<819432c28eaf598585464811e709cf80>>
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
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mon"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mon2"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mon3"
  }
],
v1 = {
  "_eq": false
},
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "hr_employees_docs_leaves_aggregate_fields",
    "kind": "LinkedField",
    "name": "aggregate",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "count",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v3 = {
  "kind": "Literal",
  "name": "removed",
  "value": (v1/*: any*/)
},
v4 = [
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
    "concreteType": "default_clientsConnection",
    "kind": "LinkedField",
    "name": "default_clients_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "default_clientsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "default_clients",
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
                "alias": "list_active_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "removed": (v1/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": "leave_list_aggregate(where:{\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "list_removed_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "removed": {
                        "_eq": true
                      }
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": "leave_list_aggregate(where:{\"removed\":{\"_eq\":true}})"
              },
              {
                "alias": "list_no_expiry_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "expiry_date": {
                        "_is_null": true
                      },
                      "removed": (v1/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": "leave_list_aggregate(where:{\"expiry_date\":{\"_is_null\":true},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "list_expired_aggregate",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "where",
                    "value": {
                      "expiry_date": {
                        "_lte": "now()"
                      },
                      "removed": (v1/*: any*/)
                    }
                  }
                ],
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": "leave_list_aggregate(where:{\"expiry_date\":{\"_lte\":\"now()\"},\"removed\":{\"_eq\":false}})"
              },
              {
                "alias": "list_mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "kind": "Literal",
                            "name": "_gt",
                            "value": "now()"
                          },
                          {
                            "kind": "Variable",
                            "name": "_lte",
                            "variableName": "mon"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "expiry_date"
                      },
                      (v3/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": "list_2mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "_gt",
                            "variableName": "mon"
                          },
                          {
                            "kind": "Variable",
                            "name": "_lte",
                            "variableName": "mon2"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "expiry_date"
                      },
                      (v3/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": "list_3mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "_gt",
                            "variableName": "mon2"
                          },
                          {
                            "kind": "Variable",
                            "name": "_lte",
                            "variableName": "mon3"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "expiry_date"
                      },
                      (v3/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": "list_4mon_expiry_aggregate",
                "args": [
                  {
                    "fields": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "_gt",
                            "variableName": "mon3"
                          }
                        ],
                        "kind": "ObjectValue",
                        "name": "expiry_date"
                      },
                      (v3/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "where"
                  }
                ],
                "concreteType": "hr_employees_docs_leaves_aggregate",
                "kind": "LinkedField",
                "name": "leave_list_aggregate",
                "plural": false,
                "selections": (v2/*: any*/),
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
    "name": "findByIdClientHRLeavesDashboardStatsQuery",
    "selections": (v4/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdClientHRLeavesDashboardStatsQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "9e33699f4549718ff1d81eab9630c61f",
    "id": null,
    "metadata": {},
    "name": "findByIdClientHRLeavesDashboardStatsQuery",
    "operationKind": "query",
    "text": "query findByIdClientHRLeavesDashboardStatsQuery(\n  $id: bigint\n  $mon: date\n  $mon2: date\n  $mon3: date\n) {\n  default_clients_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        list_active_aggregate: leave_list_aggregate(where: {removed: {_eq: false}}) {\n          aggregate {\n            count\n          }\n        }\n        list_removed_aggregate: leave_list_aggregate(where: {removed: {_eq: true}}) {\n          aggregate {\n            count\n          }\n        }\n        list_no_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_is_null: true}}) {\n          aggregate {\n            count\n          }\n        }\n        list_expired_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_lte: \"now()\"}}) {\n          aggregate {\n            count\n          }\n        }\n        list_mon_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: \"now()\", _lte: $mon}}) {\n          aggregate {\n            count\n          }\n        }\n        list_2mon_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}}) {\n          aggregate {\n            count\n          }\n        }\n        list_3mon_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n        list_4mon_expiry_aggregate: leave_list_aggregate(where: {removed: {_eq: false}, expiry_date: {_gt: $mon3}}) {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "d29d49aa06ceba2ab8c159830ea937c3";

module.exports = node;
