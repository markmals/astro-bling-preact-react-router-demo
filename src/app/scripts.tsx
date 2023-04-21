export function Scripts() {
    // const manifest = useContext(manifestContext)
    // return import.meta.env.DEV ? (
    //     <>
    //         <script type="module" src="/@vite/client"></script>
    //         <script type="module" src="/src/app/entry-client.tsx"></script>
    //     </>
    // ) : (
    //     <script type="module" src={manifest["entry-client"]}></script>
    // )

    // Always assume dev for now
    return (
        <>
            <script type="module" src="/@vite/client"></script>
            <script type="module" src="/src/app/entry-client.tsx"></script>
        </>
    )
}
