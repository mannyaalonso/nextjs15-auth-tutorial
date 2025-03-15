import { NavigationClient } from "./navigation-client"
import { getUser } from "@/queries/user";

export async function NavigationServer() {
    const user = await getUser();

    return (
        <NavigationClient user={user} />
    )
}