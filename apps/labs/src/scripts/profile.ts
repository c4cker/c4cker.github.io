import { createClient, type Session } from "@supabase/supabase-js";

const form = document.querySelector<HTMLFormElement>("[data-profile-form]");
if (form) {
  const state = form.querySelector<HTMLElement>("[data-profile-state]");
  const loginNotice = document.querySelector<HTMLElement>("[data-profile-login]");
  const apiUrl = form.dataset.apiUrl ?? "";
  const supabaseUrl = form.dataset.supabaseUrl ?? "";
  const supabaseKey = form.dataset.supabaseKey ?? "";
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  const load = async (session: Session | null) => {
    form.hidden = !session;
    if (loginNotice) loginNotice.hidden = Boolean(session);
    if (!session || !state) return;
    const result = await fetch(`${apiUrl}/profile`, { headers: { Authorization: `Bearer ${session.access_token}` } });
    const payload = await result.json();
    if (!result.ok || !payload.ok) { state.textContent = "No se pudo cargar tu perfil."; return; }
    const input = form.elements.namedItem("publicNickname") as HTMLInputElement;
    input.value = payload.profile?.public_nickname ?? "";
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const session = (await supabase?.auth.getSession())?.data.session;
    const input = form.elements.namedItem("publicNickname") as HTMLInputElement;
    if (!session || !state) return;
    state.textContent = "Guardando cambios…";
    const result = await fetch(`${apiUrl}/profile`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ publicNickname: input.value.trim() }) });
    const payload = await result.json();
    state.textContent = result.ok && payload.ok ? "Cambios guardados." : payload.error === "nickname_taken" ? "Ese nombre ya está en uso. Elegí otro." : "No se pudieron guardar los cambios.";
  });
  if (supabase) { void supabase.auth.getSession().then(({ data }) => load(data.session)); supabase.auth.onAuthStateChange((_event, session) => void load(session)); }
}
