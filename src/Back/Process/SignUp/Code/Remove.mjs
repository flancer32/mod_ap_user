/**
 * Remove one-time sign-up code that has been used.
 *
 * @namespace Fl32_Ap_User_Back_Process_SignUp_Code_Remove
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Process_SignUp_Code_Remove';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructs Fl32_Ap_User_Back_Process_SignUp_Code_Remove.process
 * @memberOf Fl32_Ap_User_Back_Process_SignUp_Code_Remove
 */
function Factory(spec) {
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signup} */
    const ESignUp = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signup#']; // class

    /**
     * @param trx
     * @param {String} code
     * @returns {Promise<Number>}
     * @memberOf Fl32_Ap_User_Back_Process_SignUp_Code_Remove
     */
    async function process({trx, code}) {
        return await trx.from(ESignUp.ENTITY)
            .where(ESignUp.A_CODE, code.trim().toLowerCase())
            .where(ESignUp.A_ONETIME, true)
            .del();
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
