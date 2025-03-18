import bcrypt from "bcrypt";

export async function generateHashedPassword(
  password: string
): Promise<string> {
  const saltRounds = parseInt(process.env.SALT_ROUNDS || "10");
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}
