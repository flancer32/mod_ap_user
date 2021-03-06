/**
 * Clean up expired sign-in codes.
 *
 * @namespace Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @constructs Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp.process
 * @memberOf Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp
 */
function Factory(spec) {
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signin} */
    const ESignIn = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signin#'];

    /**
     * Clean up expired sign-in codes.
     *
     * @param trx
     * @returns {Promise<void>}
     * @memberOf Fl32_Ap_User_Back_Process_SignIn_Code_CleanUp
     */
    async function process({trx}) {
        return await trx.from(ESignIn.ENTITY)
            .where(ESignIn.A_DATE_EXPIRED, '<', new Date())
            .del();
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
