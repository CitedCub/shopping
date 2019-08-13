var express = require('express');
var router = express.Router();

// Require controller modules.
var shoppingitem_controller = require('../controllers/shoppingitemController');

/// SHOPPING ITEM ROUTES ///

// GET shopping home page.
router.get('/', shoppingitem_controller.index);

// GET request for creating a shopping item. NOTE This must come before routes that display Shopping Item (uses id).
router.get('/shoppingitem/create', shoppingitem_controller.shoppingitem_create_get);

// POST request for creating a Shopping Item.
router.post('/shoppingitem/create', shoppingitem_controller.shoppingitem_create_post);

// GET request to delete Shopping Item
router.get('/shoppingitem/:id/delete', shoppingitem_controller.shoppingitem_delete_get);

// POST request to delete Shopping Item
router.post('/shoppingitem/:id/delete', shoppingitem_controller.shoppingitem_delete_post);

// GET request for one Shopping Item.
router.get('/shoppingitem/:id', shoppingitem_controller.shoppingitem_detail);

// GET request for list of all Shopping Items.
router.get('/shoppingitems', shoppingitem_controller.shoppingitem_list);

// GET request for all Shopping Items
router.get('/fetchItems', shoppingitem_controller.fetchItems);

// PUT request to update a Shopping Item
router.put('/shoppingitem/:id/update', shoppingitem_controller.shoppingitem_update);

// DELETE request to delete a Shopping Item
router.delete('/shoppingitem/:id/delete', shoppingitem_controller.shoppingitem_delete);

// POST request for creating a Shopping Item.
router.post('/shoppingitem', shoppingitem_controller.shoppingitem_create);

module.exports = router;