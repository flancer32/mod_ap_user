/**
 * Create new user.
 *
 * @namespace Fl32_Ap_User_Back_Process_User_Create
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Process_User_Create';

// MODULE'S FUNCTIONS
/**
 * Factory to setup execution context and to create the processor.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @constructs Fl32_Ap_User_Back_Process_User_Create.process
 * @memberOf Fl32_Ap_User_Back_Process_User_Create
 */
function Factory(spec) {
    // EXTRACT DEPS
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_User} */
    const EUser = spec['Fl32_Ap_User_Back_Store_RDb_Schema_User#']; // class
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Tree} */
    const ETree = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Tree#']; // class

    // DEFINE INNER FUNCTIONS
    /**
     * @param trx
     * @param {boolean} parentId
     * @param {string} name
     * @returns {Promise<{userId: number}>}
     * @memberOf Fl32_Ap_User_Back_Process_User_Create
     */
    async function process({trx, parentId, name = ''}) {

        // insert new user
        const rs = await trx(EUser.ENTITY).insert({
            [EUser.A_NAME]: name.trim(),
        }, EUser.A_ID);
        const userId = rs[0];

        // insert link to parent
        await trx(ETree.ENTITY).insert({
            [ETree.A_USER_REF]: userId,
            [ETree.A_PARENT_REF]: parentId,
        });

        return {userId}
    }

    // COMPOSE RESULT
    Object.defineProperty(process, 'name', {value: `${NS}.${process.name}`});
    return process;
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.name}`});
export default Factory;
