import {
    ActionFunctionArgs,
    Form,
    LoaderFunctionArgs,
    json,
    useFetcher,
    useLoaderData,
} from "react-router-dom"
import { Contact, getContact, updateContact } from "~/lib/contacts"

export async function loader({ params }: LoaderFunctionArgs) {
    const contact = await getContact(params.contactId)

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

export default function ViewContact() {
    const { contact } = useLoaderData() as { contact: Contact }

    return (
        <div id="contact">
            <div>
                <img key={contact.avatar} src={contact.avatar} />
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

                {contact.twitter && (
                    <p>
                        <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
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
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    )
}
