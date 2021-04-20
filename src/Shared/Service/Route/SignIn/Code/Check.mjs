/**
 * Request and response structure for service to check one-time sign-in code and to initiate new session.
 *
 * @namespace Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check
 */

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check
 */
class Request {
    /** @type {String} */
    code;
}

/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Check
 */
class Response {
    /** @type {String} */
    sessionId;
}

// MODULE'S EXPORT
export {
    Request,
    Response,
};
