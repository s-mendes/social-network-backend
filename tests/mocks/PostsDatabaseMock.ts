import { POST_LIKE, PostDB, LikeDislikeDB, PostDBWithCreatorName } from "../../src/models/Post";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const postsMock: PostDB[] = [
  {
    id: "id-mock-post-1",
    creator_id: "id-mock-fulano",
    content: "Este é o post 1",
    likes: 5,
    dislikes: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "id-mock-post-2",
    creator_id: "id-mock-astrodev",
    content: "Este é o post 2",
    likes: 10,
    dislikes: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const postsMockWithCreatorName: PostDBWithCreatorName[] = [
  {
    id: "id-mock-post-1",
    creator_id: "id-mock-fulano",
    content: "Este é o post 1",
    likes: 5,
    dislikes: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_name: "Marcolino"
  },
  {
    id: "id-mock-post-2",
    creator_id: "id-mock-astrodev",
    content: "Este é o post 2",
    likes: 10,
    dislikes: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    creator_name: "Ruanzito"
  },
];


const likesDislikesMock: LikeDislikeDB[] = [
  {
    user_id: "id-mock-fulano",
    post_id: "id-mock-post-1",
    like: 1,
  },
  {
    user_id: "id-mock-astrodev",
    post_id: "id-mock-post-1",
    like: 0,
  },
  {
    user_id: "id-mock-fulano",
    post_id: "id-mock-post-2",
    like: 1,
  },
];

export class PostsDatabaseMock extends BaseDatabase {
  public static TABLE_NAME = "posts";
  public static TABLE_NAME_2 = "likes_dislikes";

  public async insertPost(newPostsDB: PostDB): Promise<void> {
    postsMock.push(newPostsDB);
  }

  public async getPostWithCreatorName(): Promise<PostDBWithCreatorName[]> {
    return postsMockWithCreatorName;
  }

  public async findPostWithCreatorName(): Promise<PostDBWithCreatorName | undefined> {
    return postsMockWithCreatorName[1];
  }

  public async findPostById(id: string): Promise<PostDB | undefined> {
    return postsMock.find((post) => post.id === id);
  }

  public async updatePost(postDB: PostDB): Promise<void> {
    const postIndex = postsMock.findIndex((post) => post.id === postDB.id);
    if (postIndex !== -1) {
      postsMock[postIndex] = postDB;
    }
  }

  public async deletePostById(id: string): Promise<void> {
    const postIndex = postsMock.findIndex((post) => post.id === id);
    if (postIndex !== -1) {
      postsMock.splice(postIndex, 1);
    }
  }

  public async insertLikeDislike(
    newLikeDislikeDB: LikeDislikeDB
  ): Promise<void> {
    likesDislikesMock.push(newLikeDislikeDB);
  }

  public async findLikeDislike(
    likeDislikeDB: LikeDislikeDB
  ): Promise<POST_LIKE | undefined> {
    const existingLikeDislike = likesDislikesMock.find(
      (ld) =>
        ld.user_id === likeDislikeDB.user_id &&
        ld.post_id === likeDislikeDB.post_id
    );

    if (!existingLikeDislike) {
      return undefined;
    } else if (existingLikeDislike.like === 1) {
      return POST_LIKE.ALREADY_LIKED;
    } else {
      return POST_LIKE.ALREADY_DISLIKED;
    }
  }

  public async removeLikeDislike(
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> {
    const likeDislikeIndex = likesDislikesMock.findIndex(
      (ld) =>
        ld.user_id === likeDislikeDB.user_id &&
        ld.post_id === likeDislikeDB.post_id
    );
    if (likeDislikeIndex !== -1) {
      likesDislikesMock.splice(likeDislikeIndex, 1);
    }
  }

  public async updateLikeDislike(
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> {
    const likeDislikeIndex = likesDislikesMock.findIndex(
      (ld) =>
        ld.user_id === likeDislikeDB.user_id &&
        ld.post_id === likeDislikeDB.post_id
    );
    if (likeDislikeIndex !== -1) {
      likesDislikesMock[likeDislikeIndex] = likeDislikeDB;
    }
  }
}
