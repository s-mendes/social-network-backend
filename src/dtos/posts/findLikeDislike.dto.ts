import z from 'zod';
import { POST_LIKE } from '../../models/Post';

export interface FindLikeDislikeInputDTO {
    postId: string;
    token: string;
}

export type FindLikeDislikeOutputDTO = POST_LIKE;

export const FindLikeDislikeSchema = z.object({
  postId: z.string().min(1),
  token: z.string().min(1)
}).transform(data => data as FindLikeDislikeInputDTO);
