import type { Contact } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
import { matchSorter } from "match-sorter"
import sortBy from "sort-by"

// FIXME: For some reason, Prisma is getting imported into the client too...

const db = new PrismaClient()

export type { Contact }

export async function getContacts(query?: string) {
    await fakeNetwork(`getContacts:${query}`)
    let contacts = await db.contact.findMany()
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] })
    }
    return contacts.sort(sortBy("last", "createdAt"))
}

export async function createContact() {
    await fakeNetwork()
    return await db.contact.create({
        data: {
            first: "",
            last: "",
            avatar: "",
            mastodon: "",
        },
    })
}

export async function getContact(id?: number) {
    await fakeNetwork(`contact:${id}`)
    return await db.contact.findFirst({ where: { id } })
}

export async function updateContact(id: number, updates: Partial<Contact>) {
    await fakeNetwork()
    return await db.contact.update({ where: { id }, data: updates })
}

export async function deleteContact(id: number) {
    return await db.contact.delete({ where: { id } })
}

// fake a cache so we don't slow down stuff we've already seen
const fakeCache = new Map<string, boolean>()

async function fakeNetwork(key?: string): Promise<void> {
    if (!key || !fakeCache.get(key)) {
        if (key) fakeCache.set(key, true)

        return new Promise(res => {
            setTimeout(res, Math.random() * 1000)
        })
    }
}
