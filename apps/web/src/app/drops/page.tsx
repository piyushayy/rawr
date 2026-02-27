import { getActiveDrop } from "@/app/admin/drops/actions";
import { DropsClient } from "./DropsClient";

export default async function DropsPage() {
    const drop = await getActiveDrop();
    const nextDropDateString = drop ? new Date(drop.drop_date).toISOString() : new Date(Date.now() + 86400000 * 7).toISOString(); // Fallback 7 days

    return <DropsClient nextDropDateString={nextDropDateString} />;
}
