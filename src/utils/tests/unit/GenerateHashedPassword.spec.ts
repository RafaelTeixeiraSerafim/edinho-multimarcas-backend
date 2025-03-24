import bcrypt from "bcrypt";
import { generateHashedPassword } from "@utils/generateHashedPassword";

// Mock bcrypt module
jest.mock("bcrypt");

describe("generateHashedPassword", () => {
  const mockPassword = "testPassword123";
  const mockSalt = "mockSalt";
  const mockHash = "mockHashedPassword";

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock process.env
    process.env.SALT_ROUNDS = "10";
  });

  it("deve gerar um hash de senha com sucesso", async () => {
    // Setup mocks
    (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

    const result = await generateHashedPassword(mockPassword);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, mockSalt);
    expect(result).toBe(mockHash);
  });

  it("deve usar o valor padrão de SALT_ROUNDS quando não definido", async () => {
    delete process.env.SALT_ROUNDS;
    
    (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

    await generateHashedPassword(mockPassword);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10); // Default value
  });

  it("deve usar o SALT_ROUNDS definido no environment", async () => {
    process.env.SALT_ROUNDS = "12";
    
    (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

    await generateHashedPassword(mockPassword);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
  });

  it("deve lidar com erros durante a geração do salt", async () => {
    const mockError = new Error("Salt generation failed");
    (bcrypt.genSalt as jest.Mock).mockRejectedValue(mockError);

    await expect(generateHashedPassword(mockPassword))
      .rejects
      .toThrow("Salt generation failed");
  });

  it("deve lidar com erros durante o hashing", async () => {
    const mockError = new Error("Hashing failed");
    (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
    (bcrypt.hash as jest.Mock).mockRejectedValue(mockError);

    await expect(generateHashedPassword(mockPassword))
      .rejects
      .toThrow("Hashing failed");
  });

  it("deve rejeitar quando a senha é vazia", async () => {
    await expect(generateHashedPassword(""))
      .rejects
      .toThrow("Password cannot be empty");
  });

  it("deve rejeitar quando a senha não é string", async () => {
    // @ts-ignore - Testing invalid input
    await expect(generateHashedPassword(12345))
      .rejects
      .toThrow("Password must be a string");
  });
});