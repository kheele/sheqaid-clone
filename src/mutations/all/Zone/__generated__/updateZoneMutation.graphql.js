/**
 * @generated SignedSource<<5f81691822962cd3fd47919881ddf2bb>>
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
    "concreteType": "default_zones",
    "kind": "LinkedField",
    "name": "update_default_zones_by_pk",
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
    "name": "updateZoneMutation",
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
    "name": "updateZoneMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "c32bf22150bda39e75f80c622ba00990",
    "id": null,
    "metadata": {},
    "name": "updateZoneMutation",
    "operationKind": "mutation",
    "text": "mutation updateZoneMutation(\n  $id: default_zones_pk_columns_input!\n  $_set: default_zones_set_input!\n) {\n  update_default_zones_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "a28035afec3358b7d89f33c58be0e4ea";

module.exports = node;
