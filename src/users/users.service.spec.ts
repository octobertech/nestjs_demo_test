import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service'; // Path to the real PrismaService
import { NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Mock Prisma Client methods we expect UsersService to call
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  // Mock the $connect and $disconnect methods if they are used directly or needed by lifecycle hooks
  // $connect: jest.fn(),
  // $disconnect: jest.fn(),
};

// Example User data for tests
const mockUserId = 1;
const mockUser: User = {
  id: mockUserId,
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const mockUserArray: User[] = [mockUser];

const mockCreateUserDto: CreateUserDto = {
  name: 'Test User',
  email: 'test@example.com',
};

const mockUpdateUserDto: UpdateUserDto = {
  name: 'Updated Test User',
};


describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrismaService; // Use the type of our mock

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService, // Provide the real PrismaService token
          useValue: mockPrismaService, // But use our mock implementation
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService); // Get the mock instance

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Test cases for each method will go here ---

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange: Mock the prisma create method
      prisma.user.create.mockResolvedValue(mockUser);

      // Act: Call the service method
      const result = await service.create(mockCreateUserDto);

      // Assert: Check if prisma method was called correctly and result is correct
      expect(prisma.user.create).toHaveBeenCalledWith({ data: mockCreateUserDto });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
       // Arrange
       prisma.user.findMany.mockResolvedValue(mockUserArray);

       // Act
       const result = await service.findAll();

       // Assert
       expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
       expect(result).toEqual(mockUserArray);
    });
  });

   describe('findOne', () => {
    it('should return a single user if found', async () => {
      // Arrange
      prisma.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOne(mockUserId);

      // Assert
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: mockUserId } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      // Arrange: Mock findUniqueOrThrow to simulate Prisma's record not found error
       const prismaNotFoundError = { code: 'P2025' };
      prisma.user.findUniqueOrThrow.mockRejectedValue(prismaNotFoundError);

      // Act & Assert: Expect the service method to throw NotFoundException
      await expect(service.findOne(mockUserId)).rejects.toThrow(NotFoundException);
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: mockUserId } });
    });

     it('should re-throw other errors from prisma', async () => {
        // Arrange: Mock findUniqueOrThrow to throw a generic error
        const genericError = new Error('Some other database error');
        prisma.user.findUniqueOrThrow.mockRejectedValue(genericError);

        // Act & Assert: Expect the service method to re-throw the same error
        await expect(service.findOne(mockUserId)).rejects.toThrow(genericError);
        expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: mockUserId } });
     });
   });

  describe('update', () => {
    it('should update a user if found', async () => {
      // Arrange: Mock findOne (implicitly called via findUniqueOrThrow) and update
      const updatedUser = { ...mockUser, ...mockUpdateUserDto };
      prisma.user.findUniqueOrThrow.mockResolvedValue(mockUser); // Mock the findOne check
      prisma.user.update.mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(mockUserId, mockUpdateUserDto);

      // Assert
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: mockUserId } }); // Check if findOne was called
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: mockUpdateUserDto,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
       // Arrange: Mock findUniqueOrThrow to fail the initial check
       const prismaNotFoundError = { code: 'P2025' };
       prisma.user.findUniqueOrThrow.mockRejectedValue(prismaNotFoundError);

       // Act & Assert
       await expect(service.update(mockUserId, mockUpdateUserDto)).rejects.toThrow(NotFoundException);
       expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: mockUserId } });
       expect(prisma.user.update).not.toHaveBeenCalled(); // Ensure update wasn't called
    });
  });

  describe('remove', () => {
     it('should remove a user if found', async () => {
       // Arrange: Mock findOne (implicitly called via findUniqueOrThrow) and delete
       prisma.user.findUniqueOrThrow.mockResolvedValue(mockUser); // Mock the findOne check
       prisma.user.delete.mockResolvedValue(mockUser); // delete returns the deleted user

       // Act
       await service.remove(mockUserId);

       // Assert
       expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: mockUserId } }); // Check findOne call
       expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: mockUserId } });
     });

     it('should throw NotFoundException if user to remove is not found', async () => {
        // Arrange: Mock findUniqueOrThrow to fail the initial check
        const prismaNotFoundError = { code: 'P2025' };
        prisma.user.findUniqueOrThrow.mockRejectedValue(prismaNotFoundError);

        // Act & Assert
        await expect(service.remove(mockUserId)).rejects.toThrow(NotFoundException);
        expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: mockUserId } });
        expect(prisma.user.delete).not.toHaveBeenCalled(); // Ensure delete wasn't called
     });
  });

});