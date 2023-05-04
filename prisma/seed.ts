import { PrismaClient } from "@prisma/client"
const db = new PrismaClient()

async function main() {
    try {
        await db.contact.upsert({
            where: { id: 1 },
            update: {},
            create: {
                first: "Dennis",
                last: "Beatty",
                avatar: "https://userstock.io/data/wp-content/uploads/2020/05/warren-wong-VVEwJJRRHgk-1024x1024.jpg",
                mastodon: "@dennis@mastodon.social",
            },
        })

        await db.contact.upsert({
            where: { id: 2 },
            update: {},
            create: {
                first: "Greg",
                last: "Brimble",
                avatar: "https://userstock.io/data/wp-content/uploads/2020/06/jack-finnigan-rriAI0nhcbc-1024x1024.jpg",
                mastodon: "@greg@mastodon.social",
            },
        })

        await db.contact.upsert({
            where: { id: 3 },
            update: {},
            create: {
                first: "Ryan",
                last: "Dahl",
                avatar: "https://userstock.io/data/wp-content/uploads/2017/09/yingchou-han-261533-1024x987.jpg",
                mastodon: "@ryan@mastodon.social",
            },
        })

        await db.contact.upsert({
            where: { id: 4 },
            update: {},
            create: {
                first: "Sarah",
                last: "Dayan",
                avatar: "https://userstock.io/data/wp-content/uploads/2020/06/women-s-white-and-black-button-up-collared-shirt-774909-2-1024x1024.jpg",
                mastodon: "@sarah@mastodon.social",
            },
        })

        await db.contact.upsert({
            where: { id: 5 },
            update: {},
            create: {
                first: "Ceora",
                last: "Ford",
                avatar: "https://userstock.io/data/wp-content/uploads/2020/06/kimson-doan-HD8KlyWRYYM-4-1024x1024.jpg",
                mastodon: "@ceora@mastodon.social",
            },
        })

        await db.contact.upsert({
            where: { id: 9 },
            update: {},
            create: {
                first: "Anthony",
                last: "Frehner",
                avatar: "https://userstock.io/data/wp-content/uploads/2020/05/imansyah-muhamad-putera-n4KewLKFOZw-1024x1024.jpg",
                mastodon: "@anthony@mastodon.social",
            },
        })

        await db.contact.upsert({
            where: { id: 7 },
            update: {},
            create: {
                first: "Arisa",
                last: "Fukuzaki",
                avatar: "https://userstock.io/data/wp-content/uploads/2020/06/aiony-haust-3TLl_97HNJo-1024x1024.jpg",
                mastodon: "@arisa@mastodon.social",
            },
        })

        await db.contact.upsert({
            where: { id: 8 },
            update: {},
            create: {
                first: "Henri",
                last: "Helvetica",
                avatar: "https://userstock.io/data/wp-content/uploads/2017/09/yingchou-han-241463-1024x1005.jpg",
                mastodon: "@henri@mastodon.social",
            },
        })
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await db.$disconnect()
    }
}

main()
