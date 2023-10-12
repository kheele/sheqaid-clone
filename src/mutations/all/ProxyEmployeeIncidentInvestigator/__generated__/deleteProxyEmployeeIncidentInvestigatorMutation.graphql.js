/**
 * @generated SignedSource<<0372f562ccb73ad3c077da818276112d>>
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
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "proxy_incident__investigator",
    "kind": "LinkedField",
    "name": "delete_proxy_incident__investigator_by_pk",
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
    "name": "deleteProxyEmployeeIncidentInvestigatorMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteProxyEmployeeIncidentInvestigatorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5ed66ca5db92eb6a115324a9b7cb054e",
    "id": null,
    "metadata": {},
    "name": "deleteProxyEmployeeIncidentInvestigatorMutation",
    "operationKind": "mutation",
    "text": "mutation deleteProxyEmployeeIncidentInvestigatorMutation(\n  $id: bigint!\n) {\n  delete_proxy_incident__investigator_by_pk(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "319826341145acaa3b127a5b52643a8c";

module.exports = node;
