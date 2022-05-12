const Category = require('../models/category');
const Sub_category = require('../models/sub_category');
const Child_Sub_category = require('../models/child_sub_category');
const Item = require('../models/item');
const Item_size = require('../models/item_size');
const Item_color = require('../models/item_color');
const Item_image = require('../models/item_image');

exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findAll({
            // where : {title : req.params.title},
            attributes: ['id', 'title', 'offer_image'],
            include: {
                model: Sub_category,
                attributes: ['id', 'title', 'categoryId'],
                include: {
                    model: Child_Sub_category,
                    attributes: ['id', 'title', 'subCategoryId'],
                    include: {
                        model: Item,
                        attributes: ['id', 'name', 'short_discreption', 'long_discreption', 'order_count', 'childSubCategoryId'],
                        include: [{
                            model: Item_image,
                            attributes: ['id', 'image', 'is_cart', 'itemId']
                        }, {
                            model: Item_size,
                            attributes: ['id', 'size', 'price', 'itemId']
                        }, {
                            model: Item_color,
                            attributes: ['id', 'color', 'itemId']
                        }]
                    }
                }
            }
        });
        let a = [];
        for (let i = 0; i < category.length; i++) {
            for (let j = 0; j < category[i].sub_categories.length; j++) {
                for(let k = 0; k < category[i].sub_categories[j].child_sub_categories.length; k++) {
                        let b = category[i].sub_categories[j].child_sub_categories[k].items.map(item => item.id)
                        a.push(b);
                }
            }
        }
        return res.status(200).json({ messsage: 'Homepage fetched successfully!', category: c, status: 1 })
    } catch (error) {
        console.log(error);
        next(error);
    }
}