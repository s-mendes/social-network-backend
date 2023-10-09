import { ZodError } from "zod";
import { UserBusiness } from "../../src/business/UserBusiness";
import { LoginSchema } from "../../src/dtos/user/login.dto";
import { HashManagerMock } from "../mocks/HashManagerMock";
import { IdGeneratorMock } from "../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../mocks/UserDatabaseMock";
import { NotFoundError } from "../../src/errors/NotFoundError";

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar um token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "fulano@email.com",
      password: "fulano123",
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({
      token: "token-mock-fulano",
    });
  });

  test("deve testar se o email não é uma string", async () => {
    expect.assertions(1);

    try {
      const input = LoginSchema.parse({
        email: "fulano@email.com",
        password: "fulano123",
      });

      expect(typeof input.email).toBe("string");
    } catch (error) {
      expect(error).toBeDefined();
      expect(error instanceof ZodError).toBe(true);
    }
  });

  it("Deve lançar um erro NotFoundError se o email não estiver cadastrado", async () => {
    // Suponha que você tenha um email que não está cadastrado no seu mock
    const nonExistentEmail = "email-nao-cadastrado@test.com";

    const input = LoginSchema.parse({
      email: nonExistentEmail,
      password: "senha-qualquer",
    });

    await expect(async () => {
      await userBusiness.login(input);
    }).rejects.toThrow(NotFoundError);
  });

  it("Deve lançar um erro BadRequestError se o email ou senha forem inválidos", async () => {
    const input = LoginSchema.parse({
      email: "fulano@email.com",
      password: "senha-invalida",
    });

    await expect(async () => {
      await userBusiness.login(input);
    }).rejects.toThrow(NotFoundError);

    await expect(async () => {
      await userBusiness.login(input);
    }).rejects.toThrow("Email ou Senha inválidos");
  });
});
