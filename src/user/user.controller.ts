import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage, storeUploadFile } from './oss';
import * as path from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('upload/file')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: storeUploadFile,
      storage,
      limits: {
        fileSize: 1024 * 1024 * 3, // 3Mb,
      },
      fileFilter(req, file, callback) {
        const extName = path.extname(file.originalname);
        if (['.jpg', '.jpeg', '.png'].includes(extName)) {
          return callback(null, true);
        }
        callback(new BadRequestException('Only image files are allowed!'), false);
      },
    }),
  )
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    return file.path;
  }

  @Post('upload/files')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      dest: storeUploadFile,
      storage,
      // limits: {},
      // fileFilter() {},
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => file.path);
  }
}
