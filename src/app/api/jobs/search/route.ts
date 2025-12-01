import { NextResponse } from "next/server";

const CLIENT_ID = process.env.FT_CLIENT_ID;
const CLIENT_SECRET = process.env.FT_CLIENT_SECRET;

const AUTH_URL =
    "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire";

const API_BASE_URL = "https://api.francetravail.io/partenaire/rome-metiers";

const SCOPE = "api_rome-metiersv1 nomenclatureRome";

let accessToken: string | null = null;
let tokenExpiration: number = 0;

async function getAccessToken() {
    if (accessToken && Date.now() < tokenExpiration - 30000) {
        return accessToken;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error(
            "ERREUR CONFIG: FT_CLIENT_ID ou FT_CLIENT_SECRET manquant."
        );
        return null;
    }

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("scope", SCOPE);

    try {
        const response = await fetch(AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                "Erreur Auth France Travail:",
                response.status,
                errorText
            );
            return null;
        }

        const data = await response.json();
        accessToken = data.access_token;
        tokenExpiration = Date.now() + data.expires_in * 1000;

        return accessToken;
    } catch (error) {
        console.error("Erreur réseau Auth:", error);
        return null;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");

    if (!title || title.length < 2) {
        return NextResponse.json({ labelsAndRomes: [] });
    }

    try {
        const token = await getAccessToken();

        if (!token) {
            return NextResponse.json({ labelsAndRomes: [] });
        }

        const response = await fetch(
            `${API_BASE_URL}/v1/metiers/appellation/requete?q=${encodeURIComponent(
                title
            )}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error(
                "Erreur API ROME:",
                response.status,
                await response.text()
            );
            return NextResponse.json({ labelsAndRomes: [] });
        }

        const data = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const labelsAndRomes = (data.resultats || []).map((item: any) => ({
            label: item.libelle,
            romeId: item.metier?.code || item.code,
        }));

        return NextResponse.json({ labelsAndRomes });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", labelsAndRomes: [] },
            { status: 500 }
        );
    }
}
