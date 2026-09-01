import { createClient, type Session } from "@supabase/supabase-js";

const widget = document.querySelector<HTMLElement>("[data-auth-ui]");
if (widget) {
  const supabaseUrl = widget.dataset.supabaseUrl ?? "";
  const supabaseKey = widget.dataset.supabaseKey ?? "";
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  const maxAge = 24 * 60 * 60 * 1000;
  const sessionStartedKey = "c4cker.session.started-at";
  const login = widget.querySelector<HTMLButtonElement>("[data-auth-login]");
  const toggle = widget.querySelector<HTMLButtonElement>("[data-auth-toggle]");
  const menu = widget.querySelector<HTMLElement>("[data-auth-menu]");
  const logout = widget.querySelector<HTMLButtonElement>("[data-auth-logout]");
  const dialog = document.querySelector<HTMLDialogElement>("[data-login-dialog]");
  const continueButton = dialog?.querySelector<HTMLButtonElement>("[data-login-continue]");
  const cancelButton = dialog?.querySelector<HTMLButtonElement>("[data-login-cancel]");

  const isExpired = () => {
    const started = Number(localStorage.getItem(sessionStartedKey));
    return Number.isFinite(started) && started > 0 && Date.now() - started >= maxAge;
  };
  const update = (session: Session | null) => {
    if (session && !localStorage.getItem(sessionStartedKey)) localStorage.setItem(sessionStartedKey, String(Date.now()));
    if (!session) localStorage.removeItem(sessionStartedKey);
    login?.toggleAttribute("hidden", Boolean(session));
    document.querySelectorAll<HTMLButtonElement>("[data-login]").forEach((button) => button.toggleAttribute("hidden", Boolean(session)));
    toggle?.toggleAttribute("hidden", !session);
    if (toggle) toggle.textContent = session ? "Mi cuenta" : "";
    window.dispatchEvent(new CustomEvent("c4cker:auth", { detail: { session } }));
  };
  const signIn = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: window.location.href } });
    if (error) dialog?.querySelector<HTMLElement>("[data-login-error]")?.replaceChildren("No se pudo iniciar sesión. Intentá nuevamente.");
  };
  const openLogin = () => { if (dialog?.showModal) dialog.showModal(); else void signIn(); };
  window.addEventListener("c4cker:open-login", openLogin);
  login?.addEventListener("click", openLogin);
  document.querySelectorAll<HTMLButtonElement>("[data-login]").forEach((button) => button.addEventListener("click", openLogin));
  continueButton?.addEventListener("click", () => { dialog?.close(); void signIn(); });
  cancelButton?.addEventListener("click", () => dialog?.close());
  toggle?.addEventListener("click", () => { const hidden = menu?.hasAttribute("hidden") ?? true; menu?.toggleAttribute("hidden", !hidden); toggle?.setAttribute("aria-expanded", String(hidden)); });
  logout?.addEventListener("click", async () => { await supabase?.auth.signOut(); menu?.setAttribute("hidden", ""); });
  void (async () => {
    if (!supabase) { update(null); return; }
    const current = await supabase.auth.getSession();
    if (current.data.session && isExpired()) await supabase.auth.signOut();
    else update(current.data.session);
    supabase.auth.onAuthStateChange((_event, session) => update(session));
  })();
}
