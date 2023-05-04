import fs from "node:fs"
import { Blob } from "node:buffer"

export interface FileInfo {
    /**
     * A blob with the file's info.
     */
    blob: Blob

    /**
     * Whether the file exists.
     */
    exists: boolean

    /**
     * Whether the file is a file. If `false`, it is a directory.
     */
    isFile: boolean

    /**
     * The mime type of the file, if it can be determined.
     * If it cannot be determined, it will be `undefined`.
     */
    mimeType?: string
}

function getMimeType({ type }: Blob) {
    const charsetIndex = type.indexOf(";charset")
    return charsetIndex !== -1 ? type.substring(0, charsetIndex) : type
}

/**
 * Returns information about a file.
 *
 * @param path The path to the file
 * @returns Information about the file
 */
export default async function getFileInfo(path: string) {
    let buffer = fs.readFileSync(path)
    let blob = new Blob([buffer])

    const info: FileInfo = {
        blob,
        exists: false,
        isFile: false,
    }

    try {
        await info.blob.arrayBuffer()
        info.exists = true
        info.isFile = true
        const mimeType = getMimeType(info.blob)
        info.mimeType = mimeType === "application/octet-stream" ? undefined : mimeType
    } catch (error) {
        if ((error as any).code) {
            switch ((error as any).code) {
                case "EISDIR":
                    info.exists = true
                    break
            }
        }
    }

    return info
}
