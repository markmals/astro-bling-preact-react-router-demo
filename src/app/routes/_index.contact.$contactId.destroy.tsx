import { ActionFunctionArgs, redirect } from "react-router-dom"
import { deleteContact } from "~/lib/contacts"

export async function action({ params }: ActionFunctionArgs) {
    await deleteContact(params.contactId!)
    return redirect("/")
}

export function ErrorBoundary() {
    return <div>Oops! There was an error.</div>
}
