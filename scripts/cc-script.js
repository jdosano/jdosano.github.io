const consentBtn = document.getElementById('gc-button');
const consentOutput = document.getElementById('consent-output');
const jurisdictionBtn = document.getElementById('jurisdiction-btn');
const jurisdictionOutput = document.getElementById('jurisdiction-output');
const localeBtn = document.getElementById('locale-btn');
const localeOutput = document.getElementById('locale-output');

const consentString = function () {
    const currentConsent = JSON.stringify(window.Osano.cm.getConsent());
    consentOutput.innerText = currentConsent.replaceAll(",",'\n---');
}

const getJurisdiction = function () {
    jurisdictionOutput.innerText = window.Osano.cm.jurisdiction;
}

const getLocale = function () {
    localeOutput.innerText = window.Osano.cm.locale;
}

consentBtn.addEventListener('click', consentString);
jurisdictionBtn.addEventListener('click', getJurisdiction);
localeBtn.addEventListener('click', getLocale);

