import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize the Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
    // create two dummy users
    const passwordSabin = await bcrypt.hash('password-sabin', roundsOfHashing);
    const passwordAlex = await bcrypt.hash('password-alex', roundsOfHashing);

    const user1 = await prisma.user.upsert({
        where: { email: 'sabin@adams.com' },
        update: {
            password: passwordSabin,
        },
        create: {
            email: 'sabin@adams.com',
            name: 'Sabin Adams',
            password: passwordSabin,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'alex@ruheni.com' },
        update: {
            password: passwordAlex,
        },
        create: {
            email: 'alex@ruheni.com',
            name: 'Alex Ruheni',
            password: passwordAlex,
        },
    });

    // create three dummy articles
    const post1 = await prisma.article.upsert({
        where: { title: 'Prisma Adds Support for MongoDB' },
        update: {
            authorId: user1.id,
        },
        create: {
            title: 'Prisma Adds Support for MongoDB',
            body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
            description:
                "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
            published: false,
            authorId: user1.id,
        },
    });

    const post2 = await prisma.article.upsert({
        where: { title: "What's new in Prisma? (Q1/22)" },
        update: {
            authorId: user2.id,
        },
        create: {
            title: "What's new in Prisma? (Q1/22)",
            body: 'Our engineers have been working hard, issuing new releases with many improvements...',
            description:
                'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
            published: true,
            authorId: user2.id,
        },
    });

    const post3 = await prisma.article.upsert({
        where: { title: 'Prisma Client Just Became a Lot More Flexible' },
        update: {},
        create: {
            title: 'Prisma Client Just Became a Lot More Flexible',
            body: 'Prisma Client extensions provide a powerful new way to add functionality to Prisma in a type-safe manner...',
            description:
                'This article will explore various ways you can use Prisma Client extensions to add custom functionality to Prisma Client..',
            published: true,
        },
    });

    const post4 = await prisma.article.upsert({
        where: { title: 'The Gettysburg Address' },
        update: { authorId: user2.id },
        create: {
            title: 'The Gettysburg Address',
            body:
                'Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.\n' +
                '\n' +
                'Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.\n' +
                '\n' +
                'But, in a larger sense, we can not dedicate -- we can not consecrate -- we can not hallow -- this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us -- that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion -- that we here highly resolve that these dead shall not have died in vain -- that this nation, under God, shall have a new birth of freedom -- and that government of the people, by the people, for the people, shall not perish from the earth.',
            description: "Abe Lincoln givin' them the Business.",
            published: true,
            authorId: user2.id,
        },
    });

    console.log({ user1, user2, post1, post2, post3, post4 });
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
