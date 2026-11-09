import type { Locale } from "@/i18n/config";

/**
 * The privacy policy, in both languages.
 *
 * Kept here rather than in messages/*.json: it is long-form legal prose with tables,
 * not UI strings, and the two versions are reviewed side by side. It describes what
 * the code actually does — if a tag, cookie or processor is added (GTM, next.config.ts
 * CSP, src/lib/consent.ts, src/lib/metaCapi.ts), this file changes in the same commit.
 *
 * Inline links use `[label](href)`; renderText() in the page turns them into anchors.
 * `{email}` is replaced with site.email.
 */

export const PRIVACY_UPDATED = "2026-11-09";

export type PrivacyBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] };

export interface PrivacySection {
  id: string;
  title: string;
  blocks: PrivacyBlock[];
}

export interface PrivacyContent {
  /** Small label above the title, e.g. the product a policy covers. */
  eyebrow?: string;
  title: string;
  lede: string;
  updatedLabel: string;
  controllerAddress: string;
  hostingLabel: string;
  sections: PrivacySection[];
}

const en: PrivacyContent = {
  title: "Privacy policy",
  lede: "What this site collects, why, who else sees it, how long it is kept, and how to make me delete it. Short version: on the site, nothing optional runs without your consent; if I emailed you a security report about your store, that outreach is tracked under legitimate interest and you can stop it in one click. I never sell data.",
  updatedLabel: "Last updated",
  controllerAddress: "Postal address",
  hostingLabel: "Hosting",
  sections: [
    {
      id: "controller",
      title: "Who is responsible",
      blocks: [
        {
          kind: "p",
          text: "The data controller is Akram Bakhouche, freelance software engineer, operating bak-dev.com. For anything about your data, write to [{email}](mailto:{email}).",
        },
      ],
    },
    {
      id: "what",
      title: "What I collect and why",
      blocks: [
        {
          kind: "table",
          head: ["Data", "Purpose", "Legal basis (GDPR)", "Kept for"],
          rows: [
            [
              "Contact form: name, email, message and the answers you pick (project type, budget, timeline, engagement, how you heard of me)",
              "Replying to your enquiry and preparing a proposal",
              "Steps taken at your request before a contract (Art. 6(1)(b))",
              "3 years after our last exchange, unless we sign a contract (then as long as accounting law requires)",
            ],
            [
              "IP address and time of a form submission",
              "Rate limiting and spam protection; written to the server log with your email",
              "Legitimate interest in keeping the form usable (Art. 6(1)(f))",
              "12 months",
            ],
            [
              "Audience measurement (Google Analytics, Microsoft Clarity): pages viewed, clicks on buttons, form steps, device and approximate location",
              "Understanding which pages bring in clients and where visitors drop off",
              "Your consent (Art. 6(1)(a))",
              "Cookies: 13 months. Reports in Google Analytics: 14 months",
            ],
            [
              "Advertising (Google Ads, Meta): the pages you visit and whether you sent an enquiry",
              "Measuring whether ads lead to enquiries, and showing ads to past visitors",
              "Your consent (Art. 6(1)(a))",
              "90 days in the cookies; the platforms apply their own retention",
            ],
            [
              "If you accepted advertising cookies and send the contact form: a one-way hash of your email, your IP address and browser type, sent from my server to Meta",
              "Counting the enquiry as an ad conversion even when a browser blocks the Meta tag",
              "Your consent (Art. 6(1)(a))",
              "Meta's own retention; I keep no copy beyond the enquiry itself",
            ],
          ],
        },
        {
          kind: "p",
          text: "The contact form's qualifying questions are optional in the sense that nothing breaks without them. There is no automated decision-making and no profiling that has legal or similar effects on you.",
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [
        {
          kind: "p",
          text: "Strictly necessary cookies are always on. Everything else waits for your choice in the cookie banner, and you can change it at any time with the “Cookie settings” link at the bottom of every page.",
        },
        {
          kind: "table",
          head: ["Cookie", "Set by", "What it does", "Lifetime", "Category"],
          rows: [
            ["locale", "bak-dev.com", "Remembers your language", "1 year", "Necessary"],
            ["consent", "bak-dev.com", "Remembers your cookie choice", "6 months", "Necessary"],
            ["lid", "bak-dev.com", "Only if you followed a link in a security report I emailed you: links your visit to that outreach (see “Outreach emails” below)", "180 days", "Outreach"],
            ["_ga, _ga_*", "Google Analytics", "Tells visits apart for statistics", "13 months", "Analytics"],
            ["_clck, _clsk", "Microsoft Clarity", "Groups the pages of one visit for usage statistics", "1 year / 1 day", "Analytics"],
            ["_gcl_au", "Google Ads", "Links an enquiry to the ad that led to it", "90 days", "Advertising"],
            ["_fbp, _fbc", "Meta", "Links an enquiry to a Meta ad; builds audiences of past visitors", "90 days", "Advertising"],
          ],
        },
        {
          kind: "p",
          text: "Your light/dark theme is stored in your browser's local storage, never sent to a server.",
        },
        {
          kind: "p",
          text: "If you refuse analytics and advertising, Google's tags still load in a restricted mode (Google Consent Mode): they set no cookies and send no identifiers, only a signal that a page was viewed without consent, which Google uses for aggregate statistics.",
        },
      ],
    },
    {
      id: "outreach",
      title: "Outreach emails and your store report",
      blocks: [
        {
          kind: "p",
          text: "If I found that your online store runs an out-of-date e-commerce platform, I may email you once with a short security report. That email, and the report, are tracked so I can tell genuine interest from an uninterested inbox and follow up accordingly:",
        },
        {
          kind: "list",
          items: [
            "The email contains a small invisible image (a “pixel”) that records when it is opened. Opens are an unreliable signal — some mail apps pre-load images — so I treat them lightly.",
            "The report link is personal to you. Opening it records the visit, and the report page is at an unguessable address, set to not be indexed by search engines.",
            "Viewing the report sets a `lid` cookie that links the rest of your visit to this site (pages viewed, a booking, an enquiry) to that outreach, so I can see whether the report led anywhere. On the server I may also connect this to Google Analytics under a random identifier, never your name or email.",
          ],
        },
        {
          kind: "p",
          text: "The legal basis is my legitimate interest in business-to-business prospecting (Art. 6(1)(f)): the report concerns a security issue on your business's public store, and I contact you only about that. You can object at any time — the “stop these emails” link in the report, or in the email, removes your report and stops everything with one click, and I keep no copy of the report afterwards.",
        },
        {
          kind: "p",
          text: "Engagement with the outreach (opens, link clicks, report views, pages seen) is kept for 13 months and then deleted. If you never open the email or the report, nothing of the above is set in your browser.",
        },
      ],
    },
    {
      id: "recipients",
      title: "Who else receives data",
      blocks: [
        {
          kind: "list",
          items: [
            "Google Ireland Ltd — Google Tag Manager, Google Analytics, Google Ads ([privacy policy](https://policies.google.com/privacy))",
            "Microsoft Ireland Operations Ltd — Microsoft Clarity ([privacy statement](https://privacy.microsoft.com/privacystatement))",
            "Meta Platforms Ireland Ltd — Meta Pixel and Conversions API ([privacy policy](https://www.facebook.com/privacy/policy/))",
            "Calendly LLC and Zoom Communications — only if you book a call: the booking page and the video call run on their services, under their own policies ([Calendly](https://calendly.com/legal/privacy-notice), [Zoom](https://www.zoom.com/en/trust/privacy/privacy-statement/))",
          ],
        },
        {
          kind: "p",
          text: "Enquiries are delivered to my own mailbox on the same server that hosts the site; no third-party form or email service sees them. I do not sell, rent or share your data with anyone else.",
        },
      ],
    },
    {
      id: "transfers",
      title: "Transfers outside the EU",
      blocks: [
        {
          kind: "p",
          text: "Google, Microsoft and Meta may process data in the United States. Each is certified under the EU–US Data Privacy Framework, which the European Commission recognises as providing adequate protection, and also relies on the Commission's standard contractual clauses.",
        },
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      blocks: [
        {
          kind: "p",
          text: "You can ask to access, correct or delete your data, to restrict or object to its use, or to receive it in a portable format. Where processing relies on consent, you can withdraw it at any time without affecting what happened before.",
        },
        {
          kind: "p",
          text: "Write to [{email}](mailto:{email}). I answer within one month. If you are not satisfied, you can complain to your data protection authority — in France, the [CNIL](https://www.cnil.fr/fr/plaintes).",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes",
      blocks: [
        {
          kind: "p",
          text: "When this policy changes, the date at the top changes with it. If the change adds a new kind of tracking, the cookie banner asks you again.",
        },
      ],
    },
  ],
};

const fr: PrivacyContent = {
  title: "Politique de confidentialité",
  lede: "Ce que ce site collecte, pourquoi, qui d'autre y a accès, combien de temps c'est conservé, et comment me demander de l'effacer. En bref : sur le site, rien d'optionnel ne fonctionne sans votre accord ; si je vous ai envoyé par e-mail un rapport de sécurité sur votre boutique, cette prise de contact est suivie au titre de l'intérêt légitime et vous pouvez l'arrêter en un clic. Je ne vends aucune donnée.",
  updatedLabel: "Dernière mise à jour",
  controllerAddress: "Adresse postale",
  hostingLabel: "Hébergement",
  sections: [
    {
      id: "controller",
      title: "Responsable du traitement",
      blocks: [
        {
          kind: "p",
          text: "Le responsable du traitement est Akram Bakhouche, ingénieur logiciel indépendant, éditeur de bak-dev.com. Pour toute question sur vos données : [{email}](mailto:{email}).",
        },
      ],
    },
    {
      id: "what",
      title: "Données collectées et finalités",
      blocks: [
        {
          kind: "table",
          head: ["Données", "Finalité", "Base légale (RGPD)", "Durée de conservation"],
          rows: [
            [
              "Formulaire de contact : nom, e-mail, message et vos réponses (type de projet, budget, délai, mode de collaboration, comment vous m'avez connu)",
              "Répondre à votre demande et préparer une proposition",
              "Mesures précontractuelles prises à votre demande (art. 6.1.b)",
              "3 ans après notre dernier échange, sauf contrat signé (puis la durée imposée par les obligations comptables)",
            ],
            [
              "Adresse IP et heure d'envoi du formulaire",
              "Limitation du nombre d'envois et lutte contre le spam ; inscrites avec votre e-mail dans le journal du serveur",
              "Intérêt légitime à garder le formulaire utilisable (art. 6.1.f)",
              "12 mois",
            ],
            [
              "Mesure d'audience (Google Analytics, Microsoft Clarity) : pages vues, clics sur les boutons, étapes du formulaire, appareil et localisation approximative",
              "Savoir quelles pages amènent des clients et où les visiteurs décrochent",
              "Votre consentement (art. 6.1.a)",
              "Cookies : 13 mois. Rapports dans Google Analytics : 14 mois",
            ],
            [
              "Publicité (Google Ads, Meta) : pages visitées et envoi éventuel d'une demande",
              "Mesurer si les annonces mènent à des demandes, et diffuser des annonces aux anciens visiteurs",
              "Votre consentement (art. 6.1.a)",
              "90 jours dans les cookies ; les plateformes appliquent leur propre durée",
            ],
            [
              "Si vous avez accepté les cookies publicitaires et envoyez le formulaire : une empreinte irréversible (hachage) de votre e-mail, votre adresse IP et votre navigateur, envoyés par mon serveur à Meta",
              "Compter la demande comme conversion publicitaire même si le navigateur bloque la balise Meta",
              "Votre consentement (art. 6.1.a)",
              "Durée propre à Meta ; je n'en conserve aucune copie au-delà de la demande elle-même",
            ],
          ],
        },
        {
          kind: "p",
          text: "Aucune décision automatisée ni aucun profilage produisant des effets juridiques ou similaires à votre égard n'est mis en œuvre.",
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [
        {
          kind: "p",
          text: "Les cookies strictement nécessaires sont toujours actifs. Tous les autres attendent votre choix dans le bandeau cookies, que vous pouvez modifier à tout moment via le lien « Gestion des cookies » en bas de chaque page.",
        },
        {
          kind: "table",
          head: ["Cookie", "Déposé par", "Rôle", "Durée", "Catégorie"],
          rows: [
            ["locale", "bak-dev.com", "Mémorise votre langue", "1 an", "Nécessaire"],
            ["consent", "bak-dev.com", "Mémorise votre choix sur les cookies", "6 mois", "Nécessaire"],
            ["lid", "bak-dev.com", "Uniquement si vous avez suivi un lien dans un rapport de sécurité que je vous ai envoyé : relie votre visite à cette prise de contact (voir « E-mails de prospection » ci-dessous)", "180 jours", "Prospection"],
            ["_ga, _ga_*", "Google Analytics", "Distingue les visites pour les statistiques", "13 mois", "Mesure d'audience"],
            ["_clck, _clsk", "Microsoft Clarity", "Regroupe les pages d'une visite pour les statistiques d'usage", "1 an / 1 jour", "Mesure d'audience"],
            ["_gcl_au", "Google Ads", "Relie une demande à l'annonce qui l'a amenée", "90 jours", "Publicité"],
            ["_fbp, _fbc", "Meta", "Relie une demande à une annonce Meta ; constitue des audiences d'anciens visiteurs", "90 jours", "Publicité"],
          ],
        },
        {
          kind: "p",
          text: "Votre thème clair/sombre est enregistré dans le stockage local de votre navigateur et n'est jamais envoyé à un serveur.",
        },
        {
          kind: "p",
          text: "Si vous refusez la mesure d'audience et la publicité, les balises Google se chargent tout de même en mode restreint (Google Consent Mode) : elles ne déposent aucun cookie et n'envoient aucun identifiant, seulement un signal indiquant qu'une page a été vue sans consentement, que Google utilise pour des statistiques agrégées.",
        },
      ],
    },
    {
      id: "outreach",
      title: "E-mails de prospection et rapport sur votre boutique",
      blocks: [
        {
          kind: "p",
          text: "Si j'ai constaté que votre boutique en ligne tourne sur une plateforme e-commerce obsolète, il se peut que je vous écrive une fois avec un bref rapport de sécurité. Cet e-mail, et le rapport, sont suivis afin que je puisse distinguer un réel intérêt d'une boîte mail indifférente et relancer en conséquence :",
        },
        {
          kind: "list",
          items: [
            "L'e-mail contient une petite image invisible (un « pixel ») qui enregistre son ouverture. Les ouvertures sont un signal peu fiable — certaines messageries préchargent les images — je les traite donc avec prudence.",
            "Le lien du rapport vous est propre. Son ouverture enregistre la visite, et la page du rapport se trouve à une adresse non devinable, configurée pour ne pas être indexée par les moteurs de recherche.",
            "Consulter le rapport dépose un cookie `lid` qui relie le reste de votre visite sur ce site (pages vues, réservation, demande) à cette prise de contact, afin de voir si le rapport a abouti. Côté serveur, je peux aussi le rattacher à Google Analytics sous un identifiant aléatoire, jamais votre nom ni votre e-mail.",
          ],
        },
        {
          kind: "p",
          text: "La base légale est mon intérêt légitime à la prospection entre professionnels (art. 6(1)(f)) : le rapport porte sur un problème de sécurité de la boutique publique de votre entreprise, et je ne vous contacte qu'à ce sujet. Vous pouvez vous y opposer à tout moment — le lien « ne plus recevoir ces e-mails » dans le rapport, ou dans l'e-mail, supprime votre rapport et arrête tout en un clic, et je n'en garde ensuite aucune copie.",
        },
        {
          kind: "p",
          text: "L'engagement avec la prospection (ouvertures, clics, consultations du rapport, pages vues) est conservé 13 mois puis supprimé. Si vous n'ouvrez jamais l'e-mail ni le rapport, rien de ce qui précède n'est déposé dans votre navigateur.",
        },
      ],
    },
    {
      id: "recipients",
      title: "Destinataires",
      blocks: [
        {
          kind: "list",
          items: [
            "Google Ireland Ltd — Google Tag Manager, Google Analytics, Google Ads ([règles de confidentialité](https://policies.google.com/privacy?hl=fr))",
            "Microsoft Ireland Operations Ltd — Microsoft Clarity ([déclaration de confidentialité](https://privacy.microsoft.com/fr-fr/privacystatement))",
            "Meta Platforms Ireland Ltd — Meta Pixel et API Conversions ([politique de confidentialité](https://www.facebook.com/privacy/policy/))",
            "Calendly LLC et Zoom Communications — uniquement si vous réservez un appel : la page de réservation et l'appel vidéo passent par leurs services, sous leurs propres politiques ([Calendly](https://calendly.com/legal/privacy-notice), [Zoom](https://www.zoom.com/en/trust/privacy/privacy-statement/))",
          ],
        },
        {
          kind: "p",
          text: "Les demandes sont livrées dans ma propre boîte mail, sur le serveur qui héberge le site ; aucun service tiers de formulaire ou d'e-mail n'y a accès. Je ne vends, ne loue ni ne partage vos données avec personne d'autre.",
        },
      ],
    },
    {
      id: "transfers",
      title: "Transferts hors de l'UE",
      blocks: [
        {
          kind: "p",
          text: "Google, Microsoft et Meta peuvent traiter des données aux États-Unis. Chacun est certifié au titre du Data Privacy Framework UE–États-Unis, reconnu par la Commission européenne comme offrant une protection adéquate, et s'appuie également sur les clauses contractuelles types de la Commission.",
        },
      ],
    },
    {
      id: "rights",
      title: "Vos droits",
      blocks: [
        {
          kind: "p",
          text: "Vous pouvez demander l'accès à vos données, leur rectification ou leur effacement, la limitation ou l'opposition à leur traitement, ou leur portabilité. Lorsque le traitement repose sur votre consentement, vous pouvez le retirer à tout moment, sans effet sur ce qui a eu lieu avant.",
        },
        {
          kind: "p",
          text: "Écrivez à [{email}](mailto:{email}). Je réponds sous un mois. Si ma réponse ne vous satisfait pas, vous pouvez saisir la [CNIL](https://www.cnil.fr/fr/plaintes) ou l'autorité de protection des données de votre pays.",
        },
      ],
    },
    {
      id: "changes",
      title: "Modifications",
      blocks: [
        {
          kind: "p",
          text: "Quand cette politique change, la date en haut de page change aussi. Si le changement ajoute un nouveau type de suivi, le bandeau cookies vous redemande votre accord.",
        },
      ],
    },
  ],
};

export const PRIVACY: Record<Locale, PrivacyContent> = { en, fr };
