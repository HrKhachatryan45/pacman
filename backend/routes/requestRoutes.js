const express = require('express');
const {createWorkspace, createCollection, createFolder, createRequest, deleteWorkspace, deleteCollection, deleteFolder,
    deleteRequest, updateWorkspace, updateCollection, updateFolder, updateRequest, saveRequest, sendRequest
} = require("../controllers/requestController");
const router = express.Router();
const protectRoute = require("../middlewares/protectRoute");

router.post('/create/workspace',protectRoute,createWorkspace);
router.post('/create/collection/:workspaceId',protectRoute,createCollection);
router.post('/create/folder/:collectionId',protectRoute,createFolder);
router.post('/create/request/:collectionId/:folderId',protectRoute,createRequest);
router.delete('/delete/workspace/:workspaceId',protectRoute,deleteWorkspace)
router.delete('/delete/collection/:collectionId/:workspaceId',protectRoute,deleteCollection);
router.delete('/delete/folder/:folderId/:collectionId/:workspaceId',protectRoute,deleteFolder);
router.delete('/delete/request/:requestId',protectRoute,deleteRequest);
router.put('/update/workspace/:workspaceId',protectRoute,updateWorkspace)
router.put('/update/collection/:collectionId',protectRoute,updateCollection);
router.put('/update/folder/:folderId',protectRoute,updateFolder);
router.put('/update/request/:requestId',protectRoute,updateRequest);
router.post('/save/request/:requestId',protectRoute,saveRequest);
router.post('/send/request',sendRequest)

module.exports = router;