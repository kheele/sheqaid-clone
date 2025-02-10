/**
 * @generated SignedSource<<052934580650bd7d726441010d65ae27>>
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
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "proxy_incident__investigator",
    "kind": "LinkedField",
    "name": "insert_proxy_incident__investigator_one",
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
    "name": "insertProxyEmployeeIncidentInvestigatorMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyEmployeeIncidentInvestigatorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "41668411d031dca5e2488bcd63313432",
    "id": null,
    "metadata": {},
    "name": "insertProxyEmployeeIncidentInvestigatorMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyEmployeeIncidentInvestigatorMutation(\n  $object: proxy_incident__investigator_insert_input!\n) {\n  insert_proxy_incident__investigator_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "ebef9cf78aec6aec19f0024ab92affeb";

module.exports = node;
