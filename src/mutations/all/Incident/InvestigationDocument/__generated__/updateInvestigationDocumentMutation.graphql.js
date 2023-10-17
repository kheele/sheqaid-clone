/**
 * @generated SignedSource<<cfeb868f33ab61a27536e9492ae8a9dc>>
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
    "concreteType": "sheq_incident_investigation_investigations_docs",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_investigations_docs_by_pk",
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
    "name": "updateInvestigationDocumentMutation",
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
    "name": "updateInvestigationDocumentMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "419b63ed3bf7c5e724c98b10e5de3778",
    "id": null,
    "metadata": {},
    "name": "updateInvestigationDocumentMutation",
    "operationKind": "mutation",
    "text": "mutation updateInvestigationDocumentMutation(\n  $id: sheq_incident_investigation_investigations_docs_pk_columns_input!\n  $_set: sheq_incident_investigation_investigations_docs_set_input!\n) {\n  update_sheq_incident_investigation_investigations_docs_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "f31445b55feb59712561fb87b94c9290";

module.exports = node;
