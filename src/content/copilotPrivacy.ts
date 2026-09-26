import type { Locale } from "@/i18n/config";
import type { PrivacyContent } from "@/content/privacy";

/**
 * The privacy policy of Social Media CoPilot, the publishing app I operate — the URL
 * registered with LinkedIn, Meta and X as the app's privacy policy.
 *
 * Separate from src/content/privacy.ts, which covers this website. It describes what
 * the Social-Media-CoPilot repo actually does: the scopes in
 * packages/shared/src/permissions.ts, token encryption in packages/providers/src/crypto.ts,
 * and disconnect deleting the account's data in accounts.service.ts. When the app starts
 * requesting a new permission or sending data somewhere new, this file changes first.
 *
 * Same conventions as privacy.ts: `[label](href)` links, `{email}` → site.email.
 */

export const COPILOT_PRIVACY_UPDATED = "2026-09-26";

const en: PrivacyContent = {
  eyebrow: "Social Media CoPilot",
  title: "App privacy policy",
  lede: "What the Social Media CoPilot app receives when you connect a LinkedIn, Facebook, Instagram or X account, what it does with it, who else sees it, how long it is kept, and how to have it deleted. Short version: it acts only on what people asked it to do, and it never sells data or uses it to profile anyone.",
  updatedLabel: "Last updated",
  controllerAddress: "Postal address",
  hostingLabel: "Hosting",
  sections: [
    {
      id: "about",
      title: "What the app is",
      blocks: [
        {
          kind: "p",
          text: "Social Media CoPilot is a publishing and engagement tool I build and operate. It connects to LinkedIn, Facebook, Instagram and X through their official APIs so that I, and the businesses I work with, can schedule and publish posts, answer the comments and messages those posts receive, and see how they perform.",
        },
        {
          kind: "p",
          text: "It is not open to the public and has no sign-up: I create every account myself, for my own brands and for clients under a service agreement. This page covers the app only. The website bak-dev.com has its own [privacy policy](/privacy).",
        },
      ],
    },
    {
      id: "controller",
      title: "Who is responsible",
      blocks: [
        {
          kind: "p",
          text: "The app is operated by Akram Bakhouche, freelance software engineer (bak-dev.com), who is responsible for the data it processes. When I run it for a client, I use that client's accounts only on their instructions. For anything about your data, write to [{email}](mailto:{email}).",
        },
      ],
    },
    {
      id: "linkedin",
      title: "LinkedIn data",
      blocks: [
        {
          kind: "p",
          text: "You connect a LinkedIn account by signing in on LinkedIn's own consent screen, which lists every permission the app asks for. The app never sees your LinkedIn password. Depending on the features in use, it receives:",
        },
        {
          kind: "table",
          head: ["LinkedIn permission", "What the app receives", "What it is used for"],
          rows: [
            [
              "Sign In with LinkedIn using OpenID Connect (openid, profile, email)",
              "Your name, profile photo, LinkedIn member ID and email address",
              "Knowing which LinkedIn account is connected, and labelling it in the dashboard",
            ],
            [
              "Share on LinkedIn (w_member_social)",
              "Only the ID of each post the app creates",
              "Publishing the posts you wrote or approved to your profile, at the time you chose",
            ],
            [
              "Community Management API (r_organization_admin, w_organization_social, r_organization_social)",
              "The LinkedIn Pages you administer (name, logo, ID), the posts on them, and their comments, reactions and statistics",
              "Publishing to the Pages you choose, showing how posts perform, and reading and answering comments from the dashboard",
            ],
            [
              "All of the above",
              "An access token, and a refresh token when LinkedIn issues one",
              "Making the calls above on your behalf. Tokens are encrypted before they are stored",
            ],
          ],
        },
        {
          kind: "p",
          text: "The app does not ask for, and never receives, your connections, your feed, your private messages, or any member's profile other than yours. What it never does with LinkedIn data:",
        },
        {
          kind: "list",
          items: [
            "Post on its own initiative. It publishes only what you wrote or approved, or what a tool you explicitly authorised for that account sent it.",
            "Sell, rent, license or hand it to anyone, including advertisers and data brokers.",
            "Use it for advertising, to profile or track LinkedIn members, or to build lead lists.",
            "Combine it with data from other sources, or use it to train AI models.",
            "Reach LinkedIn any other way than through its official API, within LinkedIn's [API Terms of Use](https://www.linkedin.com/legal/l/api-terms-of-use).",
          ],
        },
      ],
    },
    {
      id: "other-platforms",
      title: "Facebook, Instagram and X data",
      blocks: [
        {
          kind: "p",
          text: "The same rules apply to the other platforms. When you connect them, the app receives:",
        },
        {
          kind: "list",
          items: [
            "Facebook: the Pages you manage (name, ID), permission to publish on them, and the comments, reactions and Messenger conversations they receive. If you connect an ad account: the ads it runs and the comments on them. The app creates an ad only from a proposal a person approved, and the ad starts paused until a person activates it.",
            "Instagram: the professional account linked to your Page, its posts and statistics, and the comments, mentions and direct messages it receives.",
            "X: your handle and user ID, the replies and mentions your posts receive, and your direct messages.",
          ],
        },
        {
          kind: "p",
          text: "Each platform's own privacy policy applies to what you publish there: [LinkedIn](https://www.linkedin.com/legal/privacy-policy), [Meta](https://www.facebook.com/privacy/policy/), [X](https://x.com/en/privacy).",
        },
      ],
    },
    {
      id: "third-parties",
      title: "If you comment on or message a connected account",
      blocks: [
        {
          kind: "p",
          text: "If you comment on, react to, mention or message a Page or account managed with the app, the app receives what the platform sends about that interaction: your public name, username or ID, profile picture, what you wrote, and when. Only the people who manage that Page or account see it, so they can answer you. It is used for nothing else, and it is deleted with the account's data as described below.",
        },
      ],
    },
    {
      id: "purposes",
      title: "Why data is processed",
      blocks: [
        {
          kind: "table",
          head: ["Purpose", "Legal basis (GDPR)"],
          rows: [
            [
              "Publishing, showing statistics and answering comments for the accounts you connect",
              "Performing the service you asked for (Art. 6(1)(b))",
            ],
            [
              "Handling comments and messages from people who contact a connected account",
              "The account owner's legitimate interest in answering them (Art. 6(1)(f))",
            ],
            [
              "Keeping the app secure: access logs, rate limits, and a log of who did what",
              "Legitimate interest in protecting the service and your accounts (Art. 6(1)(f))",
            ],
          ],
        },
        {
          kind: "p",
          text: "There is no automated decision-making with legal or similar effects on anyone, and no data is sent to an AI service. If that changes, this page changes before the app does.",
        },
      ],
    },
    {
      id: "security",
      title: "Where data is stored and how it is protected",
      blocks: [
        {
          kind: "list",
          items: [
            "Everything is stored in a database on a server I operate myself. No third-party cloud, analytics or advertising service stores or reads it.",
            "The app is reachable only over HTTPS, at api.bak-dev.com.",
            "Access and refresh tokens are encrypted with AES-256-GCM before they are stored, and decrypted only in memory, for the call that needs them.",
            "Only people I give an account to can sign in, and each of them sees only the accounts of their own organisation.",
            "Images and videos uploaded for a post are stored on the same server, at an unguessable address the platforms fetch when they publish.",
          ],
        },
      ],
    },
    {
      id: "retention",
      title: "How long data is kept",
      blocks: [
        {
          kind: "table",
          head: ["Data", "Kept until"],
          rows: [
            [
              "Tokens and the connected account's profile",
              "You disconnect the account. They are deleted at once",
            ],
            [
              "Posts published to an account, and the comments, messages and statistics it received",
              "You disconnect the account. They are deleted at once, with it",
            ],
            ["Everything held for a client", "30 days after our service agreement ends"],
            ["Server access logs (IP address, time, request)", "90 days"],
            [
              "Database backups",
              "30 days. A deleted record disappears from backups when they expire",
            ],
          ],
        },
      ],
    },
    {
      id: "deletion",
      title: "Disconnecting and deleting your data",
      blocks: [
        {
          kind: "p",
          text: "You can remove the app's access, and your data, at any time:",
        },
        {
          kind: "list",
          items: [
            "In the app: Accounts → Disconnect. The token and everything tied to that account are deleted immediately.",
            "On the platform: revoke the app in LinkedIn's [permitted services](https://www.linkedin.com/mypreferences/d/permitted-services), Facebook's [business integrations](https://www.facebook.com/settings/?tab=business_tools) or X's [connected apps](https://x.com/settings/connected_apps). The stored token stops working at once; to have the rest deleted too, email me.",
            "By email: write to [{email}](mailto:{email}) and say which account it is. Everything is deleted within 30 days, and I confirm when it is done.",
          ],
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
            "The platforms you publish to receive what you publish, under their own policies.",
            "The client a Page or account belongs to, and the people they authorise, see that account's data. No client sees another client's data.",
            "The company that hosts my server, as a technical provider only.",
          ],
        },
        {
          kind: "p",
          text: "No one else. I do not sell, rent or share the data, and no third-party analytics, advertising or AI service is built into the app. I would disclose data only if the law required it.",
        },
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      blocks: [
        {
          kind: "p",
          text: "You can ask to access, correct or delete your data, to restrict or object to its use, or to receive it in a portable format. Write to [{email}](mailto:{email}). I answer within one month. If you are not satisfied, you can complain to your data protection authority — in France, the [CNIL](https://www.cnil.fr/fr/plaintes).",
        },
      ],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        {
          kind: "p",
          text: "The app is a business tool and is not meant for anyone under 16.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes",
      blocks: [
        {
          kind: "p",
          text: "When this policy changes, the date at the top changes with it. If a change widens what the app does with your data, the people who use it hear about it before it takes effect.",
        },
      ],
    },
  ],
};

const fr: PrivacyContent = {
  eyebrow: "Social Media CoPilot",
  title: "Politique de confidentialité de l'application",
  lede: "Ce que l'application Social Media CoPilot reçoit quand vous connectez un compte LinkedIn, Facebook, Instagram ou X, ce qu'elle en fait, qui d'autre y a accès, combien de temps c'est conservé, et comment le faire effacer. En bref : elle n'agit que sur demande, et elle ne vend aucune donnée ni ne s'en sert pour profiler qui que ce soit.",
  updatedLabel: "Dernière mise à jour",
  controllerAddress: "Adresse postale",
  hostingLabel: "Hébergement",
  sections: [
    {
      id: "about",
      title: "L'application",
      blocks: [
        {
          kind: "p",
          text: "Social Media CoPilot est un outil de publication et d'animation de comptes que je développe et exploite. Il se connecte à LinkedIn, Facebook, Instagram et X via leurs API officielles, pour que moi-même et les entreprises avec lesquelles je travaille puissions programmer et publier des posts, répondre aux commentaires et messages qu'ils reçoivent, et suivre leurs performances.",
        },
        {
          kind: "p",
          text: "Elle n'est pas ouverte au public et n'a pas d'inscription : je crée chaque compte moi-même, pour mes propres marques et pour des clients sous contrat de service. Cette page ne concerne que l'application. Le site bak-dev.com a sa propre [politique de confidentialité](/fr/privacy).",
        },
      ],
    },
    {
      id: "controller",
      title: "Responsable du traitement",
      blocks: [
        {
          kind: "p",
          text: "L'application est exploitée par Akram Bakhouche, ingénieur logiciel indépendant (bak-dev.com), responsable des données qu'elle traite. Quand je la fais fonctionner pour un client, je n'utilise ses comptes que selon ses instructions. Pour toute question sur vos données : [{email}](mailto:{email}).",
        },
      ],
    },
    {
      id: "linkedin",
      title: "Données LinkedIn",
      blocks: [
        {
          kind: "p",
          text: "Vous connectez un compte LinkedIn en vous identifiant sur l'écran de consentement de LinkedIn lui-même, qui liste chaque autorisation demandée par l'application. L'application ne voit jamais votre mot de passe LinkedIn. Selon les fonctionnalités utilisées, elle reçoit :",
        },
        {
          kind: "table",
          head: ["Autorisation LinkedIn", "Ce que l'application reçoit", "À quoi elle sert"],
          rows: [
            [
              "Sign In with LinkedIn using OpenID Connect (openid, profile, email)",
              "Votre nom, votre photo de profil, votre identifiant de membre LinkedIn et votre adresse e-mail",
              "Savoir quel compte LinkedIn est connecté, et l'identifier dans le tableau de bord",
            ],
            [
              "Share on LinkedIn (w_member_social)",
              "Uniquement l'identifiant de chaque post créé par l'application",
              "Publier sur votre profil les posts que vous avez rédigés ou validés, au moment choisi",
            ],
            [
              "Community Management API (r_organization_admin, w_organization_social, r_organization_social)",
              "Les pages LinkedIn que vous administrez (nom, logo, identifiant), leurs posts, ainsi que leurs commentaires, réactions et statistiques",
              "Publier sur les pages que vous choisissez, afficher les performances des posts, lire les commentaires et y répondre depuis le tableau de bord",
            ],
            [
              "Toutes les autorisations ci-dessus",
              "Un jeton d'accès, et un jeton de rafraîchissement quand LinkedIn en délivre un",
              "Effectuer les appels ci-dessus en votre nom. Les jetons sont chiffrés avant d'être enregistrés",
            ],
          ],
        },
        {
          kind: "p",
          text: "L'application ne demande pas et ne reçoit jamais vos relations, votre fil d'actualité, vos messages privés, ni le profil d'un autre membre que vous. Ce qu'elle ne fait jamais des données LinkedIn :",
        },
        {
          kind: "list",
          items: [
            "Publier de sa propre initiative. Elle ne publie que ce que vous avez rédigé ou validé, ou ce qu'un outil que vous avez expressément autorisé sur ce compte lui a transmis.",
            "Les vendre, les louer, les céder sous licence ou les transmettre à quiconque, annonceurs et courtiers en données compris.",
            "S'en servir pour de la publicité, pour profiler ou suivre des membres LinkedIn, ou pour constituer des fichiers de prospects.",
            "Les croiser avec des données d'autres sources, ou s'en servir pour entraîner des modèles d'IA.",
            "Accéder à LinkedIn autrement que par son API officielle, dans le respect de ses [conditions d'utilisation de l'API](https://www.linkedin.com/legal/l/api-terms-of-use).",
          ],
        },
      ],
    },
    {
      id: "other-platforms",
      title: "Données Facebook, Instagram et X",
      blocks: [
        {
          kind: "p",
          text: "Les mêmes règles s'appliquent aux autres plateformes. Quand vous les connectez, l'application reçoit :",
        },
        {
          kind: "list",
          items: [
            "Facebook : les pages que vous gérez (nom, identifiant), l'autorisation d'y publier, et les commentaires, réactions et conversations Messenger qu'elles reçoivent. Si vous connectez un compte publicitaire : les publicités qu'il diffuse et les commentaires qu'elles reçoivent. L'application ne crée une publicité qu'à partir d'une proposition validée par une personne, et la publicité reste en pause jusqu'à ce qu'une personne l'active.",
            "Instagram : le compte professionnel lié à votre page, ses posts et statistiques, ainsi que les commentaires, mentions et messages privés qu'il reçoit.",
            "X : votre nom d'utilisateur et votre identifiant, les réponses et mentions que reçoivent vos posts, et vos messages privés.",
          ],
        },
        {
          kind: "p",
          text: "La politique de confidentialité de chaque plateforme s'applique à ce que vous y publiez : [LinkedIn](https://fr.linkedin.com/legal/privacy-policy), [Meta](https://www.facebook.com/privacy/policy/), [X](https://x.com/fr/privacy).",
        },
      ],
    },
    {
      id: "third-parties",
      title: "Si vous commentez ou écrivez à un compte connecté",
      blocks: [
        {
          kind: "p",
          text: "Si vous commentez, réagissez, mentionnez ou envoyez un message à une page ou un compte géré avec l'application, celle-ci reçoit ce que la plateforme transmet sur cette interaction : votre nom public, nom d'utilisateur ou identifiant, votre photo de profil, ce que vous avez écrit, et quand. Seules les personnes qui gèrent cette page ou ce compte le voient, pour pouvoir vous répondre. Rien d'autre n'en est fait, et ces données sont effacées avec celles du compte, comme décrit plus bas.",
        },
      ],
    },
    {
      id: "purposes",
      title: "Finalités et bases légales",
      blocks: [
        {
          kind: "table",
          head: ["Finalité", "Base légale (RGPD)"],
          rows: [
            [
              "Publier, afficher les statistiques et répondre aux commentaires pour les comptes que vous connectez",
              "Exécution du service que vous avez demandé (art. 6.1.b)",
            ],
            [
              "Traiter les commentaires et messages des personnes qui s'adressent à un compte connecté",
              "Intérêt légitime du titulaire du compte à leur répondre (art. 6.1.f)",
            ],
            [
              "Sécuriser l'application : journaux d'accès, limitation du nombre de requêtes, journal de qui a fait quoi",
              "Intérêt légitime à protéger le service et vos comptes (art. 6.1.f)",
            ],
          ],
        },
        {
          kind: "p",
          text: "Aucune décision automatisée produisant des effets juridiques ou similaires n'est prise, et aucune donnée n'est envoyée à un service d'IA. Si cela change, cette page change avant l'application.",
        },
      ],
    },
    {
      id: "security",
      title: "Stockage et sécurité",
      blocks: [
        {
          kind: "list",
          items: [
            "Tout est stocké dans une base de données sur un serveur que j'exploite moi-même. Aucun service tiers de cloud, de mesure d'audience ou de publicité ne les stocke ni ne les lit.",
            "L'application n'est accessible qu'en HTTPS, à l'adresse api.bak-dev.com.",
            "Les jetons d'accès et de rafraîchissement sont chiffrés en AES-256-GCM avant d'être enregistrés, et ne sont déchiffrés qu'en mémoire, pour l'appel qui en a besoin.",
            "Seules les personnes à qui je crée un compte peuvent se connecter, et chacune ne voit que les comptes de sa propre organisation.",
            "Les images et vidéos téléversées pour un post sont stockées sur le même serveur, à une adresse impossible à deviner, que les plateformes consultent au moment de publier.",
          ],
        },
      ],
    },
    {
      id: "retention",
      title: "Durées de conservation",
      blocks: [
        {
          kind: "table",
          head: ["Données", "Conservées jusqu'à"],
          rows: [
            [
              "Jetons et profil du compte connecté",
              "La déconnexion du compte. Ils sont alors effacés immédiatement",
            ],
            [
              "Posts publiés sur un compte, et commentaires, messages et statistiques qu'il a reçus",
              "La déconnexion du compte. Ils sont alors effacés immédiatement, avec lui",
            ],
            ["Tout ce qui est conservé pour un client", "30 jours après la fin de notre contrat de service"],
            ["Journaux d'accès du serveur (adresse IP, heure, requête)", "90 jours"],
            [
              "Sauvegardes de la base de données",
              "30 jours. Une donnée effacée disparaît des sauvegardes à leur expiration",
            ],
          ],
        },
      ],
    },
    {
      id: "deletion",
      title: "Déconnecter un compte et effacer vos données",
      blocks: [
        {
          kind: "p",
          text: "Vous pouvez retirer l'accès de l'application, et vos données, à tout moment :",
        },
        {
          kind: "list",
          items: [
            "Dans l'application : Comptes → Déconnecter. Le jeton et tout ce qui est lié à ce compte sont effacés immédiatement.",
            "Sur la plateforme : révoquez l'application dans les [services autorisés](https://www.linkedin.com/mypreferences/d/permitted-services) de LinkedIn, les [intégrations professionnelles](https://www.facebook.com/settings/?tab=business_tools) de Facebook ou les [applications connectées](https://x.com/settings/connected_apps) de X. Le jeton enregistré cesse aussitôt de fonctionner ; pour faire effacer le reste, écrivez-moi.",
            "Par e-mail : écrivez à [{email}](mailto:{email}) en précisant le compte concerné. Tout est effacé sous 30 jours, et je vous confirme quand c'est fait.",
          ],
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
            "Les plateformes sur lesquelles vous publiez reçoivent ce que vous y publiez, sous leurs propres politiques.",
            "Le client à qui appartient une page ou un compte, et les personnes qu'il autorise, voient les données de ce compte. Aucun client ne voit les données d'un autre.",
            "La société qui héberge mon serveur, en tant que simple prestataire technique.",
          ],
        },
        {
          kind: "p",
          text: "Personne d'autre. Je ne vends, ne loue ni ne partage ces données, et aucun service tiers de mesure d'audience, de publicité ou d'IA n'est intégré à l'application. Je ne communiquerais de données que si la loi l'exigeait.",
        },
      ],
    },
    {
      id: "rights",
      title: "Vos droits",
      blocks: [
        {
          kind: "p",
          text: "Vous pouvez demander l'accès à vos données, leur rectification ou leur effacement, la limitation ou l'opposition à leur traitement, ou leur portabilité. Écrivez à [{email}](mailto:{email}). Je réponds sous un mois. Si ma réponse ne vous satisfait pas, vous pouvez saisir la [CNIL](https://www.cnil.fr/fr/plaintes) ou l'autorité de protection des données de votre pays.",
        },
      ],
    },
    {
      id: "children",
      title: "Mineurs",
      blocks: [
        {
          kind: "p",
          text: "L'application est un outil professionnel et ne s'adresse pas aux moins de 16 ans.",
        },
      ],
    },
    {
      id: "changes",
      title: "Modifications",
      blocks: [
        {
          kind: "p",
          text: "Quand cette politique change, la date en haut de page change aussi. Si un changement élargit ce que l'application fait de vos données, ses utilisateurs en sont informés avant qu'il ne prenne effet.",
        },
      ],
    },
  ],
};

export const COPILOT_PRIVACY: Record<Locale, PrivacyContent> = { en, fr };
