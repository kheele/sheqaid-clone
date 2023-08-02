/**
 * @generated SignedSource<<2eb13d09959efeb7adf08fa353e27b8b>>
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
    "concreteType": "sheq_incident_investigation_severityConnection",
    "kind": "LinkedField",
    "name": "sheq_incident_investigation_severity_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_incident_investigation_severityEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_incident_investigation_severity",
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
                "name": "consequence",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "likelihood",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "risk_rating",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "risk_rating_score",
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
    "name": "findByIdIncidentSeverityQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdIncidentSeverityQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "dfe025da889ed68445cdf3fd7513ddf9",
    "id": null,
    "metadata": {},
    "name": "findByIdIncidentSeverityQuery",
    "operationKind": "query",
    "text": "query findByIdIncidentSeverityQuery(\n  $id: bigint\n) {\n  sheq_incident_investigation_severity_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        consequence\n        likelihood\n        risk_rating\n        risk_rating_score\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "1dbeacee2eb15da8152d8a5aac489208";

module.exports = node;
