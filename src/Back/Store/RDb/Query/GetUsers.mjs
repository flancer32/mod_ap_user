/**
 * Query to get users data.
 *
 * @namespace Fl32_Ap_User_Back_Store_RDb_Query_GetUsers
 */
// MODULE'S VARS
const NS = 'Fl32_Ap_User_Back_Store_RDb_Query_GetUsers';

/**
 * Factory to create builder to get queries.
 *
 * @memberOf Fl32_Ap_User_Back_Store_RDb_Query_GetUsers
 * @returns {function(*): *}
 */
function Factory(spec) {
    /** @type {typeof Fl32_Ap_User_Shared_Service_Data_User} */
    const User = spec['Fl32_Ap_User_Shared_Service_Data_User#'];
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Tree} */
    const ETree = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Tree#'];
    /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_User} */
    const EUser = spec['Fl32_Ap_User_Back_Store_RDb_Schema_User#'];

    // DEFINE INNER FUNCTIONS
    /**
     * @param trx
     * @returns {*}
     * @memberOf Fl32_Ap_User_Back_Store_RDb_Query_GetUsers
     */
    function queryBuilder(trx) {

        const T_T = 't';
        const T_U = 'u';

        // select from user
        const query = trx.from({u: EUser.ENTITY});
        query.select([
            {[User.ID]: `${T_U}.${EUser.A_ID}`},
            {[User.NAME]: `${T_U}.${EUser.A_NAME}`},
            {[User.IS_ADMIN]: `${T_U}.${EUser.A_IS_ADMIN}`},
            {[User.DATE_CREATED]: `${T_U}.${EUser.A_DATE_CREATED}`},
        ]);
        query.leftOuterJoin(
            {[T_T]: ETree.ENTITY},
            `${T_T}.${ETree.A_USER_REF}`,
            `${T_U}.${EUser.A_ID}`);
        query.select([{[User.PARENT_ID]: `${T_T}.${ETree.A_PARENT_REF}`}]);

        return query;
    }

    // MAIN FUNCTIONALITY
    Object.defineProperty(queryBuilder, 'name', {value: `${NS}.${queryBuilder.name}`});

    // COMPOSE RESULT
    return queryBuilder;
}

// MODULE'S FUNCTIONALITY
Object.defineProperty(Factory, 'name', {value: `${NS}.${Factory.constructor.name}`});

// MODULE'S EXPORT
export default Factory;
