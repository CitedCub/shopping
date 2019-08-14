var ShoppingItem = require('../models/shoppingitem');

const validator = require('express-validator');

exports.index = function (req, res) {
    ShoppingItem.countDocuments({}, function (err, shoppingitem_count) {
        res.render('shoppingitem_index', { title: 'Shopping List Home', error: err, shoppingitem_count: shoppingitem_count });
    });
}

exports.shoppingitem_list = function (req, res, next) {
    res.render('shoppingitem_list', { title: 'Shoppling Item List' });
};

// Display detail page for a specific Shopping Item.
exports.shoppingitem_detail = function (req, res, next) {

    ShoppingItem.findById(req.params.id)
        .exec(function (err, shoppingitem) {
            if (err) { return next(err); }
            if (shoppingitem == null) { // No results.
                var err = new Error('Shopping item not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('shoppingitem_detail', { title: 'Shopping Item Detail', shoppingitem: shoppingitem });
        });
};

// Display ShoppingItem create form on GET
exports.shoppingitem_create_get = function (req, res, next) {
    res.render('shoppingitem_form', { title: 'Create Shopping Item' });
};

// Handle Shopping Item create on POST
exports.shoppingitem_create_post = [
    // Validate that the name field is not empty.
    validator.body('name', 'Shopping item name required').isLength({ min: 1 }).trim(),

    // Sanitize (escape) the name field.
    validator.sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validator.validationResult(req);

        // Create a shopping item object with escaped and trimmed data.
        var shoppingitem = new ShoppingItem(
            { name: req.body.name }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('shoppingitem_form', { title: 'Create Shopping Item', shoppingitem: shoppingitem, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Shopping Item with same name already exists.
            ShoppingItem.findOne({ 'name': req.body.name })
                .exec(function (err, found_shoppingitem) {
                    if (err) { return next(err); }

                    if (found_shoppingitem) {
                        // Shopping item exists, redirect to its detail page.
                        res.redirect(found_shoppingitem.url);
                    }
                    else {
                        shoppingitem.save(function (err) {
                            if (err) { return next(err); }
                            // Shopping item saved. Redirect to shopping item detail page.
                            res.redirect(shoppingitem.url);
                        })
                    };
                })
        }
    }
];

// Display Shopping Item delete form on GET.
exports.shoppingitem_delete_get = function (req, res) {
    ShoppingItem.findById(req.params.id).exec(function (err, shoppingitem) {
        if (err) { return next(err); }
        if (shoppingitem == null) { // No results.
            res.redirect('/shopping/shoppingitems');
        }
        // Successful, so render.
        res.render('shoppingitem_delete', { title: 'Delete Shopping Item', shoppingitem: shoppingitem });
    })
};

// Handle shopping item delete on POST
exports.shoppingitem_delete_post = function (req, res, next) {
    ShoppingItem.findById(req.params.id).exec(function (err, shoppingitem) {
        if (err) { return next(err); }
        // Success. Delete object and redirect to the list of shopping items.
        ShoppingItem.findByIdAndRemove(req.body.shoppingitemid, function deleteShoppingItem(err) {
            if (err) return next(err);
            // Success - go to shopping item list
            res.redirect('/shopping/shoppingitems');
        })
    })
};

// Fetch shopping items
exports.fetchItems = function (req, res, next) {
    ShoppingItem.find()
        .sort({ picked: 1, name: 1 })
        .exec(function (err, list_shoppingitems) {
            if (err) { return next(err); }
            // Successful, so return response
            res.json(list_shoppingitems);
        })
}

// Update shopping item
exports.shoppingitem_update = function (req, res, next) {
    console.log('shoppingitem_update body: ' + JSON.stringify(req.body));
    var shoppingitem = new ShoppingItem(
        req.body
    );

    ShoppingItem.findByIdAndUpdate(req.params.id, shoppingitem, {}, function (err, theshoppingitem) {
        if (err) { return next(err); }
        // Successful - return all shopping items
        console.log('Update successful: ' + JSON.stringify(shoppingitem));
        exports.fetchItems(req, res, next);
    })
}

// Delete shopping item
exports.shoppingitem_delete = function (req, res, next) {
    ShoppingItem.findByIdAndRemove(req.params.id, (err) => {
        if (err) return next(err);
        // Success - return shopping items
        exports.fetchItems(req, res, next);
    });
}

// Create shopping item
exports.shoppingitem_create = function (req, res, next) {
    console.log('shoppingitem_create body: ' + req.body);
    var shoppingitem = new ShoppingItem(
        { name: req.body.name }
    );

    ShoppingItem.findOne({ 'name': req.body.name })
        .exec(function (err, found_shoppingitem) {
            if (err) { return next(err); }

            if (found_shoppingitem) {
                // Shopping item exists, redirect to its detail page.
                console.log('Shopping item already exists: ' + found_shoppingitem.name);
                next(new Error('CONFLICT'));
            }
            else {
                shoppingitem.save(function (err) {
                    if (err) { return next(err); }
                    // Shopping item saved. Redirect to shopping item detail page.
                    exports.fetchItems(req, res, next);
                });
            };
        });
}