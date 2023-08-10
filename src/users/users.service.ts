import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  async createUser(email: string, name: string, password: string) {
    try {
      const encryptedPassword = await bcrypt.hash(password, 15);
      const existUser = await this.usersRepository.findOne({
        where: { email },
      });
      if (existUser) {
        throw Error('이미 존재하는 사용자입니다.');
      }
      const user = new UserEntity();
      user.name = name;
      user.email = email;
      user.password = encryptedPassword;

      const createUserResult = await this.usersRepository.save(user);
      return createUserResult;
    } catch (e) {
      throw e;
    }
  }

  async login(email: string, password: string) {
    const existUser = await this.usersRepository.findOne({ where: { email } });
    try {
      if (!existUser) {
        throw new NotFoundException('존재하지 않는 사용자입니다.');
      }

      const comparedPassword = await bcrypt.compare(
        password,
        existUser.password,
      );
      if (!comparedPassword) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
      }

      const payload = { email: existUser.email };
      const accessToken = await this.jwtService.signAsync(payload);
      return accessToken;
    } catch (e) {
      throw e;
    }
  }
}
