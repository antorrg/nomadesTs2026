import { ImageRepository } from "../Features/images/ImageRepository.js";
import { parser } from "../Features/images/Images.interface.js";
import { Image } from '../Configs/database.js'

//---Repositories

export const imageRepository = new ImageRepository(Image, parser as any)