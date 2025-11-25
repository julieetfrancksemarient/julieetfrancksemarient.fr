// Shared configuration and DOM-safe behavior for index.html, infos.html and hebergement.html
const CONFIG = {
  couple: { bride: "Julie Derobert", groom: "Franck Marion" },
  dateISO: "2026-08-01T14:00:00+02:00",
  locations: {
    church: {
      name: "Église Notre-Dame d’Arlanc",
      time: "14:00",
      mapsUrl: "https://maps.google.com/?q=%C3%89glise%20Notre%20Dame%20d%27Arlanc"
    },
    venue: {
      name: "Château de la Reynerie",
      time: "17:00",
      address: "63580 Le Vernet-Chaméane",
      mapsUrl: "https://maps.google.com/?q=Ch%C3%A2teau%20de%20la%20Reynerie%2063580%20Le%20Vernet-Cham%C3%A9ane"
    }
  },
  contact: {
    phones: ["+33 6 13 75 47 27", "+33 6 51 44 84 71", "+33 6 01 19 42 66", "+33 6 24 60 81 17", "+33 6 35 78 22 45", "+33 6 10 73 85 33"],
    email: "julieetfrancksemarient@gmail.com"
  },
  rsvp: { to: "parentalexis62@gmail.com", subject: "RSVP – Mariage Julie & Franck" }
};

// Header + burger
const header = document.getElementById("siteHeader");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 4);
  window.addEventListener("scroll", onScroll); onScroll();
}
const hamb = document.getElementById("hamb");
const links = document.getElementById("links");
hamb?.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  hamb.setAttribute("aria-expanded", open ? "true" : "false");
});
links?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  document.body.classList.remove("nav-open");
  hamb?.setAttribute("aria-expanded", "false");
}));

// Text inject (HERO)
(function(){
  const dateObj = new Date(CONFIG.dateISO);
  const dateLong = dateObj.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const lines = document.getElementById("eventLines");
  if (lines) {
    lines.innerHTML = `
      <div class="line"><strong>Date :</strong> ${dateLong}</div>
      <div class="line"><strong>Cérémonie :</strong> ${CONFIG.locations.church.time} – ${CONFIG.locations.church.name}</div>
      <div class="line"><strong>Vin d’honneur :</strong> ${CONFIG.locations.venue.time} – ${CONFIG.locations.venue.name}</div>
      <div class="line"><strong>Adresse :</strong> ${CONFIG.locations.venue.address}</div>
    `;
  }
  const venueAddrEl = document.getElementById("venueAddr");
  if (venueAddrEl) venueAddrEl.textContent = CONFIG.locations.venue.address;
  const mapsBtnEl = document.getElementById("mapsBtn");
  if (mapsBtnEl) mapsBtnEl.href = CONFIG.locations.venue.mapsUrl;
  const mapsBtn2El = document.getElementById("mapsBtn2");
  if (mapsBtn2El) mapsBtn2El.href = CONFIG.locations.venue.mapsUrl;
  const mapsChurchEl = document.getElementById("mapsChurch");
  if (mapsChurchEl) mapsChurchEl.href = CONFIG.locations.church.mapsUrl;
})();

// Contacts (may be on infos.html)
(function(){
  const phone1El = document.getElementById("phone1");
  if (phone1El) phone1El.textContent = CONFIG.contact.phones[0] || "";
  const phone2El = document.getElementById("phone2");
  if (phone2El) phone2El.textContent = CONFIG.contact.phones[1] || "";
  const phone3El = document.getElementById("phone3");
  if (phone3El) phone3El.textContent = CONFIG.contact.phones[2] || "";
  const phone4El = document.getElementById("phone4");
  if (phone4El) phone4El.textContent = CONFIG.contact.phones[3] || "";
  const phone5El = document.getElementById("phone5");
  if (phone5El) phone5El.textContent = CONFIG.contact.phones[4] || "";
  const phone6El = document.getElementById("phone6");
  if (phone6El) phone6El.textContent = CONFIG.contact.phones[5] || "";
  const emailTxt = document.getElementById("emailTxt");
  if (emailTxt && CONFIG.contact.email) {
    emailTxt.textContent = CONFIG.contact.email;
    emailTxt.href = `mailto:${CONFIG.contact.email}`;
  } else if (emailTxt) {
    emailTxt.closest("p")?.removeChild(emailTxt);
  }
})();

// Footer
(function(){
  const footerTxtEl = document.getElementById("footerTxt");
  if (footerTxtEl) footerTxtEl.textContent = `${CONFIG.locations.venue.name} • ${CONFIG.locations.venue.address}`;
})();

// ===== Countdown =====
function parseDateISO(iso) {
  const d = new Date(iso);
  if (!isNaN(d)) return d;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?([+-]\d{2}:\d{2}|Z)?$/);
  if (!m) return new Date();
  const [ , Y, M, D, h, min, s = "00", tz = "Z"] = m;
  const base = Date.UTC(+Y, +M - 1, +D, +h, +min, +s);
  if (tz === "Z" || !tz) return new Date(base);
  const sign = tz.startsWith("-") ? -1 : 1;
  const [th, tm] = tz.slice(1).split(":").map(Number);
  const offsetMs = sign * (th * 60 + tm) * 60 * 1000;
  return new Date(base - offsetMs);
}
(function(){
  const elCount = document.getElementById("countdown");
  const d = document.getElementById("d");
  const h = document.getElementById("h");
  const m = document.getElementById("m");
  const s = document.getElementById("s");
  if (!elCount || !d || !h || !m || !s) return;
  const TARGET = parseDateISO(CONFIG.dateISO);
  function two(n){ return String(n).padStart(2,"0"); }
  function tick() {
    const now = Date.now();
    const total = TARGET.getTime() - now;
    elCount.hidden = false;
    if (total <= 0) { d.textContent = h.textContent = m.textContent = s.textContent = "00"; return; }
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const mins  = Math.floor((total / (1000 * 60)) % 60);
    const secs  = Math.floor((total / 1000) % 60);
    d.textContent = two(days); h.textContent = two(hours); m.textContent = two(mins); s.textContent = two(secs);
  }
  tick(); setInterval(tick, 1000);
})();

// RSVP (mailto with prefilled content)
(function(){
  const mailBtn = document.getElementById("mailtoRSVP");
  const mailFallback = document.getElementById("mailtoFallback");
  const subject = encodeURIComponent(CONFIG.rsvp.subject);
  const body = encodeURIComponent(
    "Merci d’indiquer :\n" +
    "- Présence ou absence\n" +
    "- Noms et prénoms des adultes\n" +
    "- Prénoms et âges des enfants\n" +
    "- Allergies ou régimes particuliers\n" +
    "- Message (optionnel)"
  );
  const mailHref = `mailto:${CONFIG.rsvp.to}?subject=${subject}&body=${body}`;
  if (mailBtn) mailBtn.href = mailHref;
  if (mailFallback){ mailFallback.textContent = CONFIG.rsvp.to; mailFallback.href = `mailto:${CONFIG.rsvp.to}`; }
})();

// Slider (flèches + drag + snap) — guarded so absent on infos/hebergement pages
(function(){
  const wrap = document.getElementById('sliderWrap');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  if (!wrap || !prev || !next) return;
  function step(){ return wrap.clientWidth; }
  function updateButtons(){
    prev.disabled = wrap.scrollLeft <= 0;
    const max = wrap.scrollWidth - wrap.clientWidth - 1;
    next.disabled = wrap.scrollLeft >= max;
  }
  prev.addEventListener('click', ()=>{ wrap.scrollBy({left:-step(), behavior:'smooth'}); setTimeout(updateButtons, 300); });
  next.addEventListener('click', ()=>{ wrap.scrollBy({left: step(), behavior:'smooth'}); setTimeout(updateButtons, 300); });
  wrap.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();
  let isDown=false, startX=0, startLeft=0;
  const start = (x)=>{ isDown=true; startX=x; startLeft=wrap.scrollLeft; wrap.style.scrollSnapType='none'; };
  const move = (x)=>{ if(!isDown) return; wrap.scrollLeft = startLeft - (x-startX); };
  const end = ()=>{ 
    if(!isDown) return; isDown=false;
    const w = step(); const target = Math.round(wrap.scrollLeft / w) * w;
    wrap.style.scrollSnapType='x mandatory';
    wrap.scrollTo({left: target, behavior:'smooth'}); setTimeout(updateButtons, 300);
  };
  wrap.addEventListener('mousedown', e=>start(e.clientX));
  window.addEventListener('mousemove', e=>move(e.clientX));
  window.addEventListener('mouseup', end);
  wrap.addEventListener('touchstart', e=>start(e.touches[0].clientX),{passive:true});
  wrap.addEventListener('touchmove', e=>move(e.touches[0].clientX),{passive:true});
  wrap.addEventListener('touchend', end);
})();

// RSVP form submit -> POST to form.action (supports Web3Forms)
(function(){
  const form = document.getElementById('rsvpForm');
  if (!form) return;
  const statusEl = document.getElementById('rsvpStatus');

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (form.dataset.sending === "1") return;
    form.dataset.sending = "1";
    statusEl.style.color = '';
    statusEl.textContent = "Envoi en cours…";

    // build payload; include any hidden inputs like access_key or subject if present
    const payload = {
      name: form.name?.value || "",
      email: form.email?.value || "",
      phone: form.phone?.value || "",
      attendance: form.attendance?.value || "",
      adults: form.adults?.value || "0",
      children: form.children?.value || "0",
      namesDetail: form['namesDetail']?.value || "",
      diet: form.diet?.value || "",
      message: form.message?.value || ""
    };

    // include hidden inputs if they exist (access_key, subject, any other fields)
    const accessKeyEl = form.querySelector('input[name="access_key"]');
    if (accessKeyEl) payload.access_key = accessKeyEl.value;

    const subjectEl = form.querySelector('input[name="subject"]');
    if (subjectEl) payload.subject = subjectEl.value;

    try {
      // endpoint = form.action (should be https://api.web3forms.com/submit for Web3Forms)
      const endpoint = form.action && form.action.trim() !== "" ? form.action : '/send';
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error('Erreur serveur');
      const json = await resp.json();
      if (json && (json.success || json.success === true)) {
        statusEl.style.color = 'green';
        statusEl.textContent = 'Merci — votre réponse a bien été envoyée.';
        form.reset();
      } else {
        // Web3Forms can return {success:false, message: "..."} or similar
        throw new Error(json?.error || json?.message || 'Envoi échoué');
      }
    } catch (err) {
      console.error(err);
      statusEl.style.color = 'crimson';
      statusEl.textContent = 'Une erreur est survenue lors de l’envoi. Vous pouvez écrire à julieetfrancksemarient@gmail.com';
    } finally {
      form.dataset.sending = "0";
    }
  });
})();

// --- Gestion des ajouts d'invités adultes ---
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("adultGuestsWrapper");
  const addBtn = document.getElementById("addAdultGuestBtn");

  if (!wrapper || !addBtn) return;

  let count = 1;      // 1 champ déjà présent
  const max = 6;      // 1 existant + 5 nouveaux

  addBtn.addEventListener("click", function () {
    if (count >= max) return;
    count++;

    // Crée le conteneur du champ
    const div = document.createElement("div");
    div.className = "adult-guest-field";
    div.style.position = "relative";
    div.style.marginTop = "6px";

    // Input
    const input = document.createElement("input");
    input.type = "text";
    input.name = "adult_guest[]";
    input.placeholder = "Prénom & nom";
    input.style.paddingRight = "28px"; // espace pour le bouton supprimer
    div.appendChild(input);

    // Bouton supprimer
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✕";
    removeBtn.style.position = "absolute";
    removeBtn.style.right = "4px";
    removeBtn.style.top = "50%";
    removeBtn.style.transform = "translateY(-50%)";
    removeBtn.style.background = "red";
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "22px";
    removeBtn.style.height = "22px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.display = "none"; // invisible par défaut
    removeBtn.style.fontSize = "14px";
    removeBtn.style.lineHeight = "18px";
    removeBtn.style.padding = "0";

    div.appendChild(removeBtn);

    // Affiche le bouton supprimer au survol
    div.addEventListener("mouseenter", () => removeBtn.style.display = "block");
    div.addEventListener("mouseleave", () => removeBtn.style.display = "none");

    // Supprimer le champ
    removeBtn.addEventListener("click", () => {
      wrapper.removeChild(div);
      count--;
      if (count < max) {
        addBtn.disabled = false;
        addBtn.textContent = "+ Ajouter un adulte";
      }
    });

    wrapper.appendChild(div);

    // Désactive le bouton ajouter si max atteint
    if (count >= max) {
      addBtn.disabled = true;
      addBtn.textContent = "Limite atteinte";
    }
  });
});

// --- Gestion des ajouts d'invités enfants ---
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("childGuestsWrapper");
  const addBtn = document.getElementById("addChildGuestBtn");

  if (!wrapper || !addBtn) return;

  let count = 1;      // 1 champ déjà présent
  const max = 6;      // 1 existant + 5 nouveaux

  addBtn.addEventListener("click", function () {
    if (count >= max) return;
    count++;

    // Crée le conteneur du champ
    const div = document.createElement("div");
    div.className = "child-guest-field";
    div.style.display = "flex";
    div.style.gap = "8px";
    div.style.alignItems = "center";
    div.style.position = "relative";
    div.style.marginTop = "6px";

    // Input Prénom & nom
    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.name = "child_guest_name[]";
    inputName.placeholder = "Prénom & nom";
    inputName.style.flex = "2";

    // Input Âge
    const inputAge = document.createElement("input");
    inputAge.type = "number";
    inputAge.name = "child_guest_age[]";
    inputAge.placeholder = "Âge le jour du mariage";
    inputAge.style.flex = "1";
    inputAge.max = 17;

    div.appendChild(inputName);
    div.appendChild(inputAge);

    // Bouton supprimer
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✕";
    removeBtn.style.position = "absolute";
    removeBtn.style.right = "4px";
    removeBtn.style.top = "50%";
    removeBtn.style.transform = "translateY(-50%)";
    removeBtn.style.background = "red";
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "22px";
    removeBtn.style.height = "22px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.display = "none";
    removeBtn.style.fontSize = "14px";
    removeBtn.style.lineHeight = "18px";
    removeBtn.style.padding = "0";

    div.appendChild(removeBtn);

    // Affiche le bouton supprimer au survol
    div.addEventListener("mouseenter", () => removeBtn.style.display = "block");
    div.addEventListener("mouseleave", () => removeBtn.style.display = "none");

    // Supprimer le champ
    removeBtn.addEventListener("click", () => {
      wrapper.removeChild(div);
      count--;
      if (count < max) {
        addBtn.disabled = false;
        addBtn.textContent = "+ Ajouter un enfant";
      }
    });

    wrapper.appendChild(div);

    // Désactive le bouton ajouter si max atteint
    if (count >= max) {
      addBtn.disabled = true;
      addBtn.textContent = "Limite atteinte";
    }
  });
});
