import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/authDto';
import * as pactum from 'pactum';
import { CreateArticleDto } from '../src/articles/dto/create-article.dto';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';
import { UpdateArticleDto } from '../src/articles/dto/update-article.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('The things we do for love');
  });
});

describe('APP e2e-', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'bobby_mcfarrin@qwerty.com',
      password: '123abc',
    };

    describe('Sign up', () => {
      describe('UnHappy', () => {
        it('Should Throw if email missing', () => {
          return pactum
            .spec()
            .post('/auth/signUp')
            .withBody({ password: dto.password })
            .expectStatus(400);
        });

        it('Should Throw if password missing', () => {
          return pactum
            .spec()
            .post('/auth/signUp')
            .withBody({ email: dto.email })
            .expectStatus(400);
        });

        it('Should Throw if no body', () => {
          return pactum.spec().post('/auth/signUp').expectStatus(400);
        });
      });

      describe('Happy', () => {
        it('Should Signup', () => {
          return pactum
            .spec()
            .post('/auth/signUp')
            .withBody(dto)
            .expectStatus(201)
            .stores('userId', 'id');
        });
      });
    });

    describe('Login', () => {
      it('Should Throw if email missing', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should Throw if password missing', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should Throw if no body', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });

      it('Should Login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get user', () => {
      it('Should throw with no user token', () => {
        return pactum.spec().get('/users').expectStatus(401);
      });

      it('Should get user', () => {
        return pactum
          .spec()
          .get('/users')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('Should Edit user with a name provided', () => {
        const dto: UpdateUserDto = { name: 'Bobby McBigMac' };

        return pactum
          .spec()
          .patch(`/users/$S{userId}`)
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name);
      });
    });
  });

  describe('Article', () => {
    describe('Get empty articles', () => {
      it('Should get articles', () => {
        return pactum
          .spec()
          .get('/articles')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create article', () => {
      const dto: CreateArticleDto = {
        title: 'The Gettysburg Address',
        body:
          'Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.\n' +
          '\n' +
          'Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.\n' +
          '\n' +
          'But, in a larger sense, we can not dedicate -- we can not consecrate -- we can not hallow -- this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us -- that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion -- that we here highly resolve that these dead shall not have died in vain -- that this nation, under God, shall have a new birth of freedom -- and that government of the people, by the people, for the people, shall not perish from the earth.',
        description: "Abe Lincoln givin' them the Business.",
        published: true,
      };

      it('Should create article', () => {
        return pactum
          .spec()
          .post('/articles')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('articleId', 'id');
      });
    });

    describe('Get articles', () => {
      it('Should get articles', () => {
        return pactum
          .spec()
          .get('/articles')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get article by id', () => {
      it('should get article by id', () => {
        return pactum
          .spec()
          .get('/articles/{id}')
          .withPathParams('id', '$S{articleId}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200)
          .expectBodyContains('$S{articleId}');
      });
    });

    describe('Update article by id', () => {
      const dto: UpdateArticleDto = {
        title: 'Get That Address.',
        description: 'Dr. Abenheimmer, I presume.',
      };

      it('should edit article', () => {
        return pactum
          .spec()
          .patch('/articles/{id}')
          .withPathParams('id', '$S{articleId}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete article by id', () => {
      it('Should delete article', () => {
        return pactum
          .spec()
          .delete('/articles/{id}')
          .withPathParams('id', '$S{articleId}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(204);
      });

      it('Should get empty articles', () => {
        return pactum
          .spec()
          .get('/articles')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
