/**
 * Request and response for "Create sign-up code" service.
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
    /** @type {Boolean} */
    onetime;
}

/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Create
 */
class Response {
    /**
     * Code to compose sign-up URL.
     * @type {String}
     */
    code;
}

// MODULE'S EXPORT
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
export {
    Request,
    Response,
};
