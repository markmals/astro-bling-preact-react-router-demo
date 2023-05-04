import { server$ } from "@tanstack/bling"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom"
import { Form, json, redirect, useLoaderData, useNavigate } from "react-router-dom"
import { Contact, getContact, updateContact } from "~/lib/contacts.server"

export async function loader({ params }: LoaderFunctionArgs) {
    const contact = await getContact(parseInt(params.contactId!))

    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        })
    }

    return json({ contact })
}

export async function action({ request, params }: ActionFunctionArgs) {
    server$(async () => {
        let formData = await request.formData()
        let updates = Object.fromEntries(formData)
        await updateContact(parseInt(params.contactId!), updates)
    })

    return redirect(`/contact/${params.contactId}`)
}

export default function EditContact() {
    let { contact } = useLoaderData() as { contact: Contact }
    let navigate = useNavigate()

    return (
        <Form id="contact-form" method="post">
            <p>
                <span>Name</span>
                <input
                    aria-label="First name"
                    defaultValue={contact.first ?? undefined}
                    name="first"
                    placeholder="First"
                    type="text"
                />
                <input
                    aria-label="Last name"
                    defaultValue={contact.last ?? undefined}
                    name="last"
                    placeholder="Last"
                    type="text"
                />
            </p>
            <label>
                <span>Mastodon</span>
                <input
                    defaultValue={contact.mastodon ?? undefined}
                    name="mastodon"
                    placeholder="@Gargron@mastodon.social"
                    type="text"
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    aria-label="Avatar URL"
                    defaultValue={contact.avatar ?? undefined}
                    name="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea defaultValue={contact.notes ?? undefined} name="notes" rows={6} />
            </label>
            <p>
                <button type="submit">Save</button>
                <button onClick={() => navigate(-1)} type="button">
                    Cancel
                </button>
            </p>
        </Form>
    )
}
