import { UserRepository } from "@modules/users/infra/prisma/repositories/UserRepository";
import { VehicleRepository } from "@modules/vehicles/infra/prisma/repositories/VehicleRepository";
import { container } from "tsyringe";

container.registerSingleton("VehicleRepository", VehicleRepository);
container.registerSingleton("UserRepository", UserRepository);

