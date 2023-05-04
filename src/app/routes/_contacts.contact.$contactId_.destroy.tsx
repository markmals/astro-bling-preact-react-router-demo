import { server$ } from "@tanstack/bling"
import type { ActionFunctionArgs } from "react-router-dom"
import { redirect } from "react-router-dom"
import { deleteContact } from "~/lib/contacts.server"

export async function action({ params }: ActionFunctionArgs) {
    server$(async () => await deleteContact(parseInt(params.contactId!)))
    return redirect("/")
}

export function ErrorBoundary() {
    return <div>Oops! There was an error.</div>
}
