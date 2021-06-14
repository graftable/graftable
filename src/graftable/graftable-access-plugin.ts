import { makeWrapResolversPlugin } from 'graphile-utils';
import jwt from 'jwt-simple';
import { GRAFTABLE_PREFIX, jwtAlgorithm } from './graftable-config';

// LOOK: Configure JWT_SECRET here outside of graftable-config.
//       Contains secret not to be imported or used from client-side files.
const { [GRAFTABLE_PREFIX + 'JWT_SECRET']: jwtSecret } = process.env;
// TODO check secret

const GraphqlAccessPlugin = makeWrapResolversPlugin(
  context => {
    if (context.scope.isRootMutation || context.scope.isRootQuery) {
      if (context.scope.fieldName === 'authenticate') {
        return { scope: context.scope };
      }
    }
    // TODO logged-out query and mutation allow list here
    return null;
  },
  () => async (resolve, source, args, context, info) => {
    // context.setJwtClaims();
    if (!context.jwtClaims || !context.jwtClaims.sub) {
      throw new Error('Please invoke `authenticate` before using other query or mutation operations.');
    }
    return resolve(source, args, context, info);
  }
);

export default GraphqlAccessPlugin;
export { GraphqlAccessPlugin };
