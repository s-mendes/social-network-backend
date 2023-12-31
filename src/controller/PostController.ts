import { ZodError } from 'zod';
import { BaseError } from '../errors/BaseError';
import { Request, Response } from 'express';
import { CreatePostSchema } from '../dtos/posts/createPost.dto';
import { PostBusiness } from '../business/PostBusiness';
import { GetPostsSchema } from '../dtos/posts/getPosts.dto';
import { EditPostSchema } from '../dtos/posts/editPost.dto';
import { DeletePostSchema } from '../dtos/posts/deletePost.dto';
import { LikeOrDislikePostSchema } from '../dtos/posts/likeOrDislikePost.dto';
import { FindLikeDislikeSchema } from '../dtos/posts/findLikeDislike.dto';
import { GetPostByIdSchema } from '../dtos/posts/getPostById.dto';

export class PostController {
  constructor(
        private postBusiness: PostBusiness
  ) { }

  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostSchema.parse({
        content: req.body.content,
        token: req.headers.authorization
      });
            
      const output = await this.postBusiness.createPost(input);

      res.status(201).send(output);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send('Erro inesperado');
      }
    }
  };
  
  public getPosts = async (req: Request, res: Response) => {
    try {
      const input = GetPostsSchema.parse({
        token: req.headers.authorization
      });

      const output = await this.postBusiness.getPosts(input);

      res.status(200).send(output);

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

  public getPostById = async (req: Request, res: Response) => {
    try {
      const input = GetPostByIdSchema.parse({
        id: req.params.id,
        token: req.headers.authorization
      });

      const output = await this.postBusiness.getPostById(input);

      res.status(200).send(output);

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

  public editPost = async (req: Request, res: Response) => {
    try {
      const input = EditPostSchema.parse({
        token: req.headers.authorization,
        content: req.body.content,
        idToEdit: req.params.id
      });

      const output = await this.postBusiness.editPost(input);

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

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePostSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id
      });

      const output = await this.postBusiness.deletePost(input);

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

  public findLikeDislike = async (req: Request, res: Response) => {
    try {
      const input = FindLikeDislikeSchema.parse({
        token: req.headers.authorization,
        postId: req.params.id
      });

      const output = await this.postBusiness.findLikeDislike(input);

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

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikePostSchema.parse({
        token: req.headers.authorization,
        postId: req.params.id,
        like: req.body.like
      });

      const output = await this.postBusiness.likeOrDislikePost(input);

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
