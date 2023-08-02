/**
 * @generated SignedSource<<761aff6eb8924bbb1831385a610e510c>>
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
    "concreteType": "sheq_documents",
    "kind": "LinkedField",
    "name": "update_sheq_documents_by_pk",
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
    "name": "updateDocumentMutation",
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
    "name": "updateDocumentMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "144642284daee3b4b6b173f9cbec75da",
    "id": null,
    "metadata": {},
    "name": "updateDocumentMutation",
    "operationKind": "mutation",
    "text": "mutation updateDocumentMutation(\n  $id: sheq_documents_pk_columns_input!\n  $_set: sheq_documents_set_input!\n) {\n  update_sheq_documents_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "3531f38efdea06aec8b65b09de6ab02a";

module.exports = node;
