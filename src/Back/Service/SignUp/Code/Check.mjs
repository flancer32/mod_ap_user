/**
 * Check sign-up code and create new user. Initiate new user session if succeed.
 * Session ID is returned in response and as a cookie.
 *
 * @namespace Fl32_Ap_User_Back_Service_SignUp_Code_Check
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_SignUp_Code_Check';

/**
 * Check sign-up code and create new user.
 * @implements TeqFw_Http2_Api_Back_Service_Factory
 */
class Fl32_Ap_User_Back_Service_SignUp_Code_Check {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Defaults} */
        const DEF = spec['Fl32_Ap_User_Defaults$']; // instance singleton
        /** @type {TeqFw_Core_Back_RDb_Connector} */
        const rdb = spec['TeqFw_Core_Back_RDb_Connector$'];  // instance singleton
        const {
            /** @type {TeqFw_Core_Shared_Util.formatDate} */
            formatDate
        } = spec['TeqFw_Core_Shared_Util']; // ES6 module
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result']; // class
        const {
            /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Request} */
            Request,
            /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Response} */
            Response
        } = spec['Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check']; // ES6 module
        /** @type {Function|Fl32_Ap_User_Back_Process_SignUp_Code_CleanUp.process} */
        const procCleanUpExpired = spec['Fl32_Ap_User_Back_Process_SignUp_Code_CleanUp$']; // function singleton
        /** @type {Function|Fl32_Ap_User_Back_Process_SignUp_Code_Remove.process} */
        const procRemove = spec['Fl32_Ap_User_Back_Process_SignUp_Code_Remove$']; // function singleton
        /** @type {Function|Fl32_Ap_User_Back_Process_User_Create.process} */
        const procUserCreate = spec['Fl32_Ap_User_Back_Process_User_Create$']; // function singleton
        /** @type {Function|Fl32_Ap_User_Back_Process_Session_Create.process} */
        const procSessCreate = spec['Fl32_Ap_User_Back_Process_Session_Create$']; // function singleton
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signup} */
        const ESignUp = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signup#']; // class

        // DEFINE INSTANCE METHODS

        this.getRoute = () => DEF.SERV_signUp_code_check;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {function(TeqFw_Http2_Back_Server_Stream_Context): Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Request}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Request}
             * @memberOf Fl32_Ap_User_Back_Service_SignUp_Code_Check
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
             * @memberOf Fl32_Ap_User_Back_Service_SignUp_Code_Check
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS
                /**
                 * @param trx
                 * @param {String} code
                 * @returns {Promise<null|Number>}
                 */
                async function getParentIdByCode(trx, code) {
                    const query = trx.from(ESignUp.ENTITY);
                    query.select([ESignUp.A_USER_REF]);
                    query.where({[ESignUp.A_CODE]: code});
                    /** @type {Array} */
                    const rs = await query;
                    if (rs.length === 1) {
                        const [first] = rs;
                        return first[ESignUp.A_USER_REF];
                    } else {
                        return null;
                    }
                }

                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                const response = new Response();
                result.response = response;
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check.Request} */
                const apiReq = apiCtx.request;
                const shared = apiCtx.sharedContext;
                // don't start transaction if not required
                const trx = await rdb.startTransaction();
                try {
                    const code = apiReq.code;
                    const realm = apiReq.realm;
                    await procCleanUpExpired({trx});
                    const parentId = await getParentIdByCode(trx, code);
                    if (parentId !== null) {
                        await procRemove({trx, code});
                        const {userId} = await procUserCreate({trx, parentId});
                        const {sessionId, cookie} = await procSessCreate({trx, userId, realm});
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

export default Fl32_Ap_User_Back_Service_SignUp_Code_Check;
