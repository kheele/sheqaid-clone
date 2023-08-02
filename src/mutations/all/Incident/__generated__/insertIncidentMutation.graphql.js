/**
 * @generated SignedSource<<64302b3bf8513b3da3c7dcc20f765f6a>>
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
    "concreteType": "sheq_incident_investigation",
    "kind": "LinkedField",
    "name": "insert_sheq_incident_investigation_one",
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
    "name": "insertIncidentMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertIncidentMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "217dfbdedb85ef7b70da6db8d8d48f9f",
    "id": null,
    "metadata": {},
    "name": "insertIncidentMutation",
    "operationKind": "mutation",
    "text": "mutation insertIncidentMutation(\n  $object: sheq_incident_investigation_insert_input!\n) {\n  insert_sheq_incident_investigation_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "cdf8c07c2340cb16c31236315b3c766c";

module.exports = node;
