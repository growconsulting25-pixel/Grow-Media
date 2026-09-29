import type { Dictionary } from "./index";
import app from "./fr-app";

/**
 * Français (Canada). Rédigé comme langue principale — pas une traduction
 * littérale de l'anglais.
 */
const fr: Dictionary = {
  meta: {
    title: "Vidéos immobilières professionnelles — sans tournage",
    description:
      "Transformez les photos de vos inscriptions en vidéos cinématographiques à votre image pour Instagram, Facebook, TikTok et YouTube Shorts. Livrées en environ 24 h. Première vidéo gratuite.",
    ogAlt: "Une photo de propriété transformée en vidéo verticale pour les réseaux sociaux",
  },

  common: {
    skipToContent: "Aller au contenu",
    freeVideoCta: "Créer ma première vidéo gratuitement",
    tryFree: "Essayer gratuitement",
    watchExample: "Voir un exemple",
    learnMore: "En savoir plus",
    talkToUs: "Parlons-en",
    close: "Fermer",
    next: "Continuer",
    back: "Retour",
    startingAt: "À partir de",
    perVideo: "/ vidéo",
    perMonth: "/ mois",
    noCard: "Aucune carte de crédit requise.",
    demoBadge: "Contenu de démonstration",
    trustLine: ["Aucune carte requise", "Livraison en 24 h", "Prête à publier"],
    new: "Nouveau",
  },

  nav: {
    label: "Navigation principale",
    home: "Accueil",
    howItWorks: "Comment ça marche",
    examples: "Exemples",
    services: "Services",
    pricing: "Tarifs",
    faq: "FAQ",
    login: "Connexion",
    cta: "Première vidéo gratuite",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    language: "Langue",
  },

  hero: {
    offerPill: "Offre de lancement — votre première vidéo est gratuite",
    headline: [
      { text: "Des vidéos immobilières professionnelles." },
      { text: "Sans ", accent: "tournage." },
    ],
    supporting: "Transformez vos photos immobilières en vidéos qui captent l'attention.",
    description:
      "Envoyez-nous les photos de votre propriété. Nous les transformons en vidéos professionnelles, cinématographiques et adaptées à votre image — prêtes à publier en environ 24 heures.",
    visual: {
      label: "Les photos de votre inscription deviennent une vidéo verticale pour les réseaux sociaux",
      inputLabel: "Photos de l'inscription",
      processing: "En production",
      output: "Prête à publier",
      tags: ["Mouvement", "Votre image de marque", "Sous-titres", "Musique", "9:16"],
      reel: {
        handle: "@votreagence",
        price: "489 900 $",
        caption: "Nouvelle inscription · 3 ch. · 2 sdb",
        cta: "Réserver une visite privée",
        audio: "Son original · Cinématique",
        agent: "Votre nom · Votre agence",
      },
    },
  },

  transform: {
    eyebrow: "Photo → Vidéo",
    headline: [
      { text: "De photos statiques à du contenu" },
      { text: "qui capte ", accent: "l'attention." },
    ],
    description:
      "Les mêmes photos. Un tout autre résultat. Glissez le curseur pour comparer une inscription standard avec ce que nous livrons.",
    before: "Avant",
    after: "Après",
    beforeCaption: "Photo d'inscription standard",
    afterCaption: "Vidéo prête pour les réseaux",
    sliderLabel: "Comparer avant et après",
    transformButton: "Transformer",
    resetButton: "Réinitialiser",
    added: "Ce que nous ajoutons",
    addedItems: ["Mouvement", "Transitions", "Musique", "Sous-titres", "Image de marque", "Formats sociaux"],
    listing: {
      price: "489 900 $",
      address: "1234, rue Exemple",
      specs: "3 ch. · 2 sdb · 1 650 pi²",
      status: "À vendre",
    },
    compare: {
      title: "Ce que ça coûte habituellement",
      traditionalLabel: "Tournage vidéo traditionnel",
      traditionalValue: "Souvent 1 000 $ et +",
      traditionalNote: "Vidéaste, planification, tournage sur place, montage.",
      oursLabel: "Vidéo d'inscription {brand}",
      oursValue: "Dès {price}",
      oursNote: "Vos photos existantes. Livraison en environ 24 h.",
      footnote:
        "Les coûts de production traditionnelle varient beaucoup selon le marché, le fournisseur et l'envergure du projet. Les montants présentés sont une fourchette typique à titre indicatif, et non une soumission.",
    },
  },

  examples: {
    eyebrow: "Exemples",
    headline: [{ text: "Voyez le résultat ", accent: "en mouvement." }],
    description:
      "De vraies vidéos réalisées à partir de contenus d'inscription. Appuyez sur lecture — chaque vidéo ne se charge que lorsque vous le demandez.",
    playLabel: "Lire la vidéo : {title}",
    items: {
      one: { title: "Vidéo cinématographique", meta: "Vidéo d'inscription" },
      two: { title: "Mise en valeur de la propriété", meta: "Vidéo d'inscription" },
      three: { title: "Aperçu pour les réseaux", meta: "Vidéo d'inscription" },
    },
    modalTitle: "Vidéo exemple",
  },

  how: {
    eyebrow: "Comment ça marche",
    headline: [{ text: "Trois étapes. ", accent: "C'est tout." }],
    description: "Pas de journée de tournage, pas de logistique, pas de logiciel de montage. Juste votre inscription.",
    steps: {
      upload: {
        number: "01",
        label: "Téléversez",
        title: "Envoyez-nous votre inscription.",
        description:
          "Photos de la propriété, votre photo, votre logo, les détails de l'inscription — et des extraits vidéo si vous en avez.",
        address: "1234, rue Exemple",
        uploaded: "{count} photos téléversées",
        dropHint: "Glissez-déposez photos, logo, extraits vidéo",
        items: ["Photos de la propriété", "Photo du courtier", "Logo", "Détails de l'inscription", "Vidéo (facultatif)"],
      },
      customize: {
        number: "02",
        label: "Personnalisez",
        title: "Choisissez le style. Ou laissez-nous nous en occuper.",
        description: "Un style en un clic, une note si vous le souhaitez. On s'occupe du reste.",
        styles: ["Luxe", "Cinématique", "Moderne", "Dynamique", "Épuré", "Surprenez-moi"],
        briefLabel: "Consignes créatives (facultatif)",
        briefExample: "Élégant, moderne et haut de gamme.",
      },
      receive: {
        number: "03",
        label: "Recevez et publiez",
        title: "Prête dès le lendemain.",
        description: "Téléchargez, demandez une retouche ou partagez — au bon format pour chaque plateforme.",
        checklist: ["Vidéo prête", "Texte de publication prêt", "Format social 9:16", "Image de marque appliquée"],
        actions: { download: "Télécharger", revise: "Demander une retouche", share: "Partager" },
      },
    },
  },

  content: {
    eyebrow: "Moteur de contenu",
    headline: [{ text: "Une propriété." }, { text: "Une multitude de ", accent: "contenus." }],
    description: "Déclinez la même inscription en contenus pour chaque étape de votre marketing.",
    sponsored: "Commandité",
    tablistLabel: "Formats de contenu",
    formats: {
      reel: {
        label: "Reel d'inscription",
        format: "9:16 · 20–30 s",
        description: "Le classique : une visite verticale rapide et cinématographique pour Reels et Shorts.",
        overlay: "Nouvelle inscription",
      },
      cinematic: {
        label: "Vidéo cinématographique",
        format: "16:9 · 45–60 s",
        description: "Un film grand format pour votre site Web, YouTube et vos présentations vendeurs.",
        overlay: "Bienvenue chez vous",
      },
      ugc: {
        label: "UGC IA du courtier",
        format: "9:16 · 15–30 s",
        description: "Vous, qui présentez la propriété — à partir de votre image et de contenus que vous avez approuvés.",
        overlay: "« Suivez-moi pour la visite »",
      },
      facebookAd: {
        label: "Publicité Facebook",
        format: "4:5 · 15 s",
        description: "Une création publicitaire avec une accroche claire et un appel à l'action.",
        overlay: "Visite libre samedi",
      },
      story: {
        label: "Story Instagram",
        format: "9:16 · 10 s",
        description: "De courts aperçus qui gardent votre inscription bien en vue.",
        overlay: "Glissez pour la cuisine",
      },
      teaser: {
        label: "Aperçu de propriété",
        format: "1:1 · 8 s",
        description: "Un avant-goût « bientôt disponible » avant la mise en marché.",
        overlay: "Bientôt disponible",
      },
      walkthrough: {
        label: "Visite virtuelle",
        format: "3D · interactive",
        description: "Un espace immersif que les acheteurs explorent à distance, pièce par pièce.",
        overlay: "Explorer en 3D",
      },
      shortAd: {
        label: "Publicité courte",
        format: "9:16 · 6 s",
        description: "Des publicités percutantes pour TikTok, Reels et YouTube.",
        overlay: "3 ch. · Grande cour",
      },
    },
  },

  benefits: {
    eyebrow: "Pourquoi les courtiers l'adoptent",
    headline: [
      { text: "Pensé pour les courtiers qui veulent plus de contenu —" },
      { text: "sans plus de ", accent: "travail." },
    ],
    items: {
      more: {
        title: "Plus de contenu",
        description: "Une inscription, plusieurs contenus marketing — reels, stories, publicités et plus.",
      },
      fast: {
        title: "Livraison rapide",
        description: "Votre contenu livré en environ 24 heures. Aucun tournage à planifier.",
        timeline: ["Envoi", "Production", "Prête"],
      },
      ready: {
        title: "Prête à publier",
        description: "Sous-titres, formats et image de marque inclus.",
      },
      cost: {
        title: "Coûts de production réduits",
        description: "Du contenu professionnel sans organiser un tournage complet.",
      },
      consistent: {
        title: "Publiez régulièrement",
        description: "Restez présent, même pendant vos semaines les plus chargées.",
        days: ["L", "M", "M", "J", "V", "S", "D"],
      },
      brand: {
        title: "Votre image",
        description: "Logo, couleurs, nom et coordonnées intégrés à chaque vidéo.",
      },
      social: {
        title: "Pensé pour les réseaux",
        description: "Conçu pour Reels, Shorts, TikTok et la publicité sociale.",
      },
      scale: {
        title: "À grande échelle",
        description: "Une propriété ou tout un portefeuille — même qualité, même simplicité.",
        listings: "{count} inscriptions",
      },
    },
  },

  services: {
    eyebrow: "Services",
    headline: [{ text: "Bien plus que des ", accent: "vidéos immobilières." }],
    description: "Un seul partenaire pour le contenu dont vos inscriptions et votre marque personnelle ont besoin.",
    quote: "Sur soumission",
    items: {
      listing: {
        title: "Vidéo d'inscription IA",
        description:
          "Vos photos d'inscription deviennent des vidéos cinématographiques avec musique, sous-titres et votre image de marque.",
        cta: "Créer une vidéo",
        points: ["Vertical et grand format", "Musique et sous-titres", "Livraison en environ 24 h"],
      },
      walkthrough: {
        title: "Visite virtuelle 3D",
        description:
          "Une expérience numérique immersive qui permet aux acheteurs d'explorer la propriété à distance.",
        cta: "En savoir plus",
        points: ["Exploration pièce par pièce", "Lien à partager", "S'ajoute à toute inscription"],
      },
      ugc: {
        title: "UGC IA",
        description:
          "Des vidéos au style natif des réseaux, avec vous en vedette — créées à partir de votre image et de contenus approuvés.",
        cta: "En savoir plus",
        points: ["Présentation du courtier", "Promotion de propriétés", "Contenu éducatif"],
      },
      ads: {
        title: "Publicités vidéo IA",
        description: "Des créations vidéo conçues pour vos campagnes Meta, Instagram, Facebook et TikTok.",
        cta: "Parlons-en",
        points: ["Accroche dès la 1re seconde", "Plusieurs variantes", "Planifiées avec vous"],
      },
    },
  },

  pricing: {
    eyebrow: "Tarifs",
    headline: [{ text: "Du contenu adapté à ", accent: "votre rythme." }],
    description: "Des forfaits simples. Des limites claires. Aucuns frais cachés.",
    offer: {
      badge: "Offre de lancement limitée",
      title: "Votre première vidéo est gratuite.",
      note: "Aucune carte de crédit requise.",
    },
    billedMonthly: "Forfaits mensuels · annulables en tout temps",
    mostPopular: "Le plus populaire",
    videosPerMonth: "{count} vidéos par mois",
    oneVideo: "1 vidéo d'inscription professionnelle",
    plans: {
      single: {
        name: "À l'unité",
        tagline: "Pour une inscription ponctuelle.",
        cta: "Créer une vidéo",
        features: [
          "1 vidéo d'inscription professionnelle",
          "Sous-titres",
          "Musique",
          "Image de marque",
          "Formats sociaux",
          "Livraison en environ 24 h",
        ],
      },
      agent: {
        name: "Courtier",
        tagline: "Pour les courtiers qui inscrivent chaque mois.",
        cta: "Choisir Courtier",
        features: [
          "4 vidéos par mois",
          "Vidéos d'inscription professionnelles",
          "Sous-titres et musique",
          "Votre image de marque",
          "Formats sociaux",
          "Plateforme client et historique des projets",
          "Livraison du contenu",
          "Idées de contenu",
        ],
      },
      pro: {
        name: "Pro",
        tagline: "Pour les courtiers et équipes à fort volume.",
        cta: "Choisir Pro",
        features: [
          "Tout le forfait Courtier",
          "Jusqu'à 10 vidéos par mois",
          "Production prioritaire",
          "Options de contenu avancées",
          "Accès complet à la plateforme",
        ],
      },
    },
    addOnsTitle: "Options",
    addOns: {
      walkthrough: { name: "Visite virtuelle 3D", price: "+{price}" },
      ads: { name: "Publicités IA sur mesure", price: "Parlons-en" },
    },
    limitsNote: "Les vidéos non utilisées ne sont pas reportées. Besoin de plus de 10 par mois? Parlons-en.",
  },

  results: {
    eyebrow: "Résultats",
    headline: [{ text: "Créé pour l'immobilier." }, { text: "Pensé pour des résultats ", accent: "concrets." }],
    description: "Chaque projet est suivi de l'envoi à la livraison — voici à quoi ça ressemble.",
    photos: "{count} photos",
    video: "Vidéo de {count} s",
    delivered: "Livrée en {count} h",
    metrics: { views: "Vues", likes: "J'aime", shares: "Partages", saves: "Enregistrements" },
    demoNotice:
      "Aperçu de mise en page avec contenu fictif. De vrais témoignages de clients remplaceront ces cartes.",
    empty: {
      title: "Soyez parmi nos premiers courtiers en vedette.",
      description:
        "Nous recueillons les témoignages de nos clients de lancement. Créez votre première vidéo gratuitement — et si vous l'aimez, nous serions ravis de la présenter ici.",
    },
    demo: [
      {
        quote:
          "Citation fictive — les mots du courtier au sujet de sa première vidéo livrée apparaîtront ici.",
        name: "Courtier démo",
        role: "Nom de l'agence",
        property: "Propriété exemple",
      },
      {
        quote:
          "Citation fictive — une phrase courte et précise sur la rapidité, la qualité ou les résultats.",
        name: "Courtier démo",
        role: "Nom de l'agence",
        property: "Condo exemple",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    headline: [{ text: "Vos questions, ", accent: "nos réponses." }],
    stillQuestions: "Une autre question?",
    contact: "Écrivez-nous",
    items: [
      {
        q: "Comment ça fonctionne?",
        a: "Créez un projet, téléversez les photos de votre inscription et choisissez un style. Notre équipe réalise votre vidéo grâce à un montage professionnel et à des mouvements assistés par IA, puis la dépose dans votre compte — généralement en environ 24 heures.",
      },
      {
        q: "Que dois-je vous envoyer?",
        a: "Les photos de votre inscription (idéalement de 10 à 25, en haute résolution). Au besoin : votre photo, votre logo, les détails de l'inscription et vos extraits vidéo. Si votre identité visuelle est enregistrée, elle est appliquée automatiquement.",
      },
      {
        q: "Dans quel délai vais-je recevoir ma vidéo?",
        a: "La plupart des vidéos sont livrées environ 24 heures après l'envoi du projet. Le délai peut être plus long en période de pointe ou pour les demandes complexes — vous voyez toujours l'état du projet en temps réel dans votre tableau de bord.",
      },
      {
        q: "Puis-je demander des modifications?",
        a: "Oui. Chaque vidéo comprend une ronde de retouches. Indiquez-nous ce que vous souhaitez modifier directement dans le projet, et on s'en occupe.",
      },
      {
        q: "Pouvez-vous ajouter mon logo et mon image de marque?",
        a: "Oui. Votre logo, vos couleurs, votre nom, votre photo et vos coordonnées peuvent être ajoutés à chaque vidéo. Enregistrez-les une fois dans votre identité visuelle et ils sont réutilisés automatiquement.",
      },
      {
        q: "Quelles plateformes sont prises en charge?",
        a: "Les vidéos sont formatées pour les Reels et Stories Instagram, Facebook, TikTok, YouTube Shorts et la publicité sociale. Des versions grand format sont offertes pour YouTube et les sites Web.",
      },
      {
        q: "Que se passe-t-il après ma vidéo gratuite?",
        a: "Rien, à moins que vous en vouliez d'autres. Aucune carte n'est enregistrée et aucun prélèvement automatique n'est effectué. Si vous l'aimez, vous pouvez acheter des vidéos à l'unité ou choisir un forfait mensuel.",
      },
      {
        q: "Puis-je annuler mon abonnement?",
        a: "Oui, en tout temps à partir de votre compte. Votre forfait demeure actif jusqu'à la fin de la période de facturation en cours.",
      },
      {
        q: "Qu'est-ce qui est inclus dans le forfait Courtier?",
        a: "4 vidéos d'inscription professionnelles par mois avec sous-titres, musique, image de marque et formats sociaux, en plus de la plateforme client, de l'historique des projets, de la livraison du contenu et d'idées de contenu chaque mois.",
      },
      {
        q: "Qu'est-ce qui est inclus dans le forfait Pro?",
        a: "Tout le forfait Courtier, jusqu'à 10 vidéos par mois, la production prioritaire, des options de contenu avancées et l'accès complet à la plateforme.",
      },
      {
        q: "Offrez-vous du UGC IA?",
        a: "Oui. Nous créons des vidéos au style natif des réseaux avec vous en vedette — présentation du courtier, promotion de propriétés, contenu éducatif — uniquement à partir de votre image et de contenus que vous avez approuvés.",
      },
      {
        q: "Créez-vous des publicités?",
        a: "Oui. Nous concevons des créations vidéo pour Meta, Instagram, Facebook et TikTok. Comme chaque campagne est différente, on commence par une courte discussion — écrivez-nous pour une soumission.",
      },
      {
        q: "Comment fonctionne la visite virtuelle?",
        a: "À partir de vos photos et des informations sur les pièces, nous créons une expérience numérique immersive que les acheteurs peuvent explorer à distance. Elle est offerte en option à {walkthroughPrice} pour toute inscription.",
      },
    ],
  },

  finalCta: {
    headline: [{ text: "Votre prochaine propriété mérite" }, { text: "plus que des ", accent: "photos." }],
    supporting: "Transformez votre propriété en contenu qu'on a envie de regarder.",
  },

  footer: {
    tagline: "Des vidéos immobilières professionnelles. Sans tournage.",
    product: "Produit",
    company: "Entreprise",
    account: "Compte",
    legal: "Mentions légales",
    about: "À propos",
    contact: "Contact",
    createAccount: "Créer un compte",
    privacy: "Confidentialité",
    terms: "Conditions",
    cookies: "Témoins",
    rights: "© {year} {brand}. Tous droits réservés.",
    social: "Réseaux sociaux",
  },

  signup: {
    creating: "Création de votre compte…",
    uploading: "Téléversement de la photo {current} sur {total}…",
    confirm: {
      title: "Vérifiez votre boîte de réception.",
      description: "Nous avons envoyé un lien de confirmation à {email}. Ouvrez-le pour activer votre compte — votre vidéo gratuite commence juste après.",
    },
    serverErrors: {
      invalidEmail: "Cette adresse courriel semble incorrecte. Vérifiez les fautes de frappe (ex. .com et non .coom).",
      rateLimited: "Trop d'inscriptions en peu de temps. Patientez quelques minutes, puis réessayez.",
      emailSend: "Impossible d'envoyer votre courriel de confirmation. Réessayez sous peu ou écrivez-nous.",
      exists: "Un compte existe déjà avec ce courriel. Connectez-vous plutôt.",
      weak: "Choisissez un mot de passe plus robuste (au moins 8 caractères).",
      generic: "Impossible de créer votre compte pour l'instant. Réessayez dans un instant.",
      upload: "Votre compte est prêt, mais certaines photos n'ont pas été téléversées. Vous pourrez les ajouter à l'étape suivante.",
    },
    title: "Créez votre première vidéo — gratuitement",
    subtitle: "Trois étapes rapides. Aucune carte de crédit.",
    stepOf: "Étape {current} sur {total}",
    steps: ["Vos coordonnées", "Mot de passe", "Votre inscription"],
    firstName: "Prénom",
    lastName: "Nom",
    email: "Courriel professionnel",
    emailPlaceholder: "vous@agence.com",
    password: "Créez un mot de passe",
    passwordHint: "Au moins 8 caractères.",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    google: "Continuer avec Google",
    or: "ou",
    uploadTitle: "Ajoutez les photos de votre inscription",
    uploadHint: "JPG, PNG ou WEBP — glissez-déposez ou parcourez",
    browse: "Parcourir",
    filesSelected: "{count} photos sélectionnées",
    submit: "Créer ma vidéo gratuite",
    haveAccount: "Vous avez déjà un compte?",
    terms: "En continuant, vous acceptez nos Conditions et notre Politique de confidentialité.",
    errors: {
      required: "Ce champ est obligatoire.",
      email: "Entrez une adresse courriel valide.",
      password: "Utilisez au moins 8 caractères.",
      files: "Ajoutez au moins une photo.",
    },
    pending: {
      title: "Vous y êtes presque.",
      description:
        "Les comptes en ligne ouvrent très bientôt — rien n'a encore été enregistré. D'ici là, envoyez les photos de votre inscription à {contact} et nous réaliserons votre vidéo gratuite personnellement.",
      action: "Envoyer mes photos",
    },
  },

  auth: {
    loginTitle: "Bon retour",
    loginSubtitle: "Connectez-vous pour gérer vos projets et vos vidéos.",
    email: "Courriel",
    password: "Mot de passe",
    forgot: "Mot de passe oublié?",
    submit: "Se connecter",
    submitting: "Connexion…",
    noAccount: "Nouveau ici?",
    unavailable: "Les comptes clients ouvrent sous peu. En attendant, commencez par votre vidéo gratuite.",
    google: "Continuer avec Google",
    or: "ou",
    errors: {
      invalid: "Ce courriel et ce mot de passe ne correspondent pas. Vérifiez-les et réessayez.",
      unconfirmed: "Confirmez d'abord votre courriel — nous vous avons envoyé un lien à l'inscription.",
      link: "Ce lien a expiré ou a déjà été utilisé. Demandez-en un nouveau ci-dessous.",
      generic: "Une erreur est survenue. Réessayez dans un instant.",
      rateLimited: "Trop de tentatives. Patientez une minute, puis réessayez.",
    },
    forgotTitle: "Réinitialiser votre mot de passe",
    forgotSubtitle: "Entrez votre courriel et nous vous enverrons un lien pour choisir un nouveau mot de passe.",
    forgotSubmit: "Envoyer le lien",
    forgotSent: "Si un compte existe pour {email}, un lien de réinitialisation est en route. Vérifiez votre boîte de réception.",
    backToLogin: "Retour à la connexion",
    resetTitle: "Choisissez un nouveau mot de passe",
    resetSubtitle: "Au moins 8 caractères.",
    newPassword: "Nouveau mot de passe",
    resetSubmit: "Enregistrer le mot de passe",
    resetDone: "Mot de passe mis à jour. Redirection vers votre tableau de bord…",
    resetNoSession: "Ouvrez le lien reçu par courriel pour continuer.",
    signOut: "Se déconnecter",
  },

  legal: {
    title: { privacy: "Politique de confidentialité", terms: "Conditions d'utilisation", cookies: "Politique sur les témoins" },
    pending: "Ce document est en cours de finalisation et sera publié avant le lancement.",
    back: "Retour à l'accueil",
  },

  notFound: {
    title: "Cette page n'est pas sur le marché.",
    back: "Retour à l'accueil",
  },

  media: {
    alt: {
      exterior: "Façade d'une maison familiale",
      frontYard: "Maison avec cour avant par une journée ensoleillée",
      twoStory: "Maison de banlieue à deux étages",
      townhouse: "Maison de ville dans une rue résidentielle",
      street: "Maisons d'un quartier de banlieue",
      facade: "Vue avant d'une maison",
      kitchen: "Cuisine moderne et lumineuse",
      living: "Salon chaleureux",
      bedroom: "Chambre baignée de lumière naturelle",
      dining: "Cuisine et coin repas",
      interior: "Salon avec canapé",
      agentWoman: "Courtière immobilière tenant une pancarte « Vendu » devant une maison",
      agentMan: "Portrait d'un courtier immobilier",
      agentPhone: "Courtière qui enregistre une vidéo avec son téléphone",
      keys: "Courtier remettant les clés d'une maison à un client",
      handshake: "Courtier remettant les clés aux nouveaux propriétaires",
      showing: "Courtière faisant visiter une maison à un couple",
    },
  },

  app,
};

export default fr;
