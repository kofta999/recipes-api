import { RequestHandler } from "express";
import { Recipe } from "../models/recipe";

const RECIPES_PER_PAGE = 3;

export const getRecipes: RequestHandler = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const totalRecipes = await Recipe.find().countDocuments();
    const recipes = await Recipe.find()
      .skip((page - 1) * RECIPES_PER_PAGE)
      .limit(RECIPES_PER_PAGE);

    const response: CustomResponse = {
      success: true,
      status_message: "Fetched recipes",
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
    const recipe = new Recipe({ name, description, ingredients });
    await recipe.save();
    const response: CustomResponse = {
      success: true,
      status_message: "created recipe successfully",
      data: { recipe },
    };
    res.status(201).json(response);
  } catch (err: any) {
    err.statusCode = 500;
    next(err);
  }
};

export const putRecipe: RequestHandler = async (req, res, next) => {
  const { recipeId } = req.params;
  const { name, description, ingredients } = req.body;
  try {
    const recipe = await Recipe.findById(recipeId);
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
  try {
    const deletedRecipe = await Recipe.findOneAndDelete({ _id: recipeId });
    if (!deletedRecipe) {
      const error = new Error("Recipe not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    res.status(204);
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
