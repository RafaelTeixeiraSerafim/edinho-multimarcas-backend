import { BrandRepository } from "@modules/brands/infra/prisma/repositories/BrandRepository";
import { FuelTypeRepository } from "@modules/fuelTypes/infra/prisma/repositories/FuelTypeRepository";
import { UserRepository } from "@modules/users/infra/prisma/repositories/UserRepository";
import { VehicleRepository } from "@modules/vehicles/infra/prisma/repositories/VehicleRepository";
import { container } from "tsyringe";

container.registerSingleton("VehicleRepository", VehicleRepository);
container.registerSingleton("UserRepository", UserRepository);
container.registerSingleton("FuelTypeRepository", FuelTypeRepository);
container.registerSingleton("BrandRepository", BrandRepository);
