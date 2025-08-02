import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Get,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage, storeUploadFile } from './oss';
import * as path from 'path';
import * as fs from 'fs';
import { MyLoggerService } from 'src/logger/my-logger.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: MyLoggerService,
  ) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    this.logger.log('Login', 'UserController');
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

  @Post('upload/large-file')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: storeUploadFile,
      storage,
    }),
  )
  uploadLargerFile(@UploadedFiles() files: Express.Multer.File[], @Body() body: { name: string }) {
    // Step 1: Initial
    const fileName = body.name.match(/(.+)-\d+$/)?.[1] ?? body.name; // In request client
    const chuckDirPath = `${storeUploadFile}/chuck-${fileName}`;
    const filePath = files[0].path;

    // Step 2: Create a new folder to contain chuck files, if it not exist
    if (!fs.existsSync(chuckDirPath)) fs.mkdirSync(chuckDirPath);

    // Step 3: Copy/Add chuck files into the chuck's folder
    fs.copyFileSync(filePath, `${chuckDirPath}/${body.name}`);
    fs.rmSync(filePath);
  }

  @Get('merge/file')
  mergerFile(@Query('fileName') fileName: string) {
    const chuckDirPath = `${storeUploadFile}/chuck-${fileName}`;
    try {
      const files = fs.readdirSync(chuckDirPath);
      let startPosition = 0;
      let countFile = 0;
      const fileMergedPath = `${storeUploadFile}/merge/${fileName}`;

      if (!fs.existsSync(`${storeUploadFile}/merge`)) {
        fs.mkdirSync(`${storeUploadFile}/merge`);
      }

      files.forEach((file) => {
        const filePath = `${chuckDirPath}/${file}`;
        const streamFile = fs.createReadStream(filePath);

        streamFile
          .pipe(
            fs.createWriteStream(fileMergedPath, {
              start: startPosition,
            }),
          )
          .on('finish', () => {
            countFile++;

            if (countFile === files.length) {
              fs.rmSync(chuckDirPath, {
                recursive: true,
              });
            }
          });
        startPosition += fs.statSync(filePath).size;
      });

      return `http://localhost:3000/${fileMergedPath}`;
    } catch (error) {
      throw new BadRequestException('File not found');
    }
  }
}
