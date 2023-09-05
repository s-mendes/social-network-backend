import { COMMENT_LIKE, CommentDB, CommentDBWithCreatorName, LikeDislikeCommentDB } from '../models/Comments';
import { BaseDatabase } from './BaseDatabase';
import { UserDatabase } from './UserDatabase';


export class CommentsDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = 'comments';
  public static TABLE_LIKES_DISLIKES_COMMENTS = 'likes_dislikes_comments';

  public insertComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS).insert(commentDB);
  };

  public getCommentWithCreatorName = async (commentId: string): Promise<CommentDBWithCreatorName[]> => {
    const result = await BaseDatabase
      .connection(CommentsDatabase.TABLE_COMMENTS)
      .select(
        `${CommentsDatabase.TABLE_COMMENTS}.id`,
        `${CommentsDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentsDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentsDatabase.TABLE_COMMENTS}.content`,
        `${CommentsDatabase.TABLE_COMMENTS}.likes`,
        `${CommentsDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentsDatabase.TABLE_COMMENTS}.created_at`,
        `${CommentsDatabase.TABLE_COMMENTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentsDatabase.TABLE_COMMENTS}.creator_id`,
        '=',
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({post_id: commentId});

    return result as CommentDBWithCreatorName[];
  };
  
  public findCommentById = async (id: string): Promise<CommentDB | undefined> => {
    const [ result ] = await BaseDatabase
      .connection(CommentsDatabase.TABLE_COMMENTS)
      .select()
      .where({ id });

    return result as CommentDB | undefined;
  };

  public updateComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentsDatabase.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id: commentDB.id });
  };

  public deleteCommentById = async (id: string): Promise<void> => {
    await BaseDatabase
      .connection(CommentsDatabase.TABLE_COMMENTS)
      .delete()
      .where({ id });
  };

  public findCommentWithCreatorName = async (id: string): Promise<CommentDBWithCreatorName | undefined> => {
    const [ result ] = await BaseDatabase
      .connection(CommentsDatabase.TABLE_COMMENTS)
      .select(
        `${CommentsDatabase.TABLE_COMMENTS}.id`,
        `${CommentsDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentsDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentsDatabase.TABLE_COMMENTS}.content`,
        `${CommentsDatabase.TABLE_COMMENTS}.likes`,
        `${CommentsDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentsDatabase.TABLE_COMMENTS}.created_at`,
        `${CommentsDatabase.TABLE_COMMENTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentsDatabase.TABLE_COMMENTS}.creator_id`,
        '=',
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${CommentsDatabase.TABLE_COMMENTS}.id`]: id });

    return result as CommentDBWithCreatorName | undefined;
  };

  public findLikeDislikeComment = async (likeDislikeCommentDB: LikeDislikeCommentDB): Promise<COMMENT_LIKE | undefined> => {
    const [ result ]: Array<LikeDislikeCommentDB | undefined> = await BaseDatabase
      .connection(CommentsDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .select()
      .where({
        user_id: likeDislikeCommentDB.user_id,
        comment_id: likeDislikeCommentDB.comment_id
      });

    if(result === undefined) {
      return undefined;
    } else if ( result.like === 1) {
      return COMMENT_LIKE.ALREADY_LIKED;
    } else {
      return COMMENT_LIKE.ALREADY_DISLIKED;
    }
  };

  public removeLikeDislikeComment = async (likeDislikeCommentDB: LikeDislikeCommentDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentsDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .delete()
      .where({
        user_id: likeDislikeCommentDB.user_id,
        comment_id: likeDislikeCommentDB.comment_id
      });
  };

  public updateLikeDislikeComment = async (likeDislikeCommentDB: LikeDislikeCommentDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentsDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .update(likeDislikeCommentDB)
      .where({
        user_id: likeDislikeCommentDB.user_id,
        comment_id: likeDislikeCommentDB.comment_id
      });
  };

  public insertLikeDislikeComment = async (likeDislikeCommentDB: LikeDislikeCommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentsDatabase.TABLE_LIKES_DISLIKES_COMMENTS).insert(likeDislikeCommentDB);
  };
}
