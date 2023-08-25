import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/posts/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/posts/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/posts/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/posts/getPosts.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/posts/likeOrDislikePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikeDB, POST_LIKE, Post } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
    constructor(
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator,
        private postDatabase: PostDatabase
    ) { };

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { content, token } = input;
        
        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError();
        }

        const id = this.idGenerator.generate();

        const post = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const postDB = post.toDBModel();
        await this.postDatabase.insertPost(postDB);

        const output: CreatePostOutputDTO = undefined;

        return output

    }

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
        const { token } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError();
        }

        const postDBWithCreatorName = await this.postDatabase.getPostWithCreatorName();

        const posts = postDBWithCreatorName.map(postWithCreatorName => {
            const post = new Post(
                postWithCreatorName.id,
                postWithCreatorName.content,
                postWithCreatorName.likes,
                postWithCreatorName.dislikes,
                postWithCreatorName.created_at,
                postWithCreatorName.updated_at,
                postWithCreatorName.creator_id,
                postWithCreatorName.creator_name
            )
            return post.toBusinessModel();
        })

        const output: GetPostsOutputDTO = posts;

        return output;
    }

    public editPost = async (input: EditPostInputDTO): Promise<CreatePostOutputDTO> => {
        const { content, token, idToEdit } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError();
        }

        const postDB = await this.postDatabase.findPostById(idToEdit);

        if (!postDB) {
            throw new NotFoundError("post com id inexistente");
        }

        if (payload.id !== postDB.creator_id) {
            throw new ForbiddenError("somente quem criou o post pode editá-la");
        }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            new Date().toISOString(),
            postDB.creator_id,
            payload.name
        );

        post.setContent(content);

        const updatedPostDB = post.toDBModel();
        await this.postDatabase.updatePost(updatedPostDB)

        const output: EditPostOutputDTO = undefined;

        return output;

    };

    public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {
        const { token, idToDelete } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError();
        }

        const postDB = await this.postDatabase.findPostById(idToDelete);

        if (!postDB) {
            throw new NotFoundError();
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (payload.id !== postDB.creator_id) {
                throw new ForbiddenError("Somente quem criou a postagem, pode deleta-la")
            }
        }

        await this.postDatabase.deletePostById(idToDelete)

        const output: DeletePostOutputDTO = undefined;

        return output;

    };

    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise<LikeOrDislikePostOutputDTO> => {
        const { token, like, postId } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError();
        }

        const postDBWithCreatorName = await this.postDatabase.findPostWithCreatorName(postId);

        if (!postDBWithCreatorName) {
            throw new NotFoundError("post não encontrado");
        }

        const post = new Post(
            postDBWithCreatorName.id,
            postDBWithCreatorName.content,
            postDBWithCreatorName.likes,
            postDBWithCreatorName.dislikes,
            postDBWithCreatorName.created_at,
            postDBWithCreatorName.updated_at,
            postDBWithCreatorName.creator_id,
            postDBWithCreatorName.creator_name
        )

        const likeDB = like ? 1 : 0;

        const likeDislikeDB: LikeDislikeDB = {
            user_id: payload.id,
            post_id: postId,
            like: likeDB
        }

        const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislikeDB);

        if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB);
                // console.log("\nAntes do remove\n"+post.getLikes())
                post.removeLike();
                // console.log("\nDepois do remove\n"+post.getLikes())
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB);
                post.removeLike();
                post.addDislike();
            }
        } else if ( likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
            if (like === false) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB);
                post.removeDislike();
                console.log("\nDepois do remove\n"+post.getDislikes())
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB);
                post.removeDislike();
                post.addLike();
            }
        } else {
            await this.postDatabase.insertLikeDislike(likeDislikeDB)
            like ? post.addLike() : post.addDislike();
        }

        const updatedPostDB = post.toDBModel();
        await this.postDatabase.updatePost(updatedPostDB);

        const output: LikeOrDislikePostOutputDTO = undefined;

        return output;
    };


}