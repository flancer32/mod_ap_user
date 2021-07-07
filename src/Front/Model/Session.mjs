/**
 * User session model for frontend.
 *
 * @namespace Fl32_Ap_User_Front_Model_Session
 */
class Fl32_Ap_User_Front_Model_Session {
    constructor(spec) {
        /** @type {TeqFw_Web_Front_Service_Gate} */
        const gate = spec['TeqFw_Web_Front_Service_Gate$'];
        /** @type {Fl32_Ap_User_Shared_Service_Route_Session_Current.Factory} */
        const routeCur = spec['Fl32_Ap_User_Shared_Service_Route_Session_Current#Factory$'];
        // /** @type {Fl32_Teq_User_Front_Gate_Sign_Out.gate} */
        // const gateSignOut = spec['Fl32_Teq_User_Front_Gate_Sign_Out$'];
        // /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Sign_Out_Request} */
        // const SignOutRequest = spec['Fl32_Teq_User_Shared_Service_Route_Sign_Out#Request'];
        /** @type {typeof Fl32_Ap_User_Shared_Service_Data_User} */
        const DUser = spec['Fl32_Ap_User_Shared_Service_Data_User#'];

        /** @type {Fl32_Ap_User_Shared_Service_Data_User} */
        let user = null;
        /** @type {String} route to redirect after authentication  */
        let routeToRedirect = null;
        /** @type {String} route to authentication form */
        let routeToSignIn = null;

        this.close = async function () {
            // const req = new SignOutRequest();
            // /** @type {Fl32_Teq_User_Shared_Service_Route_Sign_Out.Response} */
            // const res = await gateSignOut(req);
            // if (res) {
            //     user = null;
            // }
        };

        this.getRouteToRedirect = function () {
            return routeToRedirect ?? '/';
        };

        this.getRouteToSignIn = function () {
            return routeToSignIn ?? '/signIn';
        };

        /**
         * @returns {Fl32_Ap_User_Shared_Service_Data_User}
         */
        this.getUser = function () {
            return user;
        };

        this.init = async function () {
            // noinspection JSValidateTypes
            /** @type {Fl32_Ap_User_Shared_Service_Route_Session_Current.Response} */
            const res = await gate.send(routeCur.createReq(), routeCur);
            if (res?.user && res.user.id) {
                user = res.user;
            } else {
                user = null;
            }
        };

        /**
         * Redirect to sign in route if user is not authenticated. Store current route before redirect.
         * @returns {Boolean} 'true' if user is authenticated.
         */
        this.checkUserAuthenticated = async function (router) {
            const result = (user instanceof DUser);
            if (!result) {
                const routeCurrent = router.currentRoute.value.path;
                this.setRouteToRedirect(routeCurrent);
                router.push(routeToSignIn);
            }
            return result;
        };

        this.setRouteToRedirect = function (route) {
            routeToRedirect = route;
        };

        this.setRouteToSignIn = function (route) {
            routeToSignIn = route;
        };
    }

}

// MODULE'S EXPORT
export default Fl32_Ap_User_Front_Model_Session;
