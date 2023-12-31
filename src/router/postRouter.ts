import express from 'express';
import { PostController } from '../controller/PostController';
import { PostBusiness } from '../business/PostBusiness';
import { TokenManager } from '../services/TokenManager';
import { PostDatabase } from '../database/PostDatabase';
import { IdGenerator } from '../services/IdGenerator';

const postController = new PostController(
  new PostBusiness(
    new TokenManager(),
    new IdGenerator(),
    new PostDatabase
  )
);

export const postRouter = express.Router();

postRouter.post('/', postController.createPost);
postRouter.get('/', postController.getPosts);
postRouter.get('/:id', postController.getPostById);
postRouter.put('/:id', postController.editPost);
postRouter.delete('/:id', postController.deletePost);
postRouter.put('/:id/like', postController.likeOrDislikePost);
postRouter.get('/likes/:id', postController.findLikeDislike);
