import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as reviewsService from "./reviews.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { tmdbId } = req.params as unknown as { tmdbId: number };
  res
    .status(201)
    .json(await reviewsService.createReview(req.user!.id, tmdbId, req.body));
});

export const listForMovie = asyncHandler(
  async (req: Request, res: Response) => {
    const { tmdbId } = req.params as unknown as { tmdbId: number };
    res.json(
      await reviewsService.listReviewsForMovie(
        tmdbId,
        req.query as { page?: string; limit?: string },
        req.user?.id,
      ),
    );
  },
);

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  res.json(
    await reviewsService.getReviewById(req.params.id as string, req.user?.id),
  );
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  res.json(
    await reviewsService.updateReview(
      req.user!.id,
      req.params.id as string,
      req.body,
    ),
  );
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  res.json(
    await reviewsService.deleteReview(req.user!.id, req.params.id as string),
  );
});

export const like = asyncHandler(async (req: Request, res: Response) => {
  res.json(
    await reviewsService.likeReview(req.user!.id, req.params.id as string),
  );
});

export const unlike = asyncHandler(async (req: Request, res: Response) => {
  res.json(
    await reviewsService.unlikeReview(req.user!.id, req.params.id as string),
  );
});
