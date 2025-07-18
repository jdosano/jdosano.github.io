import { createWrapper, resolveWhen } from '@segment/analytics-consent-tools';
export const withOsano = createWrapper({
shouldLoadWrapper: async () => {
await resolveWhen(() => {
return window.Osano && window.Osano.cm !== undefined;
}, 500);
},
shouldLoadSegment: async (ctx) => {
await resolveWhen(() => {
return window.Osano && window.Osano.cm && typeof window.Osano.cm.getConsent ===
'function';
}, 500);
return new Promise((resolve) => {
let resolved = false;
const resolveOnce = (consentModel) => {
if (!resolved) {
resolved = true;
resolve(ctx.load({ consentModel }));
}
};
const existingConsent = window.Osano.cm.getConsent();
if (existingConsent) {
resolveOnce('opt-in');
return;
}
const onConsentSaved = (consent) => {
if (consent) {
const isLikelyOptOut = consent.ESSENTIAL ===
'ACCEPT' && consent.ANALYTICS ===
'ACCEPT' && consent.MARKETING ===
'ACCEPT' && consent.PERSONALIZATION ===
'ACCEPT';
resolveOnce(isLikelyOptOut ? 'opt-out' : 'opt-in');
}
const onInitialized = (consent) => {
if (consent) {
resolveOnce('opt-in');
};
}
};
window.Osano.cm.addEventListener('osano-cm-consent-saved'
, onConsentSaved);
window.Osano.cm.addEventListener('osano-cm-initialized'
, onInitialized);
setTimeout(() => {
resolveOnce('opt-in');
}, 10000);
});
},
getCategories: () => {
const consent = window.Osano.cm?.getConsent?.();
if (!consent) {
return {
analytics: false,
marketing: false,
personalization: false,
essential: true,
storage: false,
'opt-out': false
};
}
return normalizeOsanoConsent(consent);
},
registerOnConsentChanged: (setCategories) => {
window.Osano.cm.addEventListener('osano-cm-consent-saved'
, (consent) => {
if (consent) {
setCategories(normalizeOsanoConsent(consent));
}
});
window.Osano.cm.addEventListener('osano-cm-consent-changed'
, () => {
const currentConsent = window.Osano.cm.getConsent();
if (currentConsent) {
setCategories(normalizeOsanoConsent(currentConsent));
}
});
window.Osano.cm.addEventListener('osano-cm-analytics'
, () => {
const consent = window.Osano.cm.getConsent();
if (consent) {
setCategories(normalizeOsanoConsent(consent));
}
});
window.Osano.cm.addEventListener('osano-cm-marketing'
, () => {
const consent = window.Osano.cm.getConsent();
if (consent) {
setCategories(normalizeOsanoConsent(consent));
}
});
window.Osano.cm.addEventListener('osano-cm-personalization'
, () => {
const consent = window.Osano.cm.getConsent();
if (consent) {
setCategories(normalizeOsanoConsent(consent));
}
});
window.Osano.cm.addEventListener('osano-cm-storage'
, () => {
const consent = window.Osano.cm.getConsent();
if (consent) {
setCategories(normalizeOsanoConsent(consent));
}
});
},
});
function normalizeOsanoConsent(osanoConsent) {
if (!osanoConsent) {
return {
analytics: false,
marketing: false,
personalization: false,
essential: true,
storage: false,
'opt-out': false
};
}
return {
analytics: osanoConsent.ANALYTICS ===
marketing: osanoConsent.MARKETING ===
'ACCEPT'
,
'ACCEPT'
,
personalization: osanoConsent.PERSONALIZATION ===
essential: osanoConsent.ESSENTIAL ===
'ACCEPT'
,
storage: osanoConsent.STORAGE ===
'ACCEPT'
,
'opt-out': osanoConsent['OPT-OUT'] ===
'ACCEPT'
'ACCEPT'
,
};
}
export function setupOsanoPreload() {
(function (w, o, d) {
w[o] = w[o] || function () {
w[o][d].push(arguments);
};
w[o][d] = w[o][d] || [];
})(window,
'Osano'
,
'data');
window.Osano('onInitialized'
, (consent) => {
console.log('Osano initialized with consent:'
, consent);
});
window.Osano('onConsentSaved'
, (consent) => {
console.log('Osano consent saved:'
, consent);
});
