class Fl32_Ap_User_Plugin_Store_RDb_Setup {
    constructor(spec) {
        const {
            /** @function {@type TeqFw_Core_App_Back_Util_RDb.nameFK} */
            nameFK,
            /** @function {@type TeqFw_Core_App_Back_Util_RDb.nameNX} */
            nameNX,
            /** @function {@type TeqFw_Core_App_Back_Util_RDb.nameUQ} */
            nameUQ
        } = spec['TeqFw_Core_App_Back_Util_RDb']; // ES6 module destructing

        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_User} */
        const EUser = spec['Fl32_Ap_User_Back_Store_RDb_Schema_User#']; // class


        /**
         * TODO: tables drop should be ordered according to relations between tables (DEM).
         * For the moment I use levels for drop: N, ..., 2, 1, 0.
         *
         * @param schema
         */
        this.dropTables0 = function (schema) {
            schema.dropTableIfExists(EUser.ENTITY);
        };
        this.dropTables1 = function (schema) {
            /* drop related tables (foreign keys) */
            // schema.dropTableIfExists(EAuthPassword.ENTITY);

        };

        /**
         * Upgrade database structure (drop/create tables).
         *
         * @param knex
         * @param {SchemaBuilder} schema
         */
        this.createStructure = function (knex, schema) {

            // DEFINE INNER FUNCTIONS

            function createTblUser(schema, knex) {
                schema.createTable(EUser.ENTITY, (table) => {
                    table.increments(EUser.A_ID);
                    table.dateTime(EUser.A_DATE_CREATED).notNullable().defaultTo(knex.fn.now())
                        .comment('Date-time for registration of the user.');
                    table.comment('User registry.');
                });
            }


            // MAIN FUNCTIONALITY
            // compose queries to create main tables (registries)
            createTblUser(schema, knex);
            // compose queries to create additional tables (relations and details)
            // createTblAuthPassword(schema, knex);

        };
    }
}

export default Fl32_Ap_User_Plugin_Store_RDb_Setup;
