import { databases } from "@/backend/configs/configs";
import { Query } from "appwrite";


export async function getFile(fileId: string) {
    const results = await databases.listDocuments(
        `${import.meta.env.VITE_DATABASES_MAIN}`,
        `${import.meta.env.VITE_COLL_DISP}`,
        [
            Query.equal('fileId', `${fileId}`)
        ]
    ).then((res) => {
        return res.documents[0];
    }).catch((err) => {
        return err && false
    })

    return results
}
