/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommentsDatabase } from '../database/CommentsDatabase';
import { PostDatabase } from '../database/PostDatabase';
import { CreateCommentInputDTO, CreateCommentOutputDTO } from '../dtos/comments/createComment.dto';
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from '../dtos/comments/deleteComment.dto';
import { EditCommentInputDTO, EditCommentOutputDTO } from '../dtos/comments/editComment.dto';
import { FindLikeDislikeCommentInputDTO, FindLikeDislikeCommentOutputDTO } from '../dtos/comments/findLikeDislikeComment.dto';
import { GetCommentsInputDTO, GetCommentsOutputDTO } from '../dtos/comments/getComments.dto';
import { LikeOrDislikeCommentInputDTO, LikeOrDislikeCommentOutputDTO } from '../dtos/comments/likeOrDislikeComment.dto';
import { ForbiddenError } from '../errors/ForbiddenError';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { COMMENT_LIKE, Comments, LikeDislikeCommentDB } from '../models/Comments';
import { USER_ROLES } from '../models/User';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';


export class CommentsBusiness {
  constructor(
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator,
        private commentsDatabase: CommentsDatabase,
        private postDatabase: PostDatabase
  ) { }

  public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {
    const { postId, content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const id = this.idGenerator.generate();

    const comment = new Comments(
      id,
      postId,
      content,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.id,
      payload.name
    );

    const commentDB = comment.toDBModel();
    await this.commentsDatabase.insertComment(commentDB);

    const output: CreateCommentOutputDTO = undefined;

    return output;
  };

  public getComments = async (input: GetCommentsInputDTO): Promise<GetCommentsOutputDTO> => {
    const { postId, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.postDatabase.findPostById(postId);

    if (!postDB) {
      throw new NotFoundError('post com id inexistente');
    }

    const commentDBWithCreatorName = await this.commentsDatabase.getCommentWithCreatorName(postId);

    const comments = commentDBWithCreatorName.map(commentWithCreatorName => {
      const comment = new Comments(
        commentWithCreatorName.id,
        commentWithCreatorName.post_id,
        commentWithCreatorName.content,
        commentWithCreatorName.likes,
        commentWithCreatorName.dislikes,
        commentWithCreatorName.created_at,
        commentWithCreatorName.updated_at,
        commentWithCreatorName.creator_id,
        commentWithCreatorName.creator_name
      );
      return comment.toBusinessModel();
    });

    const output: GetCommentsOutputDTO = comments;

    return output;

  };

  public editComment = async (input: EditCommentInputDTO): Promise<EditCommentOutputDTO> => {
    const { content, token, idToEdit } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDB = await this.commentsDatabase.findCommentById(idToEdit);

    if(!commentDB) {
      throw new NotFoundError('Comentário com id inexistente');
    }

    if (payload.id !== commentDB.creator_id) {
      throw new ForbiddenError('Somente quem criou o comentário pode editá-lo');
    }

    const comment = new Comments(
      commentDB.id,
      commentDB.post_id,
      commentDB.content,
      commentDB.likes,
      commentDB.dislikes,
      commentDB.created_at,
      new Date().toISOString(),
      commentDB.creator_id,
      payload.name
    );

    comment.setContent(content);

    const updatedCommentDB = comment.toDBModel();
    await this.commentsDatabase.updateComment(updatedCommentDB);

    const output: EditCommentOutputDTO = undefined;

    return output;

  };

  public deleteComment = async (input: DeleteCommentInputDTO): Promise<void> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const coommentDB = await this.commentsDatabase.findCommentById(idToDelete);

    if (!coommentDB) {
      throw new NotFoundError('Não foi encontrado comentário com ID informado');
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== coommentDB.creator_id) {
        throw new ForbiddenError('Somente quem criou o comentário, pode deleta-la');
      }
    }

    await this.commentsDatabase.deleteCommentById(idToDelete);

    const output: DeleteCommentOutputDTO = undefined;

    return output;
  };

  public findLikeDislikeComment = async (input: FindLikeDislikeCommentInputDTO): Promise<FindLikeDislikeCommentOutputDTO | undefined> => {
    const { token, commentId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const likeDislikeDB: LikeDislikeCommentDB = {
      user_id: payload.id,
      comment_id: commentId,
      like: null as any
    };

    const likeDislikeExists = await this.commentsDatabase.findLikeDislikeComment(likeDislikeDB);

    const output: FindLikeDislikeCommentOutputDTO | undefined = likeDislikeExists;

    return output;

  };

  public likeOrDislikePostComment = async (input: LikeOrDislikeCommentInputDTO): Promise<LikeOrDislikeCommentOutputDTO> => {
    const { token, like, commentId } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDBWithCreatorName = await this.commentsDatabase.findCommentWithCreatorName(commentId);

    if (!commentDBWithCreatorName) {
      throw new NotFoundError('Comentário não encontrado');
    }

    const comment = new Comments(
      commentDBWithCreatorName.id,
      commentDBWithCreatorName.post_id,
      commentDBWithCreatorName.content,
      commentDBWithCreatorName.likes,
      commentDBWithCreatorName.dislikes,
      commentDBWithCreatorName.created_at,
      commentDBWithCreatorName.updated_at,
      commentDBWithCreatorName.creator_id,
      commentDBWithCreatorName.creator_name
    );

    const likeDB = like ? 1 : 0;

    const likeDislikeCommentDB: LikeDislikeCommentDB = {
      user_id: payload.id,
      comment_id: commentId,
      like: likeDB
    };

    const likeDislikeExists = await this.commentsDatabase.findLikeDislikeComment(likeDislikeCommentDB);

    if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.commentsDatabase.removeLikeDislikeComment(likeDislikeCommentDB);
        comment.removeLike();
      } else {
        await this.commentsDatabase.updateLikeDislikeComment(likeDislikeCommentDB);
        comment.removeLike();
        comment.addDislike();
      }
    } else if ( likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.commentsDatabase.removeLikeDislikeComment(likeDislikeCommentDB);
        comment.removeDislike();
      } else {
        await this.commentsDatabase.updateLikeDislikeComment(likeDislikeCommentDB);
        comment.removeDislike();
        comment.addLike();
      }
    } else {
      await this.commentsDatabase.insertLikeDislikeComment(likeDislikeCommentDB);
      like ? comment.addLike() : comment.addDislike();
    }

    const updatedCommentDB = comment.toDBModel();
    await this.commentsDatabase.updateComment(updatedCommentDB);

    const output: LikeOrDislikeCommentOutputDTO = undefined;

    return output;

  };
}
