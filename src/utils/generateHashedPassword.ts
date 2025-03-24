import bcrypt from "bcrypt";

export async function generateHashedPassword(
  password: string
): Promise<string> {
  if (typeof password !== "string") throw new Error("Password must be a string");

  if (!password.length) throw new Error("Password cannot be empty");

  const saltRounds = parseInt(process.env.SALT_ROUNDS || "10");
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
}
