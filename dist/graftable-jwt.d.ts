import { IncomingHttpHeaders, ServerResponse } from 'http';
declare function jwtClaimsToReq(): (req: {
    headers: IncomingHttpHeaders;
    jwtClaims: any;
}, _res: ServerResponse, next: Function) => any;
export default jwtClaimsToReq;
