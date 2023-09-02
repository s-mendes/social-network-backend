import { CommentDB, CommentDBWithCreatorName } from '../models/Comments';
import { BaseDatabase } from './BaseDatabase';
import { UserDatabase } from './UserDatabase';


export class CommentsDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = 'comments';
  public static TABLE_LIKES_DISLIKES_COMMENTS = 'likes_dislike_comments';

  public insertComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentsDatabase.TABLE_COMMENTS).insert(commentDB);
  };

  public getCommentWithCreatorName = async (postId: string): Promise<CommentDBWithCreatorName[]> => {
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
      .where({post_id: postId});

    return result as CommentDBWithCreatorName[];
  };
}
