/**
 * @generated SignedSource<<83803cb568d976199f61e7ff87690e1e>>
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
v2 = [
  (v1/*: any*/)
],
v3 = [
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
    "concreteType": "sheq_incident_investigation_investigationsConnection",
    "kind": "LinkedField",
    "name": "sheq_incident_investigation_investigations_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_incident_investigation_investigationsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_incident_investigation_investigations",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "due_date",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_incident_investigation_investigations_docs",
                "kind": "LinkedField",
                "name": "document_list",
                "plural": true,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_incident_investigation_investigations_findings",
                "kind": "LinkedField",
                "name": "investigation_finding_list",
                "plural": true,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "proxy_incident__investigator",
                "kind": "LinkedField",
                "name": "investigation_team_list",
                "plural": true,
                "selections": (v2/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "sheq_incident_investigation",
                "kind": "LinkedField",
                "name": "incident_list",
                "plural": true,
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
    "name": "findByIdIncidentInvestigationQuery",
    "selections": (v3/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdIncidentInvestigationQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "e411c918b8a8bf902937dc90ec70e3b2",
    "id": null,
    "metadata": {},
    "name": "findByIdIncidentInvestigationQuery",
    "operationKind": "query",
    "text": "query findByIdIncidentInvestigationQuery(\n  $id: bigint\n) {\n  sheq_incident_investigation_investigations_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        due_date\n        document_list {\n          id\n        }\n        investigation_finding_list {\n          id\n        }\n        investigation_team_list {\n          id\n        }\n        incident_list {\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "bdd0a96a328ecdc806025768c43c4779";

module.exports = node;
