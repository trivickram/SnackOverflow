import Food from '../models/food.model.js'
import fs from 'fs'

// Add Food with file validation and error handling
const addFood = async (req, res) => {
    // Validate if an image file is provided
    if (!req.file) {
        return res.json({ success: false, message: 'Image file is required' });
    }

    // Assign the image filename
    let image_filename = req.file.filename;

    // Create a new food item
    const food = new Food({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    });

    try {
        // Save the food item to the database
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        // Log the error and send a response
        console.log(error);
        res.json({ success: false, message: error.message || 'Error' }); // More detailed error message
    }
};

// List all foods
const listFood = async (req, res) => {
    try {
        // Fetch all food items
        const foods = await Food.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        // Log the error and send a response
        console.log(error);
        res.json({ success: false, message: error.message || "Error" });
    }
};

// Remove Food with file deletion and better error handling
const removeFood = async (req, res) => {
    try {
        // Check if the food exists in the database
        const food = await Food.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: 'Food item not found' });
        }

        // Try to delete the image file associated with the food
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.log(err); // Log error if the file can't be deleted
            }
        });

        // Delete the food from the database
        await Food.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food removed" });
    } catch (error) {
        // Log the error and send a response
        console.log(error);
        res.json({ success: false, message: error.message || 'Error' }); // More detailed error message
    }
};

export { addFood, listFood, removeFood };
