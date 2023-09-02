import { CommentsDatabase } from '../database/CommentsDatabase';
import { PostDatabase } from '../database/PostDatabase';
import { CreateCommentInputDTO, CreateCommentOutputDTO } from '../dtos/comments/createComment.dto';
import { GetCommentsInputDTO, GetCommentsOutputDTO } from '../dtos/comments/getComments.dto';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { Comments } from '../models/Comments';
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
}
