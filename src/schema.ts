import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Team {
    name: String!
    abbreviation: String!
    logoUrl: String!
  }

  type Match {
    id: ID!
    date: String!
    timeConfirmed: Boolean
    venue: String!
    championship: String!
    homeTeam: Team!
    awayTeam: Team!
    homeScore: String
    awayScore: String
    status: String!
    detailsLink: String
  }

  type Query {
    matches: [Match!]!
    match(id: ID!): Match
  }

  type Concert {
    id: ID!
    date: String!
    venue: String!
    detailsLink: String
    status: String!
    time: String!
  }

  type Query {
    concerts: [Concert!]!
    concert(id: ID!): Concert
  }
`;
