// Generated from packages/ui-extensions/src/app/OctonodeAppProvider/AppAccessScreen/AppAccessScreen.tsx. Do not edit; run the Octonode SDK sync.
import { useEffect, useState } from "react";
import { locales } from "../../../locales/index.js";
import { ACCESS_SCREEN_CSS, OCTONODE_LOGO } from "./constants.js";
import type { AppAccessScreenProps } from "./AppAccessScreen.types.js";

export function AppAccessScreen({ status }: AppAccessScreenProps) {
  const [language, setLanguage] = useState<keyof typeof locales>("en");
  useEffect(() => {
    const lang = (document.documentElement.lang || navigator.language).split("-")[0];
    if (Object.prototype.hasOwnProperty.call(locales, lang)) setLanguage(lang as keyof typeof locales);
  }, []);
  const t = locales[language];
  const connecting = status === "connecting";

  return (
    <div className={`octo-access octo-access-${status}`} lang={language}>
      <style>{ACCESS_SCREEN_CSS}</style>
      <header className="octo-access-header">
        <a className="octo-access-brand" href="https://octonodes.com" target="_blank" rel="noopener noreferrer">
          <img src={OCTONODE_LOGO} alt="" />
          octonode
        </a>
        <a
          className="octo-access-guide"
          href="https://playbook.octonodes.com/docs/apps"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.guide}
          <span aria-hidden="true">↗</span>
        </a>
      </header>
      <main className="octo-access-main">
        <section className="octo-access-copy" aria-labelledby="octo-access-title">
          <p className="octo-access-status" role={status === "expired" || status === "error" ? "alert" : "status"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              {connecting ? (
                <path d="M20 12a8 8 0 1 1-8-8" />
              ) : (
                <>
                  <rect x="6" y="10" width="12" height="10" rx="2" />
                  <path d="M9 10V7a3 3 0 0 1 6 0v3" />
                </>
              )}
            </svg>
            {t[`${status}Status`]}
          </p>
          <h1 id="octo-access-title">{t[`${status}Title`]}</h1>
          <p className="octo-access-description">{t[`${status}Description`]}</p>
          {!connecting && (
            <>
              <div className="octo-access-actions">
                {/* Native links keep this SDK usable without the host's design-system runtime. */}
                <a
                  className="octo-access-primary"
                  href="https://octonodes.com/studio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.open}
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="octo-access-secondary"
                  href="https://playbook.octonodes.com/docs/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.about}
                </a>
              </div>
              <p className="octo-access-hint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
                  <path d="m8 12 3 3 5-6" />
                </svg>
                {t.hint}
              </p>
            </>
          )}
        </section>
        <div className="octo-access-visual" aria-hidden="true">
          <div className="octo-access-orbit" />
          <div className="octo-access-workspace">
            <div className="octo-access-window">
              <i />
              <i />
              <i />
              <span>octonode / workspace</span>
              <b />
            </div>
            <div className="octo-access-body">
              <div className="octo-access-workspace-title">
                <img src={OCTONODE_LOGO} alt="" />
                {t.workspace}
              </div>
              <div className="octo-access-skeleton" />
              <div className="octo-access-flow">
                <div className="octo-access-node">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="3" width="7" height="7" rx="2" />
                    <rect x="3" y="14" width="7" height="7" rx="2" />
                    <rect x="14" y="14" width="7" height="7" rx="2" />
                  </svg>
                </div>
                <div className="octo-access-wire" />
                <div className="octo-access-node active">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m12 3 8 5v8l-8 5-8-5V8Z" />
                    <path d="m4 8 8 5 8-5M12 13v8" />
                  </svg>
                </div>
                <div className="octo-access-wire" />
                <div className="octo-access-node">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <ellipse cx="12" cy="5" rx="8" ry="3" />
                    <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
                  </svg>
                </div>
              </div>
              <div className="octo-access-placeholder">
                <i />
                <i />
              </div>
              <div className="octo-access-placeholder">
                <i />
                <i />
              </div>
            </div>
          </div>
          <div className="octo-access-lock">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5" y="10" width="14" height="11" rx="3" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
            </svg>
          </div>
          <p className="octo-access-caption">{t.caption}</p>
        </div>
      </main>
      <footer className="octo-access-footer">
        <p>{t.footer}</p>
        <a href="https://playbook.octonodes.com/docs/apps" target="_blank" rel="noopener noreferrer">
          {t.help}
        </a>
      </footer>
    </div>
  );
}
