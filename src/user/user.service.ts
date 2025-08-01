import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DbService) {}

  async register(registerUserDto: RegisterUserDto) {
    const usersRecord = await this.dbService.read<User[]>();

    if (!usersRecord) {
      throw new BadRequestException('Not found data');
    }

    const userExist = usersRecord.find((user) => user.accountName === registerUserDto.accountName);

    if (userExist) {
      throw new BadRequestException('User already exists');
    }

    const newUser = new User();
    newUser.accountName = registerUserDto.accountName;
    newUser.password = registerUserDto.password;

    usersRecord.push(newUser);
    await this.dbService.write(usersRecord);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accountName: User['accountName'] }> {
    const usersRecord = await this.dbService.read<User[]>();

    if (!usersRecord) {
      throw new BadRequestException('Not found data');
    }

    const userFound = usersRecord.find((user) => user.accountName === loginUserDto.accountName);

    if (!userFound) {
      throw new BadRequestException('Login failed');
    }

    if (userFound.password !== loginUserDto.password) {
      throw new BadRequestException('Login failed');
    }

    return {
      accountName: userFound.accountName,
    };
  }
}
