import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('Together Pray API (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;
  let groupId: string;
  let prayerItemId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
    };

    it('/auth/signup (POST) - should create new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);

      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('/auth/signup (POST) - should fail with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(testUser)
        .expect(400);
    });

    it('/auth/login (POST) - should login with correct credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('/auth/login (POST) - should fail with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('/auth/me (GET) - should return authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.user.email).toBe(testUser.email);
    });

    it('/auth/me (GET) - should fail without token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });

  describe('Groups Flow', () => {
    it('/groups (POST) - should create new group', async () => {
      const response = await request(app.getHttpServer())
        .post('/groups')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Prayer Group',
          description: 'A test group for e2e testing',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('inviteCode');
      expect(response.body.name).toBe('Test Prayer Group');

      groupId = response.body.id;
    });

    it('/groups (GET) - should list user groups', async () => {
      const response = await request(app.getHttpServer())
        .get('/groups')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('/groups/:id (GET) - should get group details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/groups/${groupId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(groupId);
      expect(response.body.name).toBe('Test Prayer Group');
    });
  });

  describe('Prayer Items Flow', () => {
    it('/prayer-items (POST) - should create prayer item', async () => {
      const response = await request(app.getHttpServer())
        .post('/prayer-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          groupId: groupId,
          title: 'Test Prayer Request',
          content: 'Please pray for my family',
          isAnonymous: false,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Prayer Request');
      expect(response.body.status).toBe('praying');

      prayerItemId = response.body.id;
    });

    it('/prayer-items (POST) - should create anonymous prayer', async () => {
      const response = await request(app.getHttpServer())
        .post('/prayer-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          groupId: groupId,
          title: 'Anonymous Prayer',
          content: 'Secret prayer request',
          isAnonymous: true,
        })
        .expect(201);

      expect(response.body.isAnonymous).toBe(true);
    });

    it('/prayer-items/group/:groupId (GET) - should list prayer items', async () => {
      const response = await request(app.getHttpServer())
        .get(`/prayer-items/group/${groupId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
    });

    it('/prayer-items/group/:groupId (GET) - should filter by status', async () => {
      const response = await request(app.getHttpServer())
        .get(`/prayer-items/group/${groupId}?status=praying`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.items.every((item) => item.status === 'praying')).toBe(
        true,
      );
    });

    it('/prayer-items/:id (GET) - should get prayer item details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/prayer-items/${prayerItemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(prayerItemId);
      expect(response.body.title).toBe('Test Prayer Request');
    });

    it('/prayer-items/:id/status (PATCH) - should update prayer status', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/prayer-items/${prayerItemId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'answered',
        })
        .expect(200);

      expect(response.body.status).toBe('answered');
    });
  });

  describe('Prayer Reactions Flow', () => {
    beforeAll(async () => {
      // Create a new prayer item for reaction testing
      const response = await request(app.getHttpServer())
        .post('/prayer-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          groupId: groupId,
          title: 'Prayer for Reactions Test',
          content: 'Test prayer reactions',
          isAnonymous: false,
        });

      prayerItemId = response.body.id;
    });

    it('/prayer-items/:id/pray (POST) - should record prayer', async () => {
      const response = await request(app.getHttpServer())
        .post(`/prayer-items/${prayerItemId}/pray`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.prayCount).toBeGreaterThanOrEqual(1);
    });

    it('/prayer-items/:id/pray (POST) - should prevent duplicate prayer on same day', async () => {
      await request(app.getHttpServer())
        .post(`/prayer-items/${prayerItemId}/pray`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('/prayer-items/:id/prayers (GET) - should get prayers list', async () => {
      const response = await request(app.getHttpServer())
        .get(`/prayer-items/${prayerItemId}/prayers`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Authorization Tests', () => {
    it('should prevent access without authentication', async () => {
      await request(app.getHttpServer()).get('/groups').expect(401);

      await request(app.getHttpServer()).post('/prayer-items').send({}).expect(401);
    });

    it('should prevent accessing other users prayer items', async () => {
      // Create another user
      const anotherUser = {
        email: `another-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Another User',
      };

      const signupRes = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(anotherUser);

      const anotherToken = signupRes.body.token;

      // Try to access prayer item from different group
      await request(app.getHttpServer())
        .get(`/prayer-items/${prayerItemId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(403);
    });
  });

  describe('Validation Tests', () => {
    it('should validate email format', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test',
        })
        .expect(400);
    });

    it('should require all mandatory fields', async () => {
      await request(app.getHttpServer())
        .post('/prayer-items')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Missing groupId',
        })
        .expect(400);
    });
  });
});
