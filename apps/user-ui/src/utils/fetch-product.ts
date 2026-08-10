const normalizeEnv = (value?: string) =>
    value?.trim().replace(/^["']|["']$/g, "") ?? "";

export async function fetchProductBySlug(slug: string) {
    const baseUrl = normalizeEnv(process.env.NEXT_PUBLIC_SERVER_URI);

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_SERVER_URI is not configured");
    }

    const response = await fetch(`${baseUrl}/product/api/get-product/${slug}`, {
        next: { revalidate: 60 },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch product (${response.status})`);
    }

    const data = await response.json();
    return data.product ?? null;
}
