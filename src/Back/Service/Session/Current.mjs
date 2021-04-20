/**
 * Service to get current user data for session established before.
 * User data is placed by 'Fl32_Ap_User_Plugin_Http2_Handler_Session' into shared context for HTTP2 request.
 *
 * @namespace Fl32_Ap_User_Back_Service_Session_Current
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_Session_Current';

/**
 * Service to get current user data for session established before.
 * @implements TeqFw_Http2_Api_Service_Factory
 */
class Fl32_Ap_User_Back_Service_Session_Current {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Defaults} */
        const DEF = spec['Fl32_Ap_User_Defaults$']; // instance singleton
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result']; // class
        /** @type {typeof Fl32_Ap_User_Shared_Service_Route_Session_Current.Response} */
        const Response = spec['Fl32_Ap_User_Shared_Service_Route_Session_Current#Response']; // ES6 module

        // DEFINE INSTANCE METHODS

        this.getRoute = () => DEF.SERV_session_current;

        // does not used with empty request
        // this.createInputParser = function () {};

        /**
         * Factory to create service (handler to process HTTP API request).
         * @returns {function(TeqFw_Http2_Plugin_Handler_Service.Context): TeqFw_Http2_Plugin_Handler_Service.Result}
         */
        this.createService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Http2_Plugin_Handler_Service.Context} apiCtx
             * @returns {Promise<TeqFw_Http2_Plugin_Handler_Service.Result>}
             * @memberOf Fl32_Ap_User_Back_Service_Session_Current
             */
            async function service(apiCtx) {
                const result = new ApiResult();
                result.response = new Response();
                const shared = apiCtx.sharedContext;
                if (shared && shared[DEF.HTTP_SHARED_CTX_USER]) {
                    result.response.user = shared[DEF.HTTP_SHARED_CTX_USER];
                }
                return result;
            }

            // COMPOSE RESULT
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        };
    }

}

export default Fl32_Ap_User_Back_Service_Session_Current;
