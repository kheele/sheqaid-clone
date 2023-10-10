/**
 * @generated SignedSource<<60939ac2972b43d533fec9b5c88a0739>>
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
    "concreteType": "sheq_training_toolbox_talk_subjectsConnection",
    "kind": "LinkedField",
    "name": "sheq_training_toolbox_talk_subjects_connection",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "sheq_training_toolbox_talk_subjectsEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "sheq_training_toolbox_talk_subjects",
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
                "name": "created_at",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
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
    "name": "findByIdTrainingToolboxTalkSubjectQuery",
    "selections": (v1/*: any*/),
    "type": "query_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "findByIdTrainingToolboxTalkSubjectQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7ad1d034ca02ad226c3dae97141bd48a",
    "id": null,
    "metadata": {},
    "name": "findByIdTrainingToolboxTalkSubjectQuery",
    "operationKind": "query",
    "text": "query findByIdTrainingToolboxTalkSubjectQuery(\n  $id: bigint\n) {\n  sheq_training_toolbox_talk_subjects_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "cc646fb9884a109134078a74f6e30218";

module.exports = node;
