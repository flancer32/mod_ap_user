/**
 * Get current user data for session established before.
 * User data is placed by 'Fl32_Ap_User_Plugin_Web_Handler_Session' into shared context for web request.
 *
 * @namespace Fl32_Ap_User_Back_Service_Session_Current
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Service_Session_Current';

/**
 * @implements TeqFw_Web_Back_Api_Service_IFactory
 */
export default class Fl32_Ap_User_Back_Service_Session_Current {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Back_Defaults} */
        const DEF = spec['Fl32_Ap_User_Back_Defaults$'];
        /** @type {typeof TeqFw_Http2_Plugin_Handler_Service.Result} */
        const ApiResult = spec['TeqFw_Http2_Plugin_Handler_Service#Result'];
        /** @type {typeof Fl32_Ap_User_Shared_Service_Route_Session_Current.Response} */
        const Response = spec['Fl32_Ap_User_Shared_Service_Route_Session_Current#Response'];
        /** @type {Fl32_Ap_User_Shared_Service_Route_Session_Current.Factory} */
        const route = spec['Fl32_Ap_User_Shared_Service_Route_Session_Current#Factory$'];


        // DEFINE INSTANCE METHODS

        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS
            /**
             * @param {TeqFw_Web_Back_Api_Service_IContext} context
             * @return Promise<void>
             */
            async function service(context) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Ap_User_Shared_Service_Route_Session_Current.Request} */
                // const req = context.getInData();
                /** @type {Fl32_Ap_User_Shared_Service_Route_Session_Current.Response} */
                const res = context.getOutData();
                const shared = context.getHandlersShare();
                //
                if (shared && shared[DEF.HTTP_SHARE_CTX_USER]) {
                    res.user = shared[DEF.HTTP_SHARE_CTX_USER];
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.${service.name}`});
            return service;
        }
    }

}
