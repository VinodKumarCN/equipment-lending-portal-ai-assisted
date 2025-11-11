const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String
    email: String
    role: String
  }

  type Equipment {
    id: ID!
    name: String
    category: String
    condition: String
    totalQty: Int
    availableQty: Int
    description: String
    createdAt: Date
    updatedAt: Date
  }

  type Request {
    id: ID!
    userId: String
    equipmentId: String
    quantity: Int
    status: String
    requestDate: Date
    approvedBy: String
    issuedAt: Date
    returnedAt: Date
    dueDate: Date
    notes: String
  }

  type Query {
    login(email: String!, password: String!): String
    me: User
    equipmentList(q: String, category: String, available: Boolean): [Equipment]
    myRequests: [Request]
    allRequests(status: String): [Request]
  }

  input EquipmentInput {
    name: String!
    category: String
    condition: String
    totalQty: Int!
    description: String
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!, role: String): String
    addEquipment(input: EquipmentInput!): Equipment
    editEquipment(id: ID!, input: EquipmentInput!): Equipment
    deleteEquipment(id: ID!): Boolean
    requestEquipment(equipmentId: ID!, quantity: Int!, notes: String): Request
    approveRequest(id: ID!): Request
    issueRequest(id: ID!, dueDate: String): Request
    returnRequest(id: ID!): Request
  }
`;

module.exports = typeDefs;
