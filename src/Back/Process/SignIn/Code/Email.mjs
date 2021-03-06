/**
 * Email sign-in code to user.
 *
 * @namespace Fl32_Ap_User_Back_Process_SignIn_Code_Email
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Process_SignIn_Code_Email';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @constructs Fl32_Ap_User_Back_Process_SignIn_Code_Email.process
 * @memberOf Fl32_Ap_User_Back_Process_SignIn_Code_Email
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {Fl32_Ap_User_Back_Defaults} */
    const DEF = spec['Fl32_Ap_User_Back_Defaults$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {Function|TeqFw_Email_Back_Process_Email.process} */
    const procEmail = spec['TeqFw_Email_Back_Process_Email$'];

    /**
     * Email sign-in code to user.
     *
     * @param {String} to
     * @param {String} realm
     * @param {String} code
     * @returns {Promise<boolean>}
     * @memberOf Fl32_Ap_User_Back_Process_SignIn_Code_Email
     */
    async function process({to, realm, code}) {
        /** @type {TeqFw_Web_Back_Api_Dto_Config_Local} */
        const cfg = config.getLocal(DEF.MOD_WEB.SHARED.NAME);
        const urlBase = cfg.urlBase;
        const route = DEF.DOOR_DEF_ROUTE_SIGNIN_CODE_CHECK.replace(':code', code);
        const url = `https://${urlBase}/${realm}/#${route}`;
        const subject = '"Alus Pils" sign-in link';
        const text = `"Alus Pils" sign-in link: ${url}`;
        const html = `<a href="${url}">Sign in to "Alus Pils"</a>`;
        // send mail with defined transport object
        return await procEmail({to, subject, text, html});
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
