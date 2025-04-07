import { AuthenticateUserDTO } from "../dtos/AuthenticateUserDTO";
import { AuthenticateUserResponseDTO } from "../dtos/AuthenticateUserResponseDTO";
import { UserResponseDTO } from "../dtos/UserResponseDTO";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO";
import { ResetPasswordDTO } from "../dtos/ResetPasswordDTO";
import { RefreshTokenDTO } from "../dtos/RefreshTokenDTO";

// export const userSchemas = {
//   AuthenticateUserDTO: {
//     type: "object",
//     properties: {
//       email: {
//         type: "string",
//         format: "email",
//       },
//       password: {
//         type: "string",
//       },
//     },
//     required: ["email", "password"],
//   },
//   UserResponseDTO: {
//     type: "object",
//     properties: {
//       id: { type: "string", format: "uuid" },
//       name: { type: "string" },
//       birthdate: { type: "string", format: "date-time", nullable: true },
//       contact: { type: "string", nullable: true },
//       nationalId: { type: "string", nullable: true },
//       email: { type: "string", format: "email" },
//       createdAt: { type: "string", format: "date-time" },
//       updatedAt: { type: "string", format: "date-time" },
//       createdById: { type: "string", format: "uuid", nullable: true },
//       updatedById: { type: "string", format: "uuid", nullable: true },
//     },
//     required: ["id", "name", "email", "createdAt", "updatedAt"],
//   },
//   AuthenticateUserResponseDTO: {
//     type: "object",
//     properties: {
//       accessToken: {
//         type: "string",
//       },
//       refreshToken: {
//         type: "string",
//       },
//       tokenExpiry: {
//         type: "number",
//       },
//       user: {
//         $ref: "#/components/schemas/UserResponseDTO",
//       },
//     },
//   },
// };

import { validationMetadatasToSchemas } from "class-validator-jsonschema";

import { getFromContainer, MetadataStorage } from "class-validator";

// Ensure metadata for DTOs is loaded
const metadata = getFromContainer(MetadataStorage);
metadata.addValidationMetadata(AuthenticateUserResponseDTO as any);
metadata.addValidationMetadata(UserResponseDTO as any);

// Explicitly include DTOs in schema generation
export const userSchemas = validationMetadatasToSchemas({
  refPointerPrefix: "#/components/schemas/",
});
