export async function verifyTurnstileToken(token?: string): Promise<boolean> {
  if (!token) {
    console.warn("Turnstile validation failed: No token provided");
    return false;
  }

  // Cloudflare test keys auto-pass
  if (token === "1x00000000000000000000AA" || token.includes("XXXX.DUMMY.")) {
    return true;
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn(
      "System WARNING: Missing TURNSTILE_SECRET_KEY in Environment. Bot protection bypassed.",
    );
    return true; // Soft fail for development
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      },
    );

    const outcome = await res.json();
    if (!outcome.success) {
      console.warn(
        "Turnstile Verification hard failure:",
        outcome["error-codes"],
      );
    }
    return outcome.success;
  } catch (error) {
    console.error("Network error during Turnstile verify:", error);
    return false;
  }
}
