import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../../../../../../../dev/manual/DevEnv.mjs';

/**
 * This is environment for code development, not for testing.
 */
describe('Fl32_Ap_User_Plugin_Store_RDb_Setup', () => {

    it('performs the duties', async () => {
        /** @type {TeqFw_Di_Shared_Container} */
        const container = await devEnv();
        /** @type {Fl32_Ap_User_Plugin_Store_RDb_Setup} */
        const setup = await container.get('Fl32_Ap_User_Plugin_Store_RDb_Setup$');
        assert.strictEqual(setup.constructor.name, 'Fl32_Ap_User_Plugin_Store_RDb_Setup');

        // get database connector then execute the process
        /** @type {TeqFw_Db_Back_RDb_Connect} */
        const connector = await container.get('TeqFw_Db_Back_RDb_Connect$');  // singleton instance
        const knex = await connector.getKnex();
        /** @type {SchemaBuilder} */
        const builder = connector.getSchemaBuilder();
        try {
            // compose queries to recreate DB structure
            setup.dropTables1(builder);
            setup.dropTables0(builder);
            setup.createStructure(knex, builder);
            // perform queries to recreate DB structure
            await builder;
        } finally {
            await connector.disconnect();
        }

    });
});
