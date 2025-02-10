/**
 * @generated SignedSource<<c906e30ace484724c78928cf26142f5b>>
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
    "concreteType": "sheq_incident_investigation_docs",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_docs_by_pk",
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
    "name": "updateIncidentDocumentMutation",
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
    "name": "updateIncidentDocumentMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "01481a8a23d03ebbf01f165607c5cea2",
    "id": null,
    "metadata": {},
    "name": "updateIncidentDocumentMutation",
    "operationKind": "mutation",
    "text": "mutation updateIncidentDocumentMutation(\n  $id: sheq_incident_investigation_docs_pk_columns_input!\n  $_set: sheq_incident_investigation_docs_set_input!\n) {\n  update_sheq_incident_investigation_docs_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "0daf2c2b892349c0bd8ffe136067eb57";

module.exports = node;
