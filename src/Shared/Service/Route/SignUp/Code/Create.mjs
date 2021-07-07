/**
 * Route data for service to create sign-up code.
 *
 * @namespace Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create
 */
class Request {
    /** @type {Date} */
    dateExpired;
    /** @type {boolean} */
    onetime;
}

/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create
 */
class Response {
    /**
     * Code to compose sign-up URL.
     * @type {string}
     */
    code;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_Service_Factory_IRoute
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Fl32_Ap_User_Shared_Defaults} */
        const DEF = spec['Fl32_Ap_User_Shared_Defaults$'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WEB_SIGNUP_CODE_CREATE}`;

        /**
         * @param {Request|null} data
         * @return {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.dateExpired = data?.dateExpired
                ? (data.dateExpired instanceof Date) ? data.dateExpired : new Date(data?.dateExpired)
                : null;
            res.onetime = data?.onetime ?? true;
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.code = data?.code;
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
