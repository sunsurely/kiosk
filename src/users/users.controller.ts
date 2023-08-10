import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInfo } from './UserInfo';
import { UserLoginDto } from './dto/user-login.Dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const createUserResult = await this.usersService.createUser(
        createUserDto.email,
        createUserDto.name,
        createUserDto.password,
      );

      return createUserResult;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    try {
      const loginResult = await this.usersService.login(
        userLoginDto.email,
        userLoginDto.password,
      );

      return { message: '로그인에 성공했습니다.', accessToken: loginResult };
    } catch (e) {
      return { statusCode: e.status, success: false, message: e.message };
    }
  }
}
