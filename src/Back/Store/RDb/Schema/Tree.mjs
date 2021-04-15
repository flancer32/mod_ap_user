/**
 *  User's tree (parent - child relations).
 */
class Fl32_Ap_User_Back_Store_RDb_Schema_Tree {
    parent_ref;
    user_ref;
}

Fl32_Ap_User_Back_Store_RDb_Schema_Tree.A_PARENT_REF = 'parent_ref';
Fl32_Ap_User_Back_Store_RDb_Schema_Tree.A_USER_REF = 'user_ref';
Fl32_Ap_User_Back_Store_RDb_Schema_Tree.ENTITY = 'user_tree';

// freeze class to deny attributes changes
Object.freeze(Fl32_Ap_User_Back_Store_RDb_Schema_Tree);

// MODULE'S EXPORT
export default Fl32_Ap_User_Back_Store_RDb_Schema_Tree;
