import { ImageRepository } from "../Features/images/ImageRepository.js";
import { parser } from "../Features/images/Images.interface.js";
import { User, Image } from '../Configs/database.js'
import { emailService } from "../ExternalServices/EmailService/EmailService.js";
import { UserRepository } from "../Features/user/UserRepository.js";
import { mockData, userParser } from "../Features/user/UserMappers.js";
import { UserService } from "../Features/user/UserService.js";
import { mockImageDeleteService } from "./Interfaces/base.interface.js";

//---Repositories

export const imageRepository = new ImageRepository(Image, parser)
export const userRepository = new UserRepository(User, userParser, userParser, 'User', 'email', mockData)

//---Services

export const userService = new UserService(userRepository, mockImageDeleteService, false, 'picture', emailService)
