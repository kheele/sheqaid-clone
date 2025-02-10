/**
 * @generated SignedSource<<4e8dab55a888020d0a1f8a1b0f1c750d>>
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
    "cacheID": "6bf2a81f4e7a06302c507ca94228eff3",
    "id": null,
    "metadata": {},
    "name": "findByIdTrainingToolboxTalkSubjectQuery",
    "operationKind": "query",
    "text": "query findByIdTrainingToolboxTalkSubjectQuery(\n  $id: bigint\n) {\n  sheq_training_toolbox_talk_subjects_connection(where: {id: {_eq: $id}}) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();

node.hash = "03addceb30892bb8d268ecd6f3c56672";

module.exports = node;
