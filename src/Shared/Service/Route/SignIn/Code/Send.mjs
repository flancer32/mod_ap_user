/**
 * Request and response structure for service to send one-time sign-in code to user email.
 *
 * @namespace Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send
 */

// MODULE'S CLASSES
/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send
 */
class Request {
    /** @type {String} */
    email;
    /** @type {String} */
    realm;
}

/**
 * @memberOf Fl32_Ap_User_Shared_Service_Route_SignIn_Code_Send
 */
class Response {
    /** @type {Boolean} */
    isSent;
}

// MODULE'S EXPORT
export {
    Request,
    Response,
};
