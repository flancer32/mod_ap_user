/**
 * Service to check one-time sign-in code and to initiate new session.
 * Session ID is returned in response and as a cookie.
 *
 * @namespace Fl32_Ap_User_Back_Service_SignIn_Code_Check
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_SignIn_Code_Check';

/**
 * Service to check one-time sign-in code and to initiate new session.
 * @implements TeqFw_Http2_Api_Service_Factory
 */
class Fl32_Ap_User_Back_Service_SignIn_Code_Check {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Defaults} */
        const DEF = spec['Fl32_Ap_User_Defaults$']; // instance singleton
        /** @type {TeqFw_Core_App_Front_Data_Config} */
        const config = spec[DEF.MOD_CORE.DI_CONFIG]; // named singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result']; // class
        const {
            /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check.Request} */
            Request,
            /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check.Response} */
            Response
        } = spec['Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check']; // ES6 module
        /** @function {@type TeqFw_Http2_Back_Util.createCookie} */
        const createCookie = spec['TeqFw_Http2_Back_Util#createCookie']; // function singleton
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signin} */
        const ESignIn = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signin#']; // class
        /** @function {@type Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp.process} */
        const procCleanUp = spec['Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp$']; // function singleton
        /** @function {@type Fl32_Ap_User_Back_Process_Session_Create.process} */
        const procCreate = spec['Fl32_Ap_User_Back_Process_Session_Create$']; // function singleton
        /** @function {@type Fl32_Ap_User_Back_Process_SignIn_Code_Remove.process} */
        const procRemove = spec['Fl32_Ap_User_Back_Process_SignIn_Code_Remove$']; // function singleton

        // DEFINE INSTANCE METHODS

        this.getRoute = () => DEF.SERV_signIn_code_check;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {function(TeqFw_Http2_Back_Server_Stream_Context): Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check.Request}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check.Request}
             * @memberOf Fl32_Ap_User_Back_Service_SignIn_Code_Check
             */
            function parse(context) {
                const body = JSON.parse(context.body);
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            // COMPOSE RESULT
            Object.defineProperty(parse, 'name', {value: `${NS}.${parse.name}`});
            return parse;
        };

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {function(TeqFw_Http2_Plugin_Handler_Service.Context): TeqFw_Http2_Plugin_Handler_Service.Result}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Plugin_Handler_Service.Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Plugin_Handler_Service.Result>}
             * @memberOf Fl32_Ap_User_Back_Service_SignIn_Code_Check
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS
                /**
                 * @param trx
                 * @param {String} code
                 * @returns {Promise<null|Number>}
                 */
                async function getUserIdByCode(trx, code) {
                    const query = trx.from(ESignIn.ENTITY);
                    query.select([ESignIn.A_USER_REF]);
                    query.where({[ESignIn.A_CODE]: code});
                    /** @type {Array} */
                    const rs = await query;
                    if (rs.length === 1) {
                        const [first] = rs;
                        return first[ESignIn.A_USER_REF];
                    } else {
                        return null;
                    }
                }

                /**
                 * @param trx
                 * @param {Number} userId
                 * @returns {Promise<{cookie: *, sessionId: string}>}
                 */
                async function initSession(trx, userId) {
                    // generate user session
                    const {output} = await procCreate({trx, userId});
                    const sessionId = output.sessId;
                    // set session cookie
                    const realm = config.local.web.realmDef;
                    const cookie = createCookie({
                        name: DEF.DATA_SESS_COOKIE_NAME,
                        value: sessionId,
                        expires: DEF.DATA_SESS_COOKIE_LIFETIME,
                        path: `/${realm}`
                    });
                    return {sessionId, cookie};
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check.Request} */
                const apiReq = apiCtx.request;
                // const shared = apiCtx.sharedContext;
                const result = new ApiResult();
                const response = new Response();
                result.response = response;

                // start DB transaction to process all service activity in once
                const trx = await rdb.startTransaction();
                try {
                    const code = apiReq.code;
                    await procCleanUp({trx}); // clean up expired codes before checking
                    const userId = await getUserIdByCode(trx, code);
                    if (userId !== null) {
                        await procRemove({trx, code});
                        const {sessionId, cookie} = await initSession(trx, userId);
                        result.headers[H2.HTTP2_HEADER_SET_COOKIE] = cookie;
                        response.sessionId = sessionId;
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            // COMPOSE RESULT
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        };
    }

    // DEFINE PROTO METHODS
}

export default Fl32_Ap_User_Back_Service_SignIn_Code_Check;
