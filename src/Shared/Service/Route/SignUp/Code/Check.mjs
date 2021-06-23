/**
 * Request and response for "Check sign-up code and create new user" service.
 *
 * @namespace Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check';

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check
 */
class Request {
    /** @type {String} */
    code;
    /** @type {String} */
    realm;
}

/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignUp_Code_Check
 */
class Response {
    /** @type {String} */
    sessionId;
}

// MODULE'S EXPORT
Object.defineProperty(Request, 'name', {value: `${NS}.${Request.constructor.name}`});
Object.defineProperty(Response, 'name', {value: `${NS}.${Response.constructor.name}`});
export {
    Request,
    Response,
};
