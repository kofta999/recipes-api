import { RequestHandler } from "express";
import { Recipe } from "../models/recipe";
import { User } from "../models/user";

const RECIPES_PER_PAGE = 3;

export const getRecipes: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req;
    const page = parseInt(req.query.page as string) || 1;
    const user = await User.findById(userId).populate({
      path: "recipes",
      options: {
        skip: (page - 1) * RECIPES_PER_PAGE,
        limit: RECIPES_PER_PAGE,
      },
    });
    if (!user) {
      const error = new Error("User not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    const recipes = user.recipes;
    const totalRecipes = (await User.findById(userId))?.recipes.length;
    const response: CustomResponse = {
      success: true,
      status_message: "Fetched recipes of user",
      data: {
        totalRecipes,
        recipes,
      },
    };
    res.status(200).json(response);
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const postRecipe: RequestHandler = async (req, res, next) => {
  try {
    // validation
    const { name, description, ingredients } = req.body;
    const { userId } = req;
    const recipe = new Recipe({
      name,
      description,
      ingredients,
      creator: userId,
    });
    await recipe.save();
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    user.recipes.push(recipe._id);
    await user.save();
    const response: CustomResponse = {
      success: true,
      status_message: "created recipe successfully",
      data: { recipe, userId },
    };
    res.status(201).json(response);
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const putRecipe: RequestHandler = async (req, res, next) => {
  const { recipeId } = req.params;
  const { userId } = req;
  const { name, description, ingredients } = req.body;
  try {
    const recipe = await Recipe.findOne({ _id: recipeId, creator: userId });
    if (!recipe) {
      const error = new Error("Recipe not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    recipe.name = name;
    recipe.description = description;
    recipe.ingredients = ingredients;
    await recipe.save();

    const response: CustomResponse = {
      success: true,
      status_message: "Updated recipe",
      data: { recipe },
    };
    res.status(200).json(response);
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteRecipe: RequestHandler = async (req, res, next) => {
  const { recipeId } = req.params;
  const { userId } = req;
  try {
    const deletedRecipe = await Recipe.findOneAndDelete({
      _id: recipeId,
      creator: userId,
    });
    if (!deletedRecipe) {
      const error = new Error("Recipe not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    user.recipes.pull(recipeId);
    await user.save();
    res.status(204).json({});
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const searchRecipes: RequestHandler = async (req, res, next) => {
  const query = req.query.query as string;
  const page = parseInt(req.query.page as string) || 1;
  if (!query) {
    const error = new Error("Search query not provieded") as CustomError;
    error.statusCode = 400;
    throw error;
  }
  const searchResults = await Recipe.find({
    name: { $regex: new RegExp(query, "i") },
  })
    .skip((page - 1) * RECIPES_PER_PAGE)
    .limit(RECIPES_PER_PAGE);
  const response: CustomResponse = {
    success: true,
    status_message: "Fetched search results",
    data: searchResults,
  };
  res.status(200).json(response);
};
