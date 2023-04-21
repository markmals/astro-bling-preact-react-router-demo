import type { JSXInternal } from "preact/src/jsx"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom"
import { Form, json, useFetcher, useLoaderData } from "react-router-dom"
import type { Contact } from "~/lib/contacts"
import { getContact, updateContact } from "~/lib/contacts"

export async function loader({ params }: LoaderFunctionArgs) {
    const contact = await getContact(params.contactId!)

    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        })
    }

    return json({ contact })
}

export async function action({ request, params }: ActionFunctionArgs) {
    let formData = await request.formData()
    return updateContact(params.contactId!, {
        favorite: formData.get("favorite") === "true",
    })
}

type SubmitEvent = JSXInternal.TargetedEvent<HTMLFormElement, Event>

export default function ViewContact() {
    const { contact } = useLoaderData() as { contact: Contact }
    let hasAvatar = !!contact.avatar

    return (
        <div id="contact">
            <div>
                <img
                    alt=""
                    key={contact.avatar}
                    src={
                        hasAvatar
                            ? contact.avatar
                            : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    }
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite favorite={contact.favorite!} />
                </h1>

                {contact.mastodon && (
                    <p>
                        <a
                            href={`https://mastodon.social/${contact.mastodon.replace(
                                "@mastodon.social",
                                ""
                            )}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            {contact.mastodon}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        action="destroy"
                        method="post"
                        onSubmit={(event: SubmitEvent) => {
                            if (!confirm("Please confirm you want to delete this record.")) {
                                event.preventDefault()
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

function Favorite({ favorite }: { favorite: boolean }) {
    const fetcher = useFetcher()

    if (fetcher.formData) {
        favorite = fetcher.formData.get("favorite") === "true"
    }

    return (
        <fetcher.Form method="post">
            <button
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                name="favorite"
                value={favorite ? "false" : "true"}
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    )
}
