/**
 * Create sign-up code with limited lifetime.
 *
 * @namespace Fl32_Ap_User_Back_Process_SignUp_Code_Create
 */
// MODULE'S IMPORT
import $crypto from 'crypto';

// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Process_SignUp_Code_Create';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructs Fl32_Ap_User_Back_Process_SignUp_Code_Create.process
 * @memberOf Fl32_Ap_User_Back_Process_SignUp_Code_Create
 */
function Factory(spec) {
    /** @type {Fl32_Ap_User_Back_Defaults} */
    const DEF = spec['Fl32_Ap_User_Back_Defaults$']; // instance singleton
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signup} */
    const ESignUp = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signup#']; // class

    /**
     * Create one-time sign in code with limited lifetime.
     * @param trx
     * @param {Number} userId user who initiated sign up process
     * @param {boolean} onetime
     * @param {Date|null} dateExpired
     * @returns {Promise<String>}
     * @memberOf Fl32_Ap_User_Back_Process_SignUp_Code_Create
     */
    async function process({trx, userId, onetime, dateExpired}) {
        // DEFINE INNER FUNCTIONS
        /**
         * @param trx
         * @returns {Promise<string>}
         */
        async function generateCode(trx) {
            let code, rs;
            do {
                code = $crypto.randomBytes(DEF.DATA_SIGN_CODE_LENGTH).toString('hex').toLowerCase();
                const query = trx.from(ESignUp.ENTITY);
                rs = await query.select().where(ESignUp.A_CODE, code);
            } while (rs.length > 0);
            return code;
        }

        function getDateExpDefault() {
            const result = new Date();
            result.setUTCMinutes(result.getUTCMinutes() + DEF.DATA_SIGN_CODE_LIFETIME_MIN);
            return result;
        }

        // MAIN FUNCTIONALITY
        let result = await generateCode(trx);
        let dateExp = dateExpired ?? getDateExpDefault();
        await trx(ESignUp.ENTITY)
            .insert({
                [ESignUp.A_CODE]: result,
                [ESignUp.A_DATE_EXPIRED]: dateExp,
                [ESignUp.A_ONETIME]: onetime,
                [ESignUp.A_USER_REF]: userId,
            });
        // COMPOSE RESULT
        return result;
    }

    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});
export default Factory;
