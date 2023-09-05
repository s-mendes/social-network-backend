import { ZodError } from 'zod';
import { BaseError } from '../errors/BaseError';
import { Request, Response } from 'express';
import { CommentsBusiness } from '../business/CommentsBusiness';
import { CreateCommentSchema } from '../dtos/comments/createComment.dto';
import { GetCommentsSchema } from '../dtos/comments/getComments.dto';
import { EditCommentSchema } from '../dtos/comments/editComment.dto';
import { DeleteCommentSchema } from '../dtos/comments/deleteComment.dto';
import { FindLikeDislikeCommentSchema } from '../dtos/comments/findLikeDislikeComment.dto';
import { LikeOrDislikeCommentSchema } from '../dtos/comments/likeOrDislikeComment.dto';


export class CommentsController {
  constructor(
        private commentsBusiness: CommentsBusiness
  ){}

  public createComment = async (req: Request, res: Response) => {
    try {
      const input = CreateCommentSchema.parse({
        postId: req.params.postid,
        content: req.body.content,
        token: req.headers.authorization
      });

      const output = await this.commentsBusiness.createComment(input);

      res.status(201).send(output);
            
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send('Erro inesperado');
      }
    }
  };

  public getComments = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsSchema.parse({
        postId: req.params.postid,
        token: req.headers.authorization
      });

      const output = await this.commentsBusiness.getComments(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send('Erro inesperado');
      }
    }
  };

  public editComment = async (req: Request, res: Response) => {
    try {
      const input = EditCommentSchema.parse({
        token: req.headers.authorization,
        content: req.body.content,
        idToEdit: req.params.commentId
      });

      const output = await this.commentsBusiness.editComment(input);

      res.status(200).send(output);

    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send('Erro inesperado');
      }
    }
  };

  public deleteComment = async (req: Request, res: Response) => {
    try {
      const input = DeleteCommentSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.idToDelete
      });

      const output = await this.commentsBusiness.deleteComment(input);

      res.status(200).send(output);

    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send('Erro inesperado');
      }
    }
  };

  public findLikeDislikeComment = async (req: Request, res: Response) => {
    try {

      const input = FindLikeDislikeCommentSchema.parse({
        token: req.headers.authorization,
        commentId: req.params.id
      });

      const output = await this.commentsBusiness.findLikeDislikeComment(input);

      res.status(200).send(output);
      
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send('Erro inesperado');
      }
    }
  };

  public likeOrDislikePostComment = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: req.headers.authorization,
        commentId: req.params.id,
        like: req.body.like
      });

      const output = this.commentsBusiness.likeOrDislikePostComment(input);

      res.status(200).send(output);

    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send('Erro inesperado');
      }
    }
  };

}
