/**
 * Create sign-up code to add new user.
 *
 * @namespace Fl32_Ap_User_Back_Service_SignUp_Code_Create
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_SignUp_Code_Create';

/**
 * Create sign-up code to add new user.
 * @implements TeqFw_Http2_Api_Back_Service_Factory
 */
class Fl32_Ap_User_Back_Service_SignUp_Code_Create {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Defaults} */
        const DEF = spec['Fl32_Ap_User_Defaults$']; // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        const {
            /** @type {TeqFw_Core_App_Shared_Util.formatDate} */
            formatDate
        } = spec['TeqFw_Core_App_Shared_Util']; // ES6 module
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result']; // class
        const {
            /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Request} */
            Request,
            /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Response} */
            Response
        } = spec['Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create']; // ES6 module
        /** @function {@type Fl32_Ap_User_Back_Process_SignUp_Code_Create.process} */
        const procCreate = spec['Fl32_Ap_User_Back_Process_SignUp_Code_Create$']; // function singleton

        // DEFINE INSTANCE METHODS

        this.getRoute = () => DEF.SERV_signUp_code_create;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {function(TeqFw_Http2_Back_Server_Stream_Context): Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Request}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Request}
             * @memberOf Fl32_Ap_User_Back_Service_SignUp_Code_Create
             */
            function parse(context) {
                const body = JSON.parse(context.body);
                // clone HTTP body into API request object and cast nested objects
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Request} */
                const result = Object.assign(new Request(), body.data);
                if (result.dateExpired) result.dateExpired = new Date(result.dateExpired);
                return result;
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
             * @memberOf Fl32_Ap_User_Back_Service_SignUp_Code_Create
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                const result = new ApiResult();
                const response = new Response();
                result.response = response;
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Request} */
                const apiReq = apiCtx.request;
                const shared = apiCtx.sharedContext;
                // don't start transaction if not required
                const trx = await rdb.startTransaction();
                try {
                    /** @type {Fl32_Ap_User_Shared_Service_Data_User} */
                    const user = shared[DEF.HTTP_SHARED_CTX_USER];
                    if (user) {
                        const userId = user.id;
                        const onetime = Boolean(apiReq.onetime);
                        const dateExpired = apiReq.dateExpired;
                        response.code = await procCreate({trx, userId, onetime, dateExpired});
                    } else {
                        result.headers[H2.HTTP2_HEADER_STATUS] = H2.HTTP_STATUS_UNAUTHORIZED;
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

export default Fl32_Ap_User_Back_Service_SignUp_Code_Create;
