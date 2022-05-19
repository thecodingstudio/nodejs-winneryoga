const Category = require('../models/category');
const Sub_category = require('../models/sub_category');
const Child_Sub_category = require('../models/child_sub_category');
const Item = require('../models/item');
const Item_size = require('../models/item_size');
const Item_color = require('../models/item_color');
const Item_image = require('../models/item_image');
const Banner = require('../models/banner');

const cloudinary = require('../utils/upload');
const fs = require('fs');
const path = require('path');
const Blog = require('../models/blog');
const Poster = require('../models/poster');

exports.postCategory = async (req, res, next) => {
    try {
        const payload = { ...req.body };

        try {
            const category = await Category.create(payload);
            return res.status(200).json({ message: 'Category created successfully.', category: { id: category.id, ...payload }, status: 1 });
        }
        catch (error) {
            if (error.original.errno) {
                error.statusCode = 409;
                error.description = 'Category already exist!'
            }
            if (!error.statusCode) {
                error.statusCode = 403;
            }
            throw error;
        }


    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postSubCategory = async (req, res, next) => {
    try {
        const payload = { ...req.body };

        try {
            const sub_category = await Sub_category.create(payload);
            return res.status(200).json({ message: 'Sub Category created successfully.', sub_category: { id: sub_category.id, ...payload }, status: 1 });
        }
        catch (error) {
            if (!error.statusCode) {
                error.statusCode = 403;
            }
            throw error;
        }


    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postChildSubCategory = async (req, res, next) => {
    try {
        const sub_category = await Sub_category.findByPk(req.body.subCategoryId);

        const payload = { ...req.body, categoryId: sub_category.categoryId };

        try {
            const child_sub_category = await Child_Sub_category.create(payload);

            return res.status(200).json({ message: 'Child Sub Category created successfully.', child_sub_category: { id: child_sub_category.id, ...payload }, status: 1 });
        }
        catch (error) {
            if (!error.statusCode) {
                error.statusCode = 403;
            }
            throw error;
        }


    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.postItem = async (req, res, next) => {
    try {

        const child_sub_category = await Child_Sub_category.findByPk(req.body.childSubCategoryId);

        const sub_category = await Sub_category.findByPk(child_sub_category.subCategoryId);

        const payload = { ...req.body, subCategoryId: sub_category.id, categoryId: sub_category.categoryId };

        try {
            const item = await Item.create(payload);
            try {
                let size_list = [], color_list = [], image_list = [];
                const sizeData = JSON.parse(req.body.size);
                const colotData = JSON.parse(req.body.color);

                for (let i = 0; i < req.files.length; i++) {

                    const image = await cloudinary.uploader.upload(req.files[i].path, {
                        public_id: req.files[i].filename,
                        width: 800,
                        height: 800,
                        crop: 'fill',
                    });

                    clearImage(image.public_id);
                    image_list.push({ image: image.url, itemId: item.id });

                }
                await Item_image.bulkCreate(image_list);

                for (let i in sizeData) {
                    size_list.push({ size: sizeData[i].size, price: sizeData[i].price, itemId: item.id });
                }
                await Item_size.bulkCreate(size_list);

                for (let i in colotData) {
                    color_list.push({ color: colotData[i].color, itemId: item.id });
                }
                await Item_color.bulkCreate(color_list);

                return res.status(200).json({ message: 'Item created successfully.', item: { id: item.id, ...payload }, status: 1 });

            } catch (error) {
                console.log(error);
                item.destroy();
                return next(error);
            }
        }
        catch (error) {
            if (!error.statusCode) {
                error.statusCode = 403;
            }
            throw error;
        }

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '../../images', filePath);
    fs.unlink(filePath, err => { if (err) { console.log(err) } });
}

exports.postBanner = async (req, res, next) => {
    let banner_list = [];
    try {
        for (let i = 0; i < req.files.length; i++) {

            const image = await cloudinary.uploader.upload(req.files[i].path, {
                public_id: req.files[i].filename,
                width: 1920,
                height: 600,
                crop: 'fill',
            });

            clearImage(image.public_id);
            banner_list.push({ image: image.url, title: req.body.title, description: req.body.description, childSubCategoryId: req.body.childSubCategoryId });
        }
        const banner = await Banner.create(banner_list[0]);
        return res.status(200).json({ message: 'Banner added successfully.', banner: banner, status: 1 })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.postBlog = async (req, res, next) => {
    let blog_list = [];
    try {
        for (let i = 0; i < req.files.length; i++) {

            const image = await cloudinary.uploader.upload(req.files[i].path, {
                public_id: req.files[i].filename,
                width: 500,
                height: 500,
                crop: 'fill',
            });

            clearImage(image.public_id);
            blog_list.push({ image: image.url, title: req.body.title, description: req.body.description, creator_name: req.body.creator_name });
        }
        const blog = await Blog.create(blog_list[0]);
        blog.createdAt
        return res.status(200).json({ message: 'Blog created successfully.', blog: blog, status: 1 })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.postPoster = async (req, res, next) => {
    let poster_list = [];
    try {
        for (let i = 0; i < req.files.length; i++) {

            const image = await cloudinary.uploader.upload(req.files[i].path, {
                public_id: req.files[i].filename,
                width: 570,
                height: 570,
                crop: 'fill',
            });

            clearImage(image.public_id);
            poster_list.push({ image: image.url, title: req.body.title, description: req.body.description, itemId: req.body.itemId });
        }
        const poster = await Poster.create(poster_list[0]);
        return res.status(200).json({ message: 'Banner added successfully.', poster, status: 1 })
    } catch (error) {
        console.log(error);
        next(error);
    }
}