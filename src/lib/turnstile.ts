export async function verifyTurnstileToken(token: string): Promise<{ success: boolean; error?: any }> {
    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

    if (!secretKey) {
        console.error("CLOUDFLARE_TURNSTILE_SECRET_KEY is not defined");
        // Fail closed if configuration is missing for security
        return { success: false, error: "Missing secret key" };
    }

    try {
        const formData = new FormData();
        formData.append("secret", secretKey);
        formData.append("response", token);

        const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: formData,
        });

        const outcome = await result.json();

        if (!outcome.success) {
            console.error("Turnstile verification failed:", outcome);
            return { success: false, error: outcome };
        }

        return { success: true };
    } catch (error) {
        console.error("Error verifying Turnstile token:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}
