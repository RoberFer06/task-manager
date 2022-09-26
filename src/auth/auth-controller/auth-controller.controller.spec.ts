import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AuthControllerController } from './auth-controller.controller';

describe('AuthControllerController', () => {
  let controller: AuthControllerController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthControllerController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthControllerController>(AuthControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('user registered ', async () => {
      const userRegisterServiceResult = {
        user: 'test',
      };
      jest
        .spyOn(authService, 'register')
        .mockImplementation(() => userRegisterServiceResult);

      expect(controller.register(userRegisterServiceResult)).toBe(
        userRegisterServiceResult,
      );
    });
  });
});
