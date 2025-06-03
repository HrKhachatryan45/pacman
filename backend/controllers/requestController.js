const db = require('../database/db')
const joinData = require('../utils/joinData')

const createWorkspace = async (req,res) => {
    const user = req.user;
    const name = req.body.name;
    try {

        await db('workspaces').insert({user_id:user.id,name});

        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch(err) {
        res.status(500).json(err)
    }
}

const createCollection = async (req,res) => {
    const user = req.user;
    const {workspaceId} = req.params;
    try{
        await db('collections').insert({workspace_id:workspaceId,name:"New Collection"});
        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch(err){
        res.status(500).json(err)
    }
}
const createFolder = async (req,res) => {
    const user = req.user;
    const {collectionId} = req.params;
    try{
        await db('folders').insert({collection_id:collectionId,name:"New Folder"});
        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch(err){
        res.status(500).json(err)
    }
}

const createRequest = async (req,res) => {
    const user = req.user;
    const {collectionId,folderId} = req.params;
    try{
        await db('requests').insert({collection_id:collectionId,folder_id:folderId,title:"New Request",method:"GET"});
        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch(err){
        res.status(500).json(err)
    }
}

const deleteWorkspace = async (req,res) => {
    const user = req.user;
    const {workspaceId} = req.params;
    try{
        const data =await joinData(user.id)

        const workspace = data.workspaces.find(workspaceD => workspaceD.id.toString() === workspaceId.toString());

        for (const collection of workspace.collections) {

            for (const request of collection.requests) {
                await db('requests').where({id:request.id}).delete();
            }

            for (const folder of collection.folders) {
                await db('folders').where({id:folder.id}).delete();
            }
            await db('collections').where({id:collection.id}).delete();
        }

        await db('workspaces').where({id:workspaceId}).delete();

        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch(err){
        res.status(500).json(err)
    }
}

const deleteCollection = async (req,res) => {
    const {collectionId,workspaceId} = req.params;
    const user = req.user
    try {
        const data = await joinData(user.id)
        const collections = data.workspaces.find(workspaceD => workspaceD.id.toString() === workspaceId.toString()).collections;
        console.log(collections)
        const collection = collections.find(collectionD => collectionD.id.toString() === collectionId.toString());

            for (const request of collection.requests) {
                await db('requests').where({id:request.id}).delete();
            }

            for (const folder of collection.folders) {
                await db('folders').where({id:folder.id}).delete();
            }

            await db('collections').where({id:collectionId}).delete();

        const result = await joinData(user.id)
        res.status(200).json(result)

    }catch (e) {
        res.status(500).json(e)
    }
}

const deleteFolder = async (req,res) => {
    const {collectionId,workspaceId,folderId} = req.params;
    const user = req.user
    try {

        const data = await joinData(user.id)
        const collections = data.workspaces.find(workspaceD => workspaceD.id.toString() === workspaceId.toString()).collections;

        const collection = collections.find(collectionD => collectionD.id.toString() === collectionId.toString());
        for (const request of collection.requests) {
            await db('requests').where({id:request.id}).delete();
        }

            await db('folders').where({id:folderId}).delete();

        const result = await joinData(user.id)
        res.status(200).json(result)

    }catch (e) {
        res.status(500).json(e)
    }
}

const deleteRequest = async (req,res) => {
    const {requestId} = req.params;
    const user = req.user;
   try{
           await db('requests').where({id:requestId}).delete();

       const result = await joinData(user.id)
       res.status(200).json(result)

   }catch (e) {
       res.status(500).json(e)
   }
}

const updateWorkspace = async (req,res) => {
    const {workspaceId} = req.params;
    const {workspaceName} = req.body;
    const user = req.user;
    try {
        await db('workspaces').where({id:workspaceId}).update({name:workspaceName});
        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch (e) {
        res.status(200).json(e)
    }
}

const updateCollection = async (req,res) => {
    const {collectionId} = req.params;
    const {collectionName} = req.body;
    const user = req.user;
    try {
        await db('collections').where({id:collectionId}).update({name:collectionName});
        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch (e) {
        res.status(200).json(e)
    }
}

const updateFolder = async (req,res) => {
    const {folderId} = req.params;
    const {folderName} = req.body;
    const user = req.user;
    try {
        await db('folders').where({id:folderId}).update({name:folderName});
        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch (e) {
        res.status(200).json(e)
    }
}

const updateRequest = async (req,res) => {
    const {requestId} = req.params;
    const {requestName} = req.body;
    const user = req.user;
    try {
        await db('requests').where({id:requestId}).update({title:requestName});
        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch (e) {
        res.status(200).json(e)
    }
}

const saveRequest = async (req,res) => {
    const {requestId} = req.params;
    const requestData = req.body;
    const user = req.user;
    try {
        console.log(requestData)
      await  db('requests').where({id:requestId}).update(requestData);
        const result = await joinData(user.id)
        res.status(200).json(result)
    }catch (e) {
        res.status(500).json(e)
    }
}

const sendRequest = async (req,res) => {
    const {url,method,headers,body} =req.body;
    try {
        const start =performance.now()

        const hasBody = body && Object.keys(body).length > 0;
        const response = await fetch(url,{
            method,
            headers,
            body:hasBody?JSON.stringify(body):undefined
        })

        let result;
        const contentType = await response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            result = await response.text();
        }
        const end = performance.now()

        const time = end-start
        const  status = response.status + ' ' + response.statusText

        res.status(response.status).json({result,time,status});

    }catch (e) {
        console.error(e);
        res.status(500).json({
            error: e.message
        });
    }

}


module.exports = {
    createWorkspace,
    createCollection,
    createFolder,
    createRequest,
    deleteWorkspace,
    deleteCollection,
    deleteFolder,
    deleteRequest,
    updateWorkspace,
    updateCollection,
    updateFolder,
    updateRequest,
    saveRequest,
    sendRequest
}