import { TAlgorithm } from 'jwt-simple';
import { PostGraphileOptions } from 'postgraphile';
declare const GRAFTABLE_PREFIX: string;
declare const DEFAULT_DATABASE_URL = "postgres://localhost/graphql";
declare const DEFAULT_DATABASE_SCHEMA = "public";
declare const databaseSchema: string, graphqlUrl: string, graphqlFile: string, jwtDataName: string, jwtSignatureName: string, otpSetupWindow: string | number, optStep: string | number, otpWindow: string | number;
declare const jwtAlgorithm: TAlgorithm;
declare const jwtMaxAge: number;
declare const postgraphileOptions: PostGraphileOptions;
export { DEFAULT_DATABASE_URL, DEFAULT_DATABASE_SCHEMA, GRAFTABLE_PREFIX, databaseSchema, graphqlFile, graphqlUrl, jwtDataName, jwtAlgorithm, jwtMaxAge, jwtSignatureName, otpSetupWindow, optStep, otpWindow, postgraphileOptions };
