import { useEffect } from "preact/hooks"
import {
    Form,
    LoaderFunctionArgs,
    NavLink,
    Outlet,
    json,
    useLoaderData,
    useNavigation,
    useRevalidator,
    useSubmit,
} from "react-router-dom"
import { Contact, createContact, getContacts } from "~/lib/contacts"

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    const contacts = await getContacts(q)
    return json({ contacts, q })
}

export async function action() {
    const contact = await createContact()
    return json({ contact })
}

export default function Index() {
    const navigation = useNavigation()
    const { contacts, q } = useLoaderData() as { contacts: Contact[]; q: string }
    const revalidator = useRevalidator()
    const submit = useSubmit()

    useEffect(() => {
        revalidator.revalidate()
    }, [])

    const searching =
        navigation.location && new URLSearchParams(navigation.location.search).has("q")

    useEffect(() => {
        if (document) {
            ;(document.getElementById("q") as HTMLInputElement).value = q
        }
    }, [q])

    return (
        <div id="root">
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={event => {
                                const isFirstSearch = q == null
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                })
                            }}
                            class={searching ? "loading" : ""}
                        />
                        <div id="search-spinner" aria-hidden hidden={!searching} />
                        <div className="sr-only" aria-live="polite"></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map(contact => (
                                <li key={contact.id}>
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({
                                            isActive,
                                            isPending,
                                        }: {
                                            isActive: boolean
                                            isPending: boolean
                                        }) => (isActive ? "active" : isPending ? "pending" : "")}
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div id="detail" class={navigation.state === "loading" ? "loading" : ""}>
                <Outlet />
            </div>
        </div>
    )
}
