/**
 * Service to send one-time sign-in code to user email.
 *
 * @namespace Fl32_Ap_User_Back_Service_SignIn_Code_Send
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_SignIn_Code_Send';

/**
 * Service to send one-time sign-in code to user email.
 * @implements TeqFw_Http2_Api_Service_Factory
 */
class Fl32_Ap_User_Back_Service_SignIn_Code_Send {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Defaults} */
        const DEF = spec['Fl32_Ap_User_Defaults$']; // instance singleton
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // instance singleton
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result']; // class
        const {
            /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Request} */
            Request,
            /** @type {typeof Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Response} */
            Response
        } = spec['Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send']; // ES6 module
        /** @function {@type Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp.process} */
        const procCleanUp = spec['Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp$']; // function singleton
        /** @function {@type Fl32_Ap_User_Back_Process_SignIn_Code_Create.process} */
        const procCreate = spec['Fl32_Ap_User_Back_Process_SignIn_Code_Create$']; // function singleton
        /** @function {@type Fl32_Ap_User_Back_Process_SignIn_Code_Email.process} */
        const procEmail = spec['Fl32_Ap_User_Back_Process_SignIn_Code_Email$']; // function singleton

        // DEFINE INSTANCE METHODS

        this.getRoute = () => DEF.SERV_signIn_code_send;

        /**
         * Factory to create function to validate and structure incoming data.
         * @returns {function(TeqFw_Http2_Back_Server_Stream_Context): Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Request}
         */
        this.createInputParser = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Back_Server_Stream_Context} context
             * @returns {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Request}
             * @memberOf Fl32_Ap_User_Back_Service_SignIn_Code_Send
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
             * @memberOf Fl32_Ap_User_Back_Service_SignIn_Code_Send
             */
            async function service(apiCtx) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send.Request} */
                const apiReq = apiCtx.request;
                // const shared = apiCtx.sharedContext;
                const result = new ApiResult();
                const response = new Response();
                result.response = response;
                response.isSent = false;

                // start DB transaction to process all service activity in once
                const trx = await rdb.startTransaction();
                try {
                    const email = apiReq.email;
                    const realm = apiReq.realm;
                    await procCleanUp({trx});
                    const code = await procCreate({trx, email});
                    if (code !== null) response.isSent = await procEmail({to: email, realm, code});
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

export default Fl32_Ap_User_Back_Service_SignIn_Code_Send;
