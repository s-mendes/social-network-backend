import { PostBusiness } from "../../src/business/PostBusiness";
import { CreatePostSchema } from "../../src/dtos/posts/createPost.dto";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { PostsDatabaseMock } from "../mocks/PostsDatabaseMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { BadRequestError } from "../../src/errors/BadRequestError";

describe("testes no createPost", () => {
  const postsBusiness = new PostBusiness(
    new TokenManagerMock(),
    new IdGeneratorMock(),
    new PostsDatabaseMock(),
  );

  it("Deve criar um novo post", async () => {
    const input = CreatePostSchema.parse({
      token: "token-mock-fulano",
      content: "Este é o post 1",
    });

    const output = await postsBusiness.createPost(input);

    expect(output).toBeUndefined();
  });

  it("Deve testar o token", async () => {
    const input = CreatePostSchema.parse({
      token: "token",
      content: "Este é o post 1",
    });

    await expect(async () => {
      await postsBusiness.createPost(input);
    }).rejects.toThrow(BadRequestError);
  });

  it("Deve testar se o id existe", async () => {
    const postsDatabaseMock = new PostsDatabaseMock();
    postsDatabaseMock.findPostById = jest
      .fn()
      .mockReturnValue({ id: "id-existente" });

    const input = CreatePostSchema.parse({
      token: "token-mock-fulano",
      content: "Este é o post 1",
    });

    await expect(async () => {
      await postsBusiness.createPost(input);
    }).rejects.toThrow(BadRequestError);
  });
});
