import z from 'zod';
import { COMMENT_LIKE } from '../../models/Comments';

export interface FindLikeDislikeCommentInputDTO {
  commentId: string;
  token: string;
}

export type FindLikeDislikeCommentOutputDTO = COMMENT_LIKE;

export const FindLikeDislikeCommentSchema = z.object({
  commentId: z.string().min(1),
  token: z.string().min(1),
}).transform(data => data as FindLikeDislikeCommentInputDTO);
