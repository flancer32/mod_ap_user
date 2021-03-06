/**
 * Remove one-time sign-in code.
 *
 * @namespace Fl32_Ap_User_Back_Process_SignIn_Code_Remove
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Process_SignIn_Code_Remove';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @constructs Fl32_Ap_User_Back_Process_SignIn_Code_Remove.process
 * @memberOf Fl32_Ap_User_Back_Process_SignIn_Code_Remove
 */
function Factory(spec) {
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signin} */
    const ESignIn = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signin#'];

    /**
     * Remove one-time sign-in code.
     * @param trx
     * @param {String} code
     * @returns {Promise<Number>}
     * @memberOf Fl32_Ap_User_Back_Process_SignIn_Code_Remove
     */
    async function process({trx, code}) {
        return await trx.from(ESignIn.ENTITY)
            .where(ESignIn.A_CODE, code.trim().toLowerCase())
            .del();
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
