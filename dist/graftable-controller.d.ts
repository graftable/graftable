/// <reference types="node" />
/// <reference types="node/http" />
/// <reference types="postgraphile/build/postgraphile/http/frameworks" />
declare const postgraphileController: import("postgraphile").HttpRequestHandler<import("http").IncomingMessage, import("http").ServerResponse>;
declare const config: {
    api: {
        bodyParser: boolean;
        externalResolver: boolean;
    };
};
export default postgraphileController;
export { config, postgraphileController };
