import { Controller, Post, Body, UseGuards, Get, Req, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, ProfileResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 requests per minute for signup
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 사용자를 등록합니다. 이메일은 중복될 수 없습니다.',
  })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '회원가입 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효성 검증 실패',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 존재하는 이메일',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: '요청 횟수 초과 (1분당 5회 제한)',
    type: ApiErrorResponse,
  })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 requests per minute for login (brute force protection)
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패 (잘못된 이메일 또는 비밀번호)',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효성 검증 실패',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: '요청 횟수 초과 (1분당 5회 제한)',
    type: ApiErrorResponse,
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @SkipThrottle() // Skip rate limiting for authenticated profile requests
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '내 프로필 조회',
    description: '현재 로그인한 사용자의 프로필 정보를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '프로필 조회 성공',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패 (유효하지 않은 토큰)',
    type: ApiErrorResponse,
  })
  async getProfile(@Req() req) {
    return {
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
      },
    };
  }
}
