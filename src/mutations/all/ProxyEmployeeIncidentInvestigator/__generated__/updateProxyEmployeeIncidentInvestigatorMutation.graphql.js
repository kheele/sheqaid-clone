/**
 * @generated SignedSource<<71035b58d3256a78528977272efbce21>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "proxy_incident__investigator",
    "kind": "LinkedField",
    "name": "update_proxy_incident__investigator_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateProxyEmployeeIncidentInvestigatorMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateProxyEmployeeIncidentInvestigatorMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "b4692170effb7942ed98681e81b15290",
    "id": null,
    "metadata": {},
    "name": "updateProxyEmployeeIncidentInvestigatorMutation",
    "operationKind": "mutation",
    "text": "mutation updateProxyEmployeeIncidentInvestigatorMutation(\n  $id: proxy_incident__investigator_pk_columns_input!\n  $_set: proxy_incident__investigator_set_input!\n) {\n  update_proxy_incident__investigator_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "38a1bd1dc4a89a0e17b3c1d00d05cd5a";

module.exports = node;
