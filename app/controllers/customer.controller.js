const Category = require('../models/category');
const Sub_category = require('../models/sub_category');
const Child_Sub_category = require('../models/child_sub_category');
const Item = require('../models/item');
const Item_size = require('../models/item_size');
const Item_color = require('../models/item_color');
const Item_image = require('../models/item_image');
const Banner = require('../models/banner');
const Blog = require('../models/blog');
const Poster = require('../models/poster');
const { Op } = require('sequelize')

exports.getHomepage = async (req, res, next) => {
    try {

        const banner = await Banner.findAll({ attributes: ['id', 'title', 'description', 'image', 'childSubCategoryId'] });

        const poster = await Poster.findAll({
            attributes: ['id', 'title', 'description', 'image', 'itemId'],
            include: {
                model: Item,
                attributes: ['id', 'name', 'short_discreption', 'long_discreption', 'order_count', 'childSubCategoryId', 'userId'],
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
        });

        const new_proct = await Item.findAll({
            limit: 4,
            order: [['id', 'DESC']],
            attributes: ['id', 'name', 'short_discreption', 'long_discreption', 'order_count', 'childSubCategoryId', 'userId'],
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
        });

        const category = await Category.findAll({
            // where : {title : req.params.title},
            attributes: ['id', 'title', 'offer_image'],
            include: {
                model: Sub_category,
                attributes: ['id', 'title', 'categoryId'],
                include: {
                    model: Child_Sub_category,
                    attributes: ['id', 'title', 'subCategoryId']
                }
            }
        });

        const top_sale = await Item.findAll({
            limit: 6,
            order: [['order_count', 'DESC']],
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
        });

        const all_sizes = (await Item_size.findAll({ attributes: ['size'] })).map(element => element.size);
        const all_colors = (await Item_color.findAll({ attributes: ['color'] })).map(element => element.color);
        const size_list = {}, color_list = {};

        all_sizes.forEach((x) => {
            size_list[x] = (size_list[x] || 0) + 1;
        });
        all_colors.forEach((x) => {
            color_list[x] = (color_list[x] || 0) + 1;
        });

        return res.status(200).json({ messsage: 'Homepage fetched successfully!', banner, poster, new_proct, top_sale, category, size_list, color_list, status: 1 })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getFeatured = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 1;

    Item.findAll({
        offset: (currentPage - 1) * perPage,
        limit: perPage,
        order: [['order_count', 'DESC']],
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
    })
        .then(async items => {
            const item = await Item.findAll();
            const hasMore = Math.ceil(item.length / perPage) > currentPage ? true : false;
            const total_count = item.length;
            if (items.length === 0) {
                return res.status(404).json({ messsage: 'No more product found!', status: 0 });
            }
            return res.status(200).json({ messsage: 'Top sale product fetched successfully!', item: items, total_count, hasMore, status: 1 });
        })
        .catch(error => {
            next(error);
        });

}

exports.getBlog = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 1;


    Blog.findAll({
        offset: (currentPage - 1) * perPage,
        limit: perPage,
        order: [['id', 'DESC']],
        attributes: ['id', 'title', 'description', 'image', 'creator_name', 'createdAt']
    })
        .then(async blogs => {
            const blog = await Blog.findAll();
            const hasMore = Math.ceil(blog.length / perPage) > currentPage ? true : false;
            const total_count = blog.length;
            if (blogs.length === 0) {
                return res.status(404).json({ messsage: 'No more product found!', status: 0 });
            }
            return res.status(200).json({ messsage: 'Top sale product fetched successfully!', blog: blogs, total_count, hasMore, status: 1 });
        })
        .catch(error => next(error));

}

getItem = async (condition, currentPage, perPage) => {
    const items = await Item.findAll({
        where: condition,
        offset: (currentPage - 1) * perPage,
        limit: perPage,
        attributes: ['id', 'name', 'short_discreption', 'long_discreption', 'order_count', 'childSubCategoryId', 'userId'],
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
    });
    const total_items = await Item.findAll({ where: condition });
    const hasMore = Math.ceil(total_items.length / perPage) > currentPage ? true : false;
    return { items, hasMore, total_count: total_items.length };
}

exports.getItem = async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 9;
        let items;

        if (req.query.childSubCategoryId) {
            const condition = { childSubCategoryId: req.query.childSubCategoryId };
            items = await getItem(condition, currentPage, perPage);
        }

        if (req.query.subCategoryId) {
            const condition = { subCategoryId: req.query.subCategoryId };
            items = await getItem(condition, currentPage, perPage);
        }

        if (req.query.categoryId) {
            const condition = { categoryId: req.query.categoryId };
            items = await getItem(condition, currentPage, perPage);
        }

        if (items.items.length === 0) {
            return res.status(404).json({ messsage: 'No more product found!', status: 0 });
        }
        return res.status(200).json({ messsage: 'Items fetched successfully!', items: items.items, hasMore: items.hasMore, total_count: items.total_count, status: 1 });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

getSize = async (condition) => {
    const size = await Item_size.findAll({
        where: {
            size: condition
        },
        attributes: ['itemId']
    });
    return size;
}

getColor = async (condition) => {
    const color = await Item_color.findAll({
        where: {
            color: condition
        },
        attributes: ['itemId']
    });
    return color;
}

exports.getFilterItem = async (req, res, next) => {
    let size, color;
    let query = req.query.size
    if (!query) {
        query = [];
    }

    typeof req.query.size === 'string' ? size = await getSize(query) : size = await getSize({ [Op.or]: query });
    typeof req.query.color === 'string' ? color = await getColor(req.query.color) : color = await getColor({ [Op.or]: req.query.color });

    const item_size = size.map(element => element.itemId);
    const item_color = color.map(element => element.itemId);
    // const item_size_color = item_size.concat(item_color);
    console.log(req.query.size);
    console.log(item_size);
    // console.log(item_size_color);

    const item_id = [...new Set(color.map(element => element.itemId))];
    // console.log(item_id);
    if (item_id.length === 0) {
        return res.json({ message: 'No item found!' });
    }
    const item = await Item.findAll({
        where: {
            id: { [Op.or]: item_id }
        },
        attributes: ['name']
    })
    res.json({ item });


}