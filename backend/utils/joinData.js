const db = require('../database/db')
const joinData =async (userId) => {
    // const rows = await db('users')
    //     .leftJoin('userWorkSpace', 'users.id', 'userWorkSpace.user_id')
    //     .leftJoin('collections', 'userWorkSpace.id', 'collections.workspace_id')
    //     .leftJoin('folders', 'folders.collection_id', 'collections.id')
    //     .leftJoin('requests', 'requests.folder_id', 'folders.id')
    //     .select(
    //         'users.id as user_id',
    //         'users.name as user_name',
    //         'users.email',
    //         'users.profileImage',
    //         'userWorkSpace.id as workspace_id',
    //         'userWorkSpace.name as workspace_name',
    //         'collections.id as collection_id',
    //         'collections.name as collection_name',
    //         'folders.id as folder_id',
    //         'folders.name as folder_name',
    //         'requests.id as request_id',
    //         'requests.title as request_title',
    //         'requests.method',
    //         'requests.url'
    //     )
    //     .where('users.id', userId);
    // return rows

    const [user] = await db('users').where('id',userId);


    const workspaces = await db('workspaces').where('user_id',userId);

    for (const workspace of workspaces) {
        const collections = await db('collections').where('workspace_id',workspace.id);

        for (const collection of collections) {
            const folders = await db('folders').where('collection_id',collection.id);
            const requests = await db('requests').where('collection_id',collection.id);

            collection.folders = folders;
            collection.requests = requests;
        }
        workspace.collections = collections;
    }

    return {user,workspaces};


}
module.exports = joinData;