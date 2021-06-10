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

        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Id_Email} */
        const EIdEmail = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Id_Email#']; // class
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Id_Phone} */
        const EIdPhone = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Id_Phone#']; // class
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Session} */
        const ESession = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Session#']; // class
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signin} */
        const ESessionInit = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signin#']; // class
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Signup} */
        const ESignup = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Signup#']; // class
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_Tree} */
        const ETree = spec['Fl32_Ap_User_Back_Store_RDb_Schema_Tree#']; // class
        /** @type {typeof Fl32_Ap_User_Back_Store_RDb_Schema_User} */
        const EUser = spec['Fl32_Ap_User_Back_Store_RDb_Schema_User#']; // class


        /**
         * TODO: tables drop should be ordered according to relations between tables (DEM).
         * For the moment I use levels for drop: N, ..., 2, 1, 0.
         *
         * @param schemaBuilder
         */
        this.dropTables0 = function (schemaBuilder) {
            schemaBuilder.dropTableIfExists(EUser.ENTITY);
        };
        this.dropTables1 = function (schemaBuilder) {
            /* drop related tables (foreign keys) */
            schemaBuilder.dropTableIfExists(EIdEmail.ENTITY);
            schemaBuilder.dropTableIfExists(EIdPhone.ENTITY);
            schemaBuilder.dropTableIfExists(ESessionInit.ENTITY);
            schemaBuilder.dropTableIfExists(ESession.ENTITY);
            schemaBuilder.dropTableIfExists(ESignup.ENTITY);
            schemaBuilder.dropTableIfExists(ETree.ENTITY);
        };

        /**
         * Upgrade database structure (drop/create tables).
         *
         * @param knex
         * @param {SchemaBuilder} schemaBuilder
         */
        this.createStructure = function (knex, schemaBuilder) {

            // DEFINE INNER FUNCTIONS

            function createTblIdEmail(schemaBuilder, knex) {
                schemaBuilder.createTable(EIdEmail.ENTITY, (table) => {
                    table.string(EIdEmail.A_EMAIL).notNullable().primary()
                        .comment('Email.');
                    table.integer(EIdEmail.A_USER_REF).unsigned().notNullable();
                    table.foreign(EIdEmail.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(EIdEmail.ENTITY, EIdEmail.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('Emails as identifiers for users.');
                });
            }

            function createTblIdPhone(schemaBuilder, knex) {
                schemaBuilder.createTable(EIdPhone.ENTITY, (table) => {
                    table.string(EIdPhone.A_PHONE).notNullable().primary()
                        .comment('Phone number.');
                    table.integer(EIdPhone.A_USER_REF).unsigned().notNullable();
                    table.foreign(EIdPhone.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(EIdPhone.ENTITY, EIdPhone.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('Phones as identifiers for users.');
                });
            }

            function createTblSession(schemaBuilder, knex) {
                schemaBuilder.createTable(ESession.ENTITY, (table) => {
                    table.string(ESession.A_SESSION_ID).notNullable().primary()
                        .comment('Unique ID for user session.');
                    table.integer(ESession.A_USER_REF).unsigned().notNullable();
                    table.dateTime(ESession.A_DATE_CREATED).notNullable().defaultTo(knex.fn.now())
                        .comment('Date-time for session registration.');
                    table.foreign(ESession.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(ESession.ENTITY, ESession.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('Registry for opened sessions.');
                });
            }

            function createTblSessionInit(schemaBuilder, knex) {
                schemaBuilder.createTable(ESessionInit.ENTITY, (table) => {
                    table.string(ESessionInit.A_CODE).notNullable().primary()
                        .comment('One-time code to initialize session.');
                    table.integer(ESessionInit.A_USER_REF).unsigned().notNullable();
                    table.dateTime(ESessionInit.A_DATE_EXPIRED).notNullable()
                        .comment('Date-time for sign-in code expiration.');
                    table.foreign(ESessionInit.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(ESessionInit.ENTITY, ESessionInit.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('One-time sign-in codes with limited lifetime.');
                });
            }

            function createTblSignup(schemaBuilder, knex) {
                schemaBuilder.createTable(ESignup.ENTITY, (table) => {
                    table.string(ESignup.A_CODE).notNullable().primary()
                        .comment('One-time code to sign-up new user under this user.');
                    table.integer(ESignup.A_USER_REF).unsigned().notNullable()
                        .comment('ID of the referral user.');
                    table.boolean(ESignup.A_ONETIME).notNullable().defaultTo(true)
                        .comment('onetime acceptance or multiple.');
                    table.dateTime(ESignup.A_DATE_EXPIRED).notNullable()
                        .comment('Date-time for sign-up code expiration.');
                    table.foreign(ESignup.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(ESignup.ENTITY, ESignup.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.comment('One-time sign-up codes with limited lifetime.');
                });
            }

            function createTblTree(schemaBuilder, knex) {
                schemaBuilder.createTable(ETree.ENTITY, (table) => {
                    table.integer(ETree.A_USER_REF).unsigned().notNullable();
                    table.integer(ETree.A_PARENT_REF).unsigned().notNullable();
                    table.primary([ETree.A_USER_REF]);
                    table.foreign(ETree.A_USER_REF).references(EUser.A_ID).inTable(EUser.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(ETree.ENTITY, ETree.A_USER_REF, EUser.ENTITY, EUser.A_ID));
                    table.foreign(ETree.A_PARENT_REF).references(ETree.A_USER_REF).inTable(ETree.ENTITY)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName(nameFK(
                            ETree.ENTITY, ETree.A_USER_REF, ETree.ENTITY, ETree.A_USER_REF
                        ));
                    table.comment('Users relations (parent - child).');
                });
            }

            function createTblUser(schemaBuilder, knex) {
                schemaBuilder.createTable(EUser.ENTITY, (table) => {
                    table.increments(EUser.A_ID);
                    table.dateTime(EUser.A_DATE_CREATED).notNullable().defaultTo(knex.fn.now())
                        .comment('Date-time for registration of the user.');
                    table.boolean(EUser.A_IS_ADMIN).notNullable().defaultTo(false)
                        .comment('Does user has an admin role.');
                    table.string(EUser.A_NAME).notNullable()
                        .comment('Name to display.');
                    table.comment('User registry.');
                });
            }


            // MAIN FUNCTIONALITY
            // compose queries to create main tables (registries)
            createTblUser(schemaBuilder, knex);
            // compose queries to create additional tables (relations and details)
            createTblIdEmail(schemaBuilder, knex);
            createTblIdPhone(schemaBuilder, knex);
            createTblSession(schemaBuilder, knex);
            createTblSessionInit(schemaBuilder, knex);
            createTblSignup(schemaBuilder, knex);
            createTblTree(schemaBuilder, knex);
        };
    }
}

export default Fl32_Ap_User_Plugin_Store_RDb_Setup;
