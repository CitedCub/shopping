var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShoppingItemSchema = new Schema(
    {
        name: { type: String, required: true, max: 100 },
        picked: { type: Boolean, required: true, default: false }
    }
);

// Virtual for shopping item's URL
ShoppingItemSchema
    .virtual('url')
    .get(function () {
        return '/shopping/shoppingitem/' + this._id;
    });

// Export model
module.exports = mongoose.model('ShoppingItem', ShoppingItemSchema);