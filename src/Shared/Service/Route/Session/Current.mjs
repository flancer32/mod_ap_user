/**
 * Route data for service to get current user data.
 *
 * @namespace Fl32_Ap_User_Shared_Service_Route_Session_Current
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Shared_Service_Route_Session_Current';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_Session_Current
 */
class Request {}

/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_Session_Current
 */
class Response {
    /** @type {Fl32_Ap_User_Shared_Service_Data_User} */
    user;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_IRoute
 * @memberOf Fl32_Ap_User_Shared_Service_Route_Session_Current
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Shared_Defaults} */
        const DEF = spec['Fl32_Ap_User_Shared_Defaults$'];
        /** @type {typeof Fl32_Ap_User_Shared_Service_Data_User} */
        const DUser = spec['Fl32_Ap_User_Shared_Service_Data_User#'];
        /** @type {Fl32_Ap_User_Shared_Service_Data_User.Factory} */
        const fUser = spec['Fl32_Ap_User_Shared_Service_Data_User#Factory$'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WEB_SESSION_CURRENT}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Ap_User_Shared_Service_Route_Session_Current.Request}
         */
        this.createReq = function (data = null) {
            return new Request();
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Ap_User_Shared_Service_Route_Session_Current.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.user = (data?.user instanceof DUser) ? data.user : fUser.create(data?.user);
            return res;
        }
    }
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
export {
    Factory,
    Request,
    Response,
};
