import { Router } from "express";
import * as recipesController from "../controllers/recipes";
import { isAuth } from "../middlewares/isAuth";

const router = Router();

router.get("/", isAuth, recipesController.getRecipes);
router.post("/", isAuth, recipesController.postRecipe);
router.put("/:recipeId", isAuth, recipesController.putRecipe);
router.delete("/:recipeId", isAuth, recipesController.deleteRecipe);
router.get("/search", recipesController.searchRecipes)

export default router;
