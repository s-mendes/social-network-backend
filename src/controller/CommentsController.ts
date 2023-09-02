import { ZodError } from 'zod';
import { BaseError } from '../errors/BaseError';
import { Request, Response } from 'express';
import { CommentsBusiness } from '../business/CommentsBusiness';
import { CreateCommentSchema } from '../dtos/comments/createComment.dto';
import { GetCommentsSchema } from '../dtos/comments/getComments.dto';


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
      console.error(error);

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
}
