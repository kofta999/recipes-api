import { Router } from "express";
import * as recipesController from "../controllers/recipes";

const router = Router();

router.get("/", recipesController.getRecipes);
router.post("/", recipesController.postRecipe);
router.put("/:recipeId", recipesController.putRecipe);
router.delete("/:recipeId", recipesController.deleteRecipe);

export default router;
