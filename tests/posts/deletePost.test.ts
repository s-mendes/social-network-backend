import { PostBusiness } from "../../src/business/PostBusiness";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { PostsDatabaseMock } from "../mocks/PostsDatabaseMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { DeletePostInputDTO } from "../../src/dtos/posts/deletePost.dto";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { BadRequestError } from "../../src/errors/BadRequestError";

describe("testes no deletePost", () => {
  const postsBusiness = new PostBusiness(
    new TokenManagerMock(),
    new IdGeneratorMock(),
    new PostsDatabaseMock()
  );

  it("Deve executar o deletePost", async () => {
    const input: DeletePostInputDTO = {
      idToDelete: "id-mock-post-1",
      token: "token-mock-astrodev",
    };

    const output = await postsBusiness.deletePost(input);

    expect(output).toBeDefined();
  });

  it("Deve lançar um erro NotFoundError se o post não existir no deletePost", async () => {
    const input: DeletePostInputDTO = {
      idToDelete: "id-post-inexistente",
      token: "token-mock-fulano",
    };

    await expect(async () => {
      await postsBusiness.deletePost(input);
    }).rejects.toThrow(NotFoundError);
  });

  it("Deve testar o token inválido no LikeDislike", async () => {
    const input: DeletePostInputDTO = {
      idToDelete: "id-mock-post-1",
      token: "token-invalido",
    };

    await expect(async () => {
      await postsBusiness.deletePost(input);
    }).rejects.toThrow(BadRequestError);
  });

  it("Deve testar se o usuário é o dono do post", async () => {
    const input: DeletePostInputDTO = {
      idToDelete: "id-mock-post-2",
      token: "token-mock-fulano",
    };

    await expect(async () => {
      await postsBusiness.deletePost(input);
    }).rejects.toThrow(BadRequestError);
  });
});
