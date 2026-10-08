import type { Dictionary } from "./index";
import app from "./fr-app";

/**
 * Français (Canada). Rédigé comme langue principale — pas une traduction
 * littérale de l'anglais.
 */
const fr: Dictionary = {
  meta: {
    title: "Vidéo immobilière pour courtiers, sans tournage",
    description:
      "Vidéo immobilière professionnelle à partir des photos de votre inscription, livrée en 24 h et prête pour vos réseaux. Première vidéo gratuite.",
    ogAlt: "Des photos d'inscription transformées en vidéo immobilière verticale pour les réseaux sociaux",
    pages: {
      services: {
        title: "Services vidéo pour courtiers immobiliers",
        description:
          "Vidéo d'inscription, visite virtuelle 3D, UGC et publicités vidéo pour courtiers immobiliers au Québec, livrés en 24 h. Réponses à vos questions.",
      },
      pricing: {
        title: "Prix d'une vidéo immobilière : nos tarifs",
        description:
          "Prix d'une vidéo immobilière : 49,95 $ l'unité ou forfaits dès 99 $/mois pour 4 vidéos. Sans tournage, sans frais cachés. Première vidéo gratuite.",
      },
      contact: {
        title: "Contact : vidéo immobilière au Québec",
        description:
          "Une question sur nos vidéos immobilières, un forfait d'équipe ou une campagne publicitaire? Écrivez à Grow Media, nous vous répondons rapidement.",
      },
    },
  },

  common: {
    skipToContent: "Aller au contenu",
    freeVideoCta: "Créer ma vidéo gratuite",
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
    trustLine: ["Sans carte de crédit", "Livrée en 24 h", "Prête à publier"],
    new: "Nouveau",
  },

  nav: {
    label: "Navigation principale",
    home: "Accueil",
    howItWorks: "Fonctionnement",
    examples: "Exemples",
    services: "Services",
    pricing: "Tarifs",
    faq: "FAQ",
    contact: "Contact",
    login: "Connexion",
    cta: "Vidéo gratuite",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    language: "Langue",
  },

  hero: {
    offerPill: "Offre de lancement : votre première vidéo est gratuite",
    headline: [
      { text: "Des vidéos immobilières professionnelles." },
      { text: "Sans ", accent: "tournage." },
    ],
    supporting: "Vos photos d'inscription, transformées en vidéo qui retient l'attention.",
    description:
      "Envoyez-nous les photos de votre propriété. Nous en faisons une vidéo immobilière cinématographique, à votre image, prête à publier en 24 heures.",
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

  walkthrough: {
    label: "Visite virtuelle 3D : faites défiler pour entrer dans la maison",
    hint: "Défilez pour visiter",
    demo: "Visite 3D de démonstration, créée à partir d'une seule photo",
    chapters: [
      { eyebrow: "L'entrée", title: "Entrez comme si vous y étiez.", body: "Une visite virtuelle 3D qui ouvre la porte aux acheteurs, à distance." },
      { eyebrow: "La cuisine", title: "Un coup d'œil à gauche.", body: "L'îlot, les armoires, la lumière : chaque détail qui fait vendre." },
      { eyebrow: "L'étage", title: "On monte à l'étage.", body: "Chaque niveau de la propriété, dans un seul plan continu." },
      { eyebrow: "La chambre principale", title: "La lumière, la vue, les volumes.", body: "Comme une visite en personne, depuis le téléphone de l'acheteur." },
      { eyebrow: "Le salon", title: "Retour au rez-de-chaussée.", body: "Des plans fluides, sans tournage, pour vos réseaux et votre site." },
      { eyebrow: "La cour", title: "Prête à publier en 24 h.", body: "Envoyez vos photos aujourd'hui. Recevez votre vidéo demain." },
    ],
    midCta: "Découvrir la visite 3D",
  },

  transform: {
    eyebrow: "Avant / après",
    headline: [{ text: "Les mêmes photos." }, { text: "Un tout autre ", accent: "impact." }],
    description: "Faites glisser le curseur pour comparer une photo d'inscription standard et la vidéo immobilière que nous livrons.",
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
      title: "Le coût habituel d'une vidéo",
      traditionalLabel: "Vidéaste sur place",
      traditionalValue: "Souvent 1 000 $ et plus",
      traditionalNote: "Planification, tournage, déplacement et montage.",
      oursLabel: "Vidéo {brand}",
      oursValue: "Dès {price}",
      oursNote: "À partir de vos photos existantes. Livrée en 24 h.",
      footnote:
        "Les tarifs de production traditionnelle varient selon le fournisseur, la région et l'ampleur du projet. Montants indicatifs seulement, et non une soumission.",
    },
  },

  trust: {
    label: "Des courtiers de ces bannières font déjà confiance à Grow",
  },
  examples: {
    eyebrow: "Exemples",
    headline: [{ text: "Des vidéos immobilières ", accent: "en action." }],
    description: "De vraies vidéos réalisées à partir de photos d'inscription. Chaque vidéo se charge seulement quand vous appuyez sur lecture.",
    playLabel: "Lire la vidéo : {title}",
    items: {
      one: { title: "Vidéo cinématographique", meta: "Vidéo d'inscription", description: "La façade, puis chaque pièce, en lents mouvements de caméra. Le format des belles inscriptions." },
      two: { title: "Mise en valeur de la propriété", meta: "Vidéo d'inscription", description: "Les matériaux, la lumière et les détails qui font vendre, au rythme de la musique." },
      three: { title: "Aperçu pour les réseaux", meta: "Vidéo d'inscription", description: "Court et rythmé, pensé pour arrêter le défilement sur Instagram, Facebook et TikTok." },
    },
    modalTitle: "Vidéo exemple",
  },

  how: {
    eyebrow: "Fonctionnement",
    headline: [{ text: "Trois étapes. ", accent: "24 heures." }],
    description: "Aucun tournage, aucune logistique, aucun logiciel. Seulement votre inscription.",
    steps: {
      upload: {
        number: "01",
        label: "Envoyez",
        title: "Envoyez votre inscription.",
        description:
          "Les photos de la propriété, votre photo, votre logo et les détails de l'inscription. Des extraits vidéo, si vous en avez.",
        address: "1234, rue Exemple",
        uploaded: "{count} photos téléversées",
        dropHint: "Glissez-déposez photos, logo, extraits vidéo",
        items: ["Photos de la propriété", "Photo du courtier", "Logo", "Détails de l'inscription", "Vidéo (facultatif)"],
      },
      customize: {
        number: "02",
        label: "Personnalisez",
        title: "Choisissez un style, ou laissez-nous faire.",
        description: "Un clic pour le style, une note si vous le souhaitez. Nous nous occupons du reste.",
        styles: ["Luxe", "Cinématique", "Moderne", "Dynamique", "Épuré", "Surprenez-moi"],
        briefLabel: "Consignes créatives (facultatif)",
        briefExample: "Élégant, moderne et haut de gamme.",
      },
      receive: {
        number: "03",
        label: "Publiez",
        title: "Recevez-la le lendemain.",
        description: "Téléchargez, demandez une retouche ou partagez, au bon format pour chaque plateforme.",
        checklist: ["Vidéo prête", "Texte de publication prêt", "Format social 9:16", "Image de marque appliquée"],
        actions: { download: "Télécharger", revise: "Demander une retouche", share: "Partager" },
      },
    },
  },

  content: {
    eyebrow: "Formats",
    headline: [{ text: "Une inscription." }, { text: "Tous vos ", accent: "formats." }],
    description: "Une même propriété, déclinée pour chaque étape de votre mise en marché.",
    sponsored: "Commandité",
    tablistLabel: "Formats de contenu",
    formats: {
      reel: {
        label: "Reel d'inscription",
        format: "9:16 · 20 à 30 s",
        description: "Le format de base : une visite verticale, rapide et cinématographique pour Reels et Shorts.",
        overlay: "Nouvelle inscription",
      },
      cinematic: {
        label: "Vidéo cinématographique",
        format: "16:9 · 45 à 60 s",
        description: "Un film horizontal pour votre site Web, YouTube et vos présentations aux vendeurs.",
        overlay: "Bienvenue chez vous",
      },
      ugc: {
        label: "UGC IA du courtier",
        format: "9:16 · 15 à 30 s",
        description: "Vous, qui présentez la propriété, à partir de votre image et de contenus que vous approuvez.",
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
        description: "Un avant-goût « bientôt sur le marché » avant la mise en vente.",
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
    eyebrow: "Pourquoi Grow Media",
    headline: [
      { text: "Plus de visibilité pour vos inscriptions." },
      { text: "Moins de ", accent: "travail." },
    ],
    items: {
      more: {
        title: "Plus de contenu",
        description: "Une inscription devient reels, stories et publicités.",
      },
      fast: {
        title: "Livrée en 24 h",
        description: "Aucun tournage à planifier, aucune attente.",
        timeline: ["Envoi", "Production", "Prête"],
      },
      ready: {
        title: "Prête à publier",
        description: "Sous-titres, formats et image de marque inclus.",
      },
      cost: {
        title: "Une fraction du prix",
        description: "Un rendu professionnel sans les frais d'un tournage.",
      },
      consistent: {
        title: "Publiez chaque semaine",
        description: "Restez visible, même quand votre agenda déborde.",
        days: ["L", "M", "M", "J", "V", "S", "D"],
      },
      brand: {
        title: "À votre image",
        description: "Logo, couleurs, nom et coordonnées sur chaque vidéo.",
      },
      social: {
        title: "Conçue pour les réseaux",
        description: "Reels, Shorts, TikTok et publicités sociales.",
      },
      scale: {
        title: "Une ou cent inscriptions",
        description: "Même qualité, même simplicité, peu importe le volume.",
        listings: "{count} inscriptions",
      },
    },
  },

  services: {
    eyebrow: "Services",
    headline: [{ text: "Tout le contenu vidéo ", accent: "de vos inscriptions." }],
    description: "Un seul partenaire pour vos vidéos d'inscription, vos visites virtuelles et votre marque personnelle.",
    quote: "Sur soumission",
    items: {
      listing: {
        title: "Vidéo d'inscription",
        description:
          "Vos photos deviennent une vidéo immobilière cinématographique avec musique, sous-titres et votre image de marque.",
        cta: "Créer une vidéo",
        points: ["Formats vertical et horizontal", "Musique et sous-titres", "Livrée en 24 h"],
      },
      walkthrough: {
        title: "Visite virtuelle 3D",
        description: "Une visite immersive que les acheteurs explorent à distance, pièce par pièce.",
        cta: "En savoir plus",
        points: ["Exploration pièce par pièce", "Lien à partager", "En option sur toute inscription"],
      },
      ugc: {
        title: "UGC IA : vous, en vedette",
        description:
          "Des vidéos au style des réseaux, avec vous à l'écran, créées à partir de votre image et de contenus que vous approuvez.",
        cta: "En savoir plus",
        points: ["Présentation du courtier", "Promotion de propriétés", "Contenu éducatif"],
      },
      ads: {
        title: "Publicités vidéo",
        description: "Des créations vidéo pour vos campagnes Meta, Instagram, Facebook et TikTok.",
        cta: "Parlons-en",
        points: ["Accroche dès la première seconde", "Plusieurs variantes", "Planifiées avec vous"],
      },
    },
  },

  pricing: {
    eyebrow: "Forfaits",
    headline: [{ text: "Des tarifs clairs, ", accent: "sans surprise." }],
    description: "Payez à la vidéo ou choisissez un forfait mensuel. Aucuns frais cachés, annulation en tout temps.",
    offer: {
      badge: "Offre de lancement",
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
          "Livrée en 24 h",
        ],
      },
      agent: {
        name: "Courtier",
        tagline: "Pour le courtier qui inscrit chaque mois.",
        cta: "Choisir Courtier",
        features: [
          "4 vidéos par mois",
          "Vidéos d'inscription professionnelles",
          "Sous-titres et musique",
          "Votre image de marque",
          "Formats sociaux",
          "Espace client et historique des projets",
          "Livraison dans votre compte",
        ],
      },
      pro: {
        name: "Pro",
        tagline: "Pour les équipes et les courtiers à fort volume.",
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
      ads: { name: "Publicités vidéo sur mesure", price: "Sur soumission" },
    },
    limitsNote: "Les vidéos non utilisées ne sont pas reportées au mois suivant. Plus de 10 vidéos par mois? Écrivez-nous.",
    faq: [
      {
        q: "Combien coûte une vidéo immobilière?",
        a: "{singlePrice} la vidéo à l'unité. Le forfait Courtier comprend 4 vidéos par mois pour {agentPrice}, et le forfait Pro jusqu'à 10 vidéos par mois pour {proPrice}. Votre première vidéo est gratuite.",
      },
      {
        q: "Y a-t-il des frais de déplacement ou de tournage?",
        a: "Non. Tout est réalisé à partir des photos de votre inscription : aucun déplacement, aucun tournage, aucuns frais cachés.",
      },
      {
        q: "Les vidéos non utilisées sont-elles reportées?",
        a: "Non. Les vidéos incluses dans votre forfait se renouvellent chaque mois et ne sont pas reportées au mois suivant.",
      },
      {
        q: "Puis-je changer de forfait ou annuler?",
        a: "Oui, en tout temps à partir de votre compte. Votre forfait demeure actif jusqu'à la fin de la période de facturation en cours.",
      },
      {
        q: "Combien coûte la visite virtuelle 3D?",
        a: "La visite virtuelle 3D est offerte en option à {walkthroughPrice} sur toute inscription, en plus de la vidéo.",
      },
    ],
  },

  results: {
    eyebrow: "Résultats",
    headline: [{ text: "Créé pour l'immobilier." }, { text: "Pensé pour des résultats ", accent: "concrets." }],
    description: "Chaque projet est suivi de l'envoi à la livraison.",
    photos: "{count} photos",
    video: "Vidéo de {count} s",
    delivered: "Livrée en {count} h",
    metrics: { views: "Vues", likes: "J'aime", shares: "Partages", saves: "Enregistrements" },
    demoNotice:
      "Aperçu de mise en page avec contenu fictif. De vrais témoignages de clients remplaceront ces cartes.",
    empty: {
      title: "Soyez parmi nos premiers courtiers en vedette.",
      description:
        "Nous recueillons les témoignages de nos clients de lancement. Créez votre première vidéo gratuitement et, si vous l'aimez, nous serons ravis de la présenter ici.",
    },
    demo: [
      {
        quote: "Citation fictive : les mots du courtier au sujet de sa première vidéo livrée apparaîtront ici.",
        name: "Courtier démo",
        role: "Nom de l'agence",
        property: "Propriété exemple",
      },
      {
        quote: "Citation fictive : une phrase courte et précise sur la rapidité, la qualité ou les résultats.",
        name: "Courtier démo",
        role: "Nom de l'agence",
        property: "Condo exemple",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    headline: [{ text: "Questions fréquentes sur ", accent: "la vidéo immobilière." }],
    stillQuestions: "Une autre question?",
    showMore: "Voir {count} autres questions",
    showLess: "Voir moins de questions",
    contact: "Écrivez-nous",
    items: [
      {
        q: "Qu'est-ce qu'une vidéo immobilière Grow Media?",
        a: "C'est une vidéo professionnelle de votre inscription, réalisée à partir de vos photos, sans tournage. Nous ajoutons mouvement, transitions, musique, sous-titres et votre image de marque, puis la livrons en 24 heures, prête pour Instagram, Facebook, TikTok et YouTube.",
      },
      {
        q: "Comment transformer des photos en vidéo immobilière?",
        a: "Créez un projet, téléversez les photos de votre inscription et choisissez un style. Notre équipe réalise la vidéo par un montage professionnel et des mouvements assistés par IA, puis la dépose dans votre compte, généralement en 24 heures.",
      },
      {
        q: "Combien coûte une vidéo immobilière?",
        a: "{singlePrice} la vidéo à l'unité. Le forfait Courtier comprend 4 vidéos par mois pour {agentPrice}, et le forfait Pro jusqu'à 10 vidéos pour {proPrice}. Votre première vidéo est gratuite, sans carte de crédit.",
      },
      {
        q: "Faut-il un tournage ou un vidéaste?",
        a: "Non. Tout est réalisé à partir des photos de votre inscription. Si vous avez des extraits vidéo, nous pouvons aussi les intégrer.",
      },
      {
        q: "Que dois-je vous envoyer?",
        a: "Les photos de votre inscription, idéalement de 10 à 25 en haute résolution. Au besoin : votre photo, votre logo, les détails de l'inscription et vos extraits vidéo. Si votre image de marque est enregistrée, elle est appliquée automatiquement.",
      },
      {
        q: "En combien de temps vais-je recevoir ma vidéo?",
        a: "La plupart des vidéos sont livrées environ 24 heures après l'envoi du projet. Le délai peut être plus long en période de pointe ou pour une demande complexe; vous suivez l'état du projet en temps réel dans votre compte.",
      },
      {
        q: "Une vidéo aide-t-elle à vendre une propriété?",
        a: "Une vidéo donne aux acheteurs une meilleure idée de la propriété et attire généralement plus d'attention sur les réseaux sociaux qu'une photo seule. Elle vous permet aussi de publier plus souvent sur chaque inscription.",
      },
      {
        q: "Puis-je demander des modifications?",
        a: "Oui. Chaque vidéo comprend une ronde de retouches. Indiquez vos changements directement dans le projet, et nous nous en occupons.",
      },
      {
        q: "Pouvez-vous ajouter mon logo et mon image de marque?",
        a: "Oui. Votre logo, vos couleurs, votre nom, votre photo et vos coordonnées peuvent apparaître sur chaque vidéo. Enregistrez-les une fois; ils sont ensuite appliqués automatiquement.",
      },
      {
        q: "Sur quelles plateformes puis-je publier mes vidéos?",
        a: "Les vidéos sont formatées pour les Reels et Stories Instagram, Facebook, TikTok, YouTube Shorts et la publicité sociale. Des versions horizontales sont offertes pour YouTube et votre site Web.",
      },
      {
        q: "Servez-vous tout le Québec?",
        a: "Oui. Tout se fait en ligne : nous travaillons avec des courtiers partout au Québec et au Canada, en français et en anglais.",
      },
      {
        q: "Que se passe-t-il après ma vidéo gratuite?",
        a: "Rien, à moins que vous en vouliez d'autres. Aucune carte n'est enregistrée et aucun prélèvement n'est effectué. Vous pouvez ensuite acheter des vidéos à l'unité ou choisir un forfait mensuel.",
      },
      {
        q: "Puis-je annuler mon abonnement?",
        a: "Oui, en tout temps à partir de votre compte. Votre forfait demeure actif jusqu'à la fin de la période de facturation en cours.",
      },
      {
        q: "Offrez-vous du UGC IA?",
        a: "Oui. Nous créons des vidéos au style des réseaux avec vous en vedette (présentation du courtier, promotion de propriétés, contenu éducatif), uniquement à partir de votre image et de contenus que vous approuvez.",
      },
      {
        q: "Créez-vous des publicités vidéo?",
        a: "Oui. Nous concevons des créations vidéo pour Meta, Instagram, Facebook et TikTok. Chaque campagne étant différente, nous commençons par une courte discussion : écrivez-nous pour une soumission.",
      },
      {
        q: "Comment fonctionne la visite virtuelle 3D?",
        a: "À partir de vos photos et des informations sur les pièces, nous créons une visite immersive que les acheteurs explorent à distance. Elle est offerte en option à {walkthroughPrice} sur toute inscription.",
      },
    ],
  },

  finalCta: {
    headline: [{ text: "Votre prochaine inscription mérite" }, { text: "mieux que des ", accent: "photos." }],
    supporting: "Envoyez vos photos aujourd'hui. Recevez votre vidéo demain.",
  },

  pages: {
    services: {
      eyebrow: "Services",
      headline: [{ text: "Services vidéo pour" }, { text: "courtiers ", accent: "immobiliers." }],
      intro:
        "Vidéo d'inscription, visite virtuelle 3D, UGC et publicités vidéo : tout ce qu'il faut pour mettre vos propriétés en valeur sur les réseaux, réalisé à partir de vos photos et livré en 24 heures.",
      breadcrumb: "Services",
    },
    pricing: {
      eyebrow: "Tarifs",
      headline: [{ text: "Prix d'une vidéo" }, { text: "", accent: "immobilière." }],
      intro:
        "Une vidéo immobilière coûte {singlePrice} à l'unité, ou moins de 25 $ la vidéo avec le forfait Courtier. Aucun tournage, aucun déplacement, aucuns frais cachés.",
      faqTitle: "Questions sur les tarifs",
      breadcrumb: "Tarifs",
    },
    contact: {
      eyebrow: "Contact",
      headline: [{ text: "Parlons de vos" }, { text: "", accent: "inscriptions." }],
      intro:
        "Une question avant votre vidéo gratuite, un forfait pour votre équipe ou une campagne publicitaire? Écrivez-nous, nous vous répondons rapidement, en français ou en anglais.",
      breadcrumb: "Contact",
      emailLabel: "Courriel",
      form: {
        name: "Nom complet",
        email: "Courriel",
        phone: "Téléphone (facultatif)",
        agency: "Agence ou bannière (facultatif)",
        topic: "Sujet",
        topics: {
          question: "Question générale",
          team: "Forfait pour une équipe",
          ads: "Publicités vidéo",
          walkthrough: "Visite virtuelle 3D",
          other: "Autre",
        },
        message: "Message",
        messagePlaceholder: "Parlez-nous de vos inscriptions et de ce que vous cherchez.",
        submit: "Envoyer le message",
        sending: "Envoi…",
        sent: "Merci! Votre message est bien reçu. Nous vous répondons rapidement.",
        error: "Impossible d'envoyer le message pour l'instant. Réessayez, ou écrivez-nous directement.",
        invalid: "Vérifiez votre nom, votre courriel et votre message.",
        privacy: "Vos coordonnées servent uniquement à vous répondre.",
      },
      aside: {
        title: "Prêt à essayer?",
        text: "La façon la plus rapide de nous connaître : votre première vidéo, gratuitement.",
      },
    },
    homeTeaser: {
      eyebrow: "Aller plus loin",
      headline: [{ text: "Tout ce qu'il faut savoir," }, { text: "en ", accent: "deux clics." }],
      services: { title: "Services et FAQ", text: "Vidéo d'inscription, visite 3D, UGC, publicités, et les réponses à vos questions.", cta: "Voir les services" },
      pricing: { title: "Tarifs", text: "Dès {singlePrice} la vidéo, forfaits dès {agentPrice}. Première vidéo gratuite.", cta: "Voir les tarifs" },
      contact: { title: "Contact", text: "Une question, un projet d'équipe ou une campagne? Écrivez-nous.", cta: "Nous écrire" },
    },
    breadcrumbHome: "Accueil",
  },

  footer: {
    tagline: "Vidéos immobilières professionnelles, sans tournage. Pour les courtiers du Québec et du Canada.",
    product: "Produit",
    company: "Entreprise",
    account: "Compte",
    legal: "Mentions légales",
    about: "Fonctionnement",
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
      winter: "Maison familiale par une journée d'hiver enneigée",
      forSale: "Maison avec une pancarte « À vendre » sur le terrain",
      bathroom: "Salle de bain lumineuse et simple",
      entrance: "Entrée et corridor d'une maison",
      couple: "Couple devant sa nouvelle maison",
      creator: "Courtière immobilière souriant à la caméra",
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
