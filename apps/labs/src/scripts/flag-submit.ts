import { createClient } from "@supabase/supabase-js";

const flagForm = document.querySelector<HTMLFormElement>("[data-flag-form]");
if (flagForm) {
  const apiUrl = flagForm.dataset.apiUrl ?? "";
  const supabaseUrl = flagForm.dataset.supabaseUrl ?? "";
  const supabaseKey = flagForm.dataset.supabaseKey ?? "";
  const authState = flagForm.querySelector<HTMLElement>("[data-auth-state]");
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  let session: { access_token: string } | null = null;
  let nickname = "";
  let feedbackTimer: number | undefined;
  const nicknameDialog = document.querySelector<HTMLDialogElement>("[data-nickname-dialog]");
  const nicknameForm = nicknameDialog?.querySelector<HTMLFormElement>("[data-nickname-form]");
  const nicknameInput = nicknameForm?.querySelector<HTMLInputElement>("[name=nickname]");
  let resolveNickname: ((value: string) => void) | undefined;
  const askNickname = () => new Promise<string>((resolve) => { resolveNickname = resolve; nicknameDialog?.showModal(); nicknameInput?.focus(); });
  nicknameForm?.addEventListener("submit", (event) => { event.preventDefault(); const value = nicknameInput?.value.trim() ?? ""; nicknameDialog?.close(); resolveNickname?.(value); });
  nicknameDialog?.addEventListener("cancel", () => resolveNickname?.(""));
  const messages: Record<string, string> = { auth_required: "Iniciá sesión para registrar el desafío.", bad_request: "Completá los datos del desafío y la flag.", bad_flag_format: "Usá el formato C4CKER{flag}, con 32 a 64 caracteres alfanuméricos dentro de las llaves.", wrong_flag: "La flag no coincide.", bad_stage: "Seleccioná una etapa válida.", stage_locked: "Completá las etapas anteriores primero.", already: "Este desafío ya está registrado.", nickname_taken: "Ese nombre ya está en uso. Elegí otro.", server_config: "El validador no está disponible.", db_error: "No se pudo registrar el desafío. Probá nuevamente.", rate_limited: "Llegaste al límite de intentos. Probá de nuevo en un minuto.", bad_nickname: "Usá hasta 32 caracteres: letras, números, espacios, guiones o puntos.", payload_too_large: "El formulario supera el tamaño permitido.", unsupported_media_type: "La solicitud tiene un formato no válido." };
  const showFeedback = (output: HTMLOutputElement, message: string, error = false) => { window.clearTimeout(feedbackTimer); output.textContent = message; output.dataset.state = error ? "error" : "success"; feedbackTimer = window.setTimeout(() => { output.textContent = ""; delete output.dataset.state; }, 5000); };
  const updateAuth = (nextSession: { access_token: string } | null) => { session = nextSession; if (authState) authState.textContent = session ? "Sesión iniciada. El ranking mostrará solo tu nickname público." : "Iniciá sesión para registrar tu solve."; };
  const openLoginDialog = () => window.dispatchEvent(new Event("c4cker:open-login"));
  flagForm.addEventListener("submit", async (event) => {
    event.preventDefault(); const formData = new FormData(flagForm); const flag = formData.get("flag"); const stage = formData.get("stage"); const output = flagForm.querySelector<HTMLOutputElement>("output"); if (typeof flag !== "string" || !flag.trim() || !output) return;
    const challenge = flagForm.dataset.challenge; if (!challenge) return; showFeedback(output, "Validando flag…");
    try {
      const request = (candidateNickname: string) => fetch(`${apiUrl}/submit-flag`, { method: "POST", headers: { "Content-Type": "application/json", ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) }, body: JSON.stringify({ slug: challenge, stage: typeof stage === "string" && stage ? stage : undefined, flag: flag.trim(), nickname: candidateNickname || undefined }) });
      let result = await request(nickname); let payload = await result.json();
      if (payload.error === "auth_required" && !session) { showFeedback(output, "Flag correcta. Iniciá sesión para registrarla."); openLoginDialog(); return; }
      if (payload.error === "needs_nickname") { const entered = await askNickname(); if (!entered.trim()) { showFeedback(output, "Elegí un nombre para registrar el desafío.", true); return; } nickname = entered.slice(0, 32); result = await request(nickname); payload = await result.json(); }
      if (!result.ok || !payload.ok) { showFeedback(output, messages[payload.error ?? ""] ?? "No se pudo verificar la flag.", true); return; }
      showFeedback(output, payload.already ? "Este desafío ya está registrado." : payload.ranked ? "Desafío completado. Sumaste un punto al ranking." : payload.completed ? "Desafío completado." : "Flag correcta. Etapa guardada."); flagForm.reset();
    } catch { showFeedback(output, "No se pudo conectar con el servicio de flags.", true); }
  });
  if (supabase) { const current = await supabase.auth.getSession(); updateAuth(current.data.session); supabase.auth.onAuthStateChange((_event, nextSession) => updateAuth(nextSession)); } else updateAuth(null);
}
