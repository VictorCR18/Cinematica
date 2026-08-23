import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import * as watchlistController from "./watchlist.controller.js";
import { tmdbIdParamSchema, usernameParamSchema } from "./watchlist.schema.js";

export const watchlistRouter = Router();

watchlistRouter.get("/me", requireAuth, watchlistController.listMine);

watchlistRouter.get(
  "/:username",
  validate({ params: usernameParamSchema }),
  watchlistController.listByUsername,
);

watchlistRouter.post(
  "/:tmdbId",
  requireAuth,
  validate({ params: tmdbIdParamSchema }),
  watchlistController.add,
);

watchlistRouter.delete(
  "/:tmdbId",
  requireAuth,
  validate({ params: tmdbIdParamSchema }),
  watchlistController.remove,
);
