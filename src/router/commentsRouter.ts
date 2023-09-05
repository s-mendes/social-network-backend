import express from 'express';
import { CommentsController } from '../controller/CommentsController';
import { CommentsBusiness } from '../business/CommentsBusiness';
import { TokenManager } from '../services/TokenManager';
import { IdGenerator } from '../services/IdGenerator';
import { CommentsDatabase } from '../database/CommentsDatabase';
import { PostDatabase } from '../database/PostDatabase';


const commentsController = new CommentsController(
  new CommentsBusiness(
    new TokenManager,
    new IdGenerator,
    new CommentsDatabase,
    new PostDatabase
  )
);

export const commentsRouter = express.Router();

commentsRouter.post('/:postid', commentsController.createComment);
commentsRouter.get('/:postid', commentsController.getComments);
commentsRouter.put('/:commentId', commentsController.editComment);
commentsRouter.delete('/:idToDelete', commentsController.deleteComment);
commentsRouter.put('/:id/like', commentsController.likeOrDislikePostComment);
commentsRouter.get('/likes/:id', commentsController.findLikeDislikeComment);
