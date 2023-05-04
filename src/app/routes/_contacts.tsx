import { useEffect } from "react"
import {
    Form,
    LoaderFunctionArgs,
    NavLink,
    Outlet,
    json,
    useLoaderData,
    useNavigate,
    useNavigation,
    useRevalidator,
    useSubmit,
} from "react-router-dom"
import type { Contact } from "~/lib/contacts.server"
import { getContacts } from "~/lib/contacts.server"

export async function loader({ request }: LoaderFunctionArgs) {
    let url = new URL(request.url)
    let q = url.searchParams.get("q") ?? undefined
    let contacts = await getContacts(q)
    return json({ contacts, q })
}

export default function ContactsLayout() {
    let navigation = useNavigation()
    let { contacts, q } = useLoaderData() as { contacts: Contact[]; q: string | null }
    let submit = useSubmit()
    let navigate = useNavigate()

    let revalidator = useRevalidator()
    useEffect(() => revalidator.revalidate(), [])

    let searching = navigation.location && new URLSearchParams(navigation.location.search).has("q")

    useEffect(() => {
        if (document) {
            document.querySelector<HTMLInputElement>("#q")!.value = q ?? ""
        }
    }, [q])

    return (
        <div id="root">
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            aria-label="Search contacts"
                            class={searching ? "loading" : ""}
                            defaultValue={q ?? undefined}
                            id="q"
                            name="q"
                            onChange={event => {
                                // Remove empty query params when value is empty
                                if (!event.currentTarget.value) {
                                    navigate("/")
                                    return
                                }
                                let isFirstSearch = q == null
                                submit(event.currentTarget.form, { replace: !isFirstSearch })
                            }}
                            placeholder="Search"
                            type="search"
                        />
                        <div aria-hidden hidden={!searching} id="search-spinner" />
                        <div aria-live="polite" class="sr-only"></div>
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
                                        className={({
                                            isActive,
                                            isPending,
                                        }: {
                                            isActive: boolean
                                            isPending: boolean
                                        }) => (isActive ? "active" : isPending ? "pending" : "")}
                                        to={`contact/${contact.id}`}
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
            <div class={navigation.state === "loading" ? "loading" : ""} id="detail">
                <Outlet />
            </div>
        </div>
    )
}
