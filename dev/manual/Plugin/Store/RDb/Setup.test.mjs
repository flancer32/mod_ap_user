import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../../../../../../../dev/manual/DevEnv.mjs';

/**
 * This is environment for code development, not for testing.
 */
describe('Fl32_Ap_User_Plugin_Store_RDb_Setup', () => {

    it('performs the duties', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {Fl32_Ap_User_Plugin_Store_RDb_Setup} */
        const setup = await container.get('Fl32_Ap_User_Plugin_Store_RDb_Setup$');
        assert.strictEqual(setup.name, 'Fl32_Ap_User_Plugin_Store_RDb_Setup');

        // get database connector then execute the process
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = await container.get('TeqFw_Core_App_Db_Connector$');  // singleton instance
        try {
            const trx = await rdb.startTransaction();
            const res = await proc({trx, userId: 1});
            assert(typeof res?.link === 'string');
            // finalize data handling
            await trx.commit();
        } finally {
            await rdb.disconnect();
        }

    });
});
