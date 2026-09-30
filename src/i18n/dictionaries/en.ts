/**
 * English dictionary. This file defines the shape every other language must
 * satisfy (see `Dictionary` in ./index.ts).
 *
 * Conventions:
 * - `{name}` style tokens are interpolated with `interpolate()`.
 * - Headline arrays are rendered line by line; `accent` marks the words that
 *   receive the gradient treatment.
 */
import app from "./en-app";

const en = {
  meta: {
    title: "Real estate listing videos, no film shoot",
    description:
      "Professional real estate videos made from your listing photos, delivered in 24 hours and ready for social media. Your first video is free.",
    ogAlt: "Listing photos turned into a vertical real estate video for social media",
    pages: {
      services: {
        title: "Real estate video services for agents",
        description:
          "Listing videos, 3D virtual tours, AI UGC and video ads for real estate agents in Quebec and Canada, delivered in 24 hours. Answers to your questions.",
      },
      pricing: {
        title: "Real estate video pricing",
        description:
          "Real estate video pricing: $49.95 per video or plans from $99/month for 4 videos. No film shoot, no hidden fees. Your first video is free.",
      },
      contact: {
        title: "Contact us: real estate video",
        description:
          "A question about our real estate videos, a team plan or a video ad campaign? Write to Grow Media and we'll get back to you quickly.",
      },
    },
  },

  common: {
    skipToContent: "Skip to content",
    freeVideoCta: "Create My Free Video",
    tryFree: "Try It Free",
    watchExample: "Watch an Example",
    learnMore: "Learn more",
    talkToUs: "Talk to Us",
    close: "Close",
    next: "Continue",
    back: "Back",
    startingAt: "Starting at",
    perVideo: "/ video",
    perMonth: "/ month",
    noCard: "No credit card required.",
    demoBadge: "Demo content",
    trustLine: ["No credit card required", "Delivered in 24h", "Ready to post"],
    new: "New",
  },

  nav: {
    label: "Main navigation",
    home: "Home",
    howItWorks: "How It Works",
    examples: "Examples",
    services: "Services",
    pricing: "Pricing",
    faq: "FAQ",
    contact: "Contact",
    login: "Login",
    cta: "Free Video",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },

  hero: {
    offerPill: "Launch offer: your first video is free",
    headline: [
      { text: "Professional real estate videos." },
      { text: "Without the ", accent: "shoot." },
    ],
    supporting: "Your listing photos, turned into a video that holds attention.",
    description:
      "Send us your property photos. We turn them into a cinematic, branded real estate video, ready to post within 24 hours.",
    visual: {
      label: "Your listing photos becoming a vertical social video",
      inputLabel: "Listing photos",
      processing: "In production",
      output: "Ready to post",
      tags: ["Motion", "Your branding", "Captions", "Music", "9:16"],
      reel: {
        handle: "@yourbrokerage",
        price: "$489,900",
        caption: "Just listed · 3 bd · 2 ba",
        cta: "Book a private visit",
        audio: "Original audio · Cinematic",
        agent: "Your name · Your brokerage",
      },
    },
  },

  transform: {
    eyebrow: "Before / after",
    headline: [{ text: "The same photos." }, { text: "A whole new ", accent: "impact." }],
    description: "Drag the handle to compare a standard listing photo with the real estate video we deliver.",
    before: "Before",
    after: "After",
    beforeCaption: "Standard listing photo",
    afterCaption: "Social-ready video",
    sliderLabel: "Compare before and after",
    transformButton: "Transform",
    resetButton: "Reset",
    added: "What we add",
    addedItems: ["Motion", "Transitions", "Music", "Captions", "Branding", "Social formats"],
    listing: {
      price: "$489,900",
      address: "1234 Example Street",
      specs: "3 bd · 2 ba · 1,650 sq ft",
      status: "For sale",
    },
    compare: {
      title: "What a listing video usually costs",
      traditionalLabel: "On-site videographer",
      traditionalValue: "Often $1,000+",
      traditionalNote: "Scheduling, filming, travel and editing.",
      oursLabel: "{brand} video",
      oursValue: "From {price}",
      oursNote: "Made from your existing photos. Delivered in 24h.",
      footnote:
        "Traditional production costs vary by provider, region and scope. Figures are illustrative only, not a quote.",
    },
  },

  trust: {
    label: "Agents from these brokerages already work with Grow",
  },
  examples: {
    eyebrow: "Examples",
    headline: [{ text: "Real estate videos ", accent: "in motion." }],
    description: "Real videos made from listing photos. Each one loads only when you press play.",
    playLabel: "Play video: {title}",
    items: {
      one: { title: "Cinematic listing video", meta: "Listing video" },
      two: { title: "Property showcase", meta: "Listing video" },
      three: { title: "Social teaser", meta: "Listing video" },
    },
    modalTitle: "Example video",
  },

  how: {
    eyebrow: "How it works",
    headline: [{ text: "Three steps. ", accent: "24 hours." }],
    description: "No filming, no scheduling, no software. Just your listing.",
    steps: {
      upload: {
        number: "01",
        label: "Upload",
        title: "Send us your listing.",
        description:
          "Property photos, your headshot, your logo and the listing details. Video clips too, if you have them.",
        address: "1234 Example Street",
        uploaded: "{count} photos uploaded",
        dropHint: "Drag & drop photos, logo, footage",
        items: ["Property photos", "Agent photo", "Logo", "Listing details", "Footage (optional)"],
      },
      customize: {
        number: "02",
        label: "Customize",
        title: "Pick a style, or let us choose.",
        description: "One tap for the style, a note if you like. We handle the rest.",
        styles: ["Luxury", "Cinematic", "Modern", "Energetic", "Minimal", "Surprise Me"],
        briefLabel: "Creative brief (optional)",
        briefExample: "Elegant, modern and premium.",
      },
      receive: {
        number: "03",
        label: "Publish",
        title: "Get it the next day.",
        description: "Download, request a revision or share, formatted for every platform.",
        checklist: ["Video ready", "Caption ready", "9:16 social format", "Branding applied"],
        actions: { download: "Download", revise: "Request revision", share: "Share" },
      },
    },
  },

  content: {
    eyebrow: "Formats",
    headline: [{ text: "One listing." }, { text: "Every ", accent: "format." }],
    description: "The same property, adapted for every stage of your marketing.",
    sponsored: "Sponsored",
    tablistLabel: "Content formats",
    formats: {
      reel: {
        label: "Listing Reel",
        format: "9:16 · 20–30 s",
        description: "The essential: a fast, cinematic vertical tour for Reels and Shorts.",
        overlay: "Just listed",
      },
      cinematic: {
        label: "Cinematic Video",
        format: "16:9 · 45–60 s",
        description: "A widescreen film for your website, YouTube and seller presentations.",
        overlay: "Welcome home",
      },
      ugc: {
        label: "AI Agent UGC",
        format: "9:16 · 15–30 s",
        description: "You, presenting the property, built from your likeness and content you approve.",
        overlay: "“Let me show you around”",
      },
      facebookAd: {
        label: "Facebook Ad",
        format: "4:5 · 15 s",
        description: "Ad creative with a clear hook and a call to action.",
        overlay: "Open house Saturday",
      },
      story: {
        label: "Instagram Story",
        format: "9:16 · 10 s",
        description: "Short teasers that keep your listing top of mind.",
        overlay: "Swipe for the kitchen",
      },
      teaser: {
        label: "Property Teaser",
        format: "1:1 · 8 s",
        description: "A coming-soon hint before the listing goes live.",
        overlay: "Coming soon",
      },
      walkthrough: {
        label: "Virtual Tour",
        format: "3D · interactive",
        description: "An immersive space buyers explore remotely, room by room.",
        overlay: "Explore in 3D",
      },
      shortAd: {
        label: "Short-Form Ad",
        format: "9:16 · 6 s",
        description: "Punchy ads for TikTok, Reels and YouTube.",
        overlay: "3 bd · Big backyard",
      },
    },
  },

  benefits: {
    eyebrow: "Why Grow Media",
    headline: [
      { text: "More visibility for your listings." },
      { text: "Less ", accent: "work." },
    ],
    items: {
      more: {
        title: "More content",
        description: "One listing becomes reels, stories and ads.",
      },
      fast: {
        title: "Delivered in 24h",
        description: "No shoot to schedule, no waiting.",
        timeline: ["Upload", "Production", "Ready"],
      },
      ready: {
        title: "Ready to post",
        description: "Captions, formats and branding included.",
      },
      cost: {
        title: "A fraction of the cost",
        description: "A professional result without the cost of a shoot.",
      },
      consistent: {
        title: "Post every week",
        description: "Stay visible, even when your calendar is full.",
        days: ["M", "T", "W", "T", "F", "S", "S"],
      },
      brand: {
        title: "Your brand",
        description: "Logo, colors, name and contact details on every video.",
      },
      social: {
        title: "Built for social",
        description: "Reels, Shorts, TikTok and paid social.",
      },
      scale: {
        title: "One listing or a hundred",
        description: "Same quality, same simplicity, whatever the volume.",
        listings: "{count} listings",
      },
    },
  },

  services: {
    eyebrow: "Services",
    headline: [{ text: "All the video content ", accent: "your listings need." }],
    description: "One partner for your listing videos, virtual tours and personal brand.",
    quote: "Custom quote",
    items: {
      listing: {
        title: "Listing Video",
        description: "Your photos become a cinematic real estate video with music, captions and your branding.",
        cta: "Create a Video",
        points: ["Vertical & widescreen", "Music & captions", "Delivered in 24h"],
      },
      walkthrough: {
        title: "3D Virtual Tour",
        description: "An immersive tour buyers explore remotely, room by room.",
        cta: "Learn More",
        points: ["Explore room by room", "Shareable link", "Optional on any listing"],
      },
      ugc: {
        title: "AI UGC: you, on screen",
        description: "Social-style videos featuring you, built from your likeness and content you approve.",
        cta: "Learn More",
        points: ["Agent introductions", "Property promotion", "Educational content"],
      },
      ads: {
        title: "Video Ads",
        description: "Video creatives for your Meta, Instagram, Facebook and TikTok campaigns.",
        cta: "Talk to Us",
        points: ["Hook in the first second", "Multiple variations", "Planned with you"],
      },
    },
  },

  pricing: {
    eyebrow: "Plans",
    headline: [{ text: "Clear pricing, ", accent: "no surprises." }],
    description: "Pay per video or choose a monthly plan. No hidden fees, cancel anytime.",
    offer: {
      badge: "Launch offer",
      title: "Your first video is free.",
      note: "No credit card required.",
    },
    billedMonthly: "Monthly plans · cancel anytime",
    mostPopular: "Most popular",
    videosPerMonth: "{count} videos per month",
    oneVideo: "1 professional listing video",
    plans: {
      single: {
        name: "Single",
        tagline: "For a one-off listing.",
        cta: "Create a Video",
        features: ["1 professional listing video", "Captions", "Music", "Branding", "Social formats", "Delivered in 24h"],
      },
      agent: {
        name: "Agent",
        tagline: "For agents who list every month.",
        cta: "Choose Agent",
        features: [
          "4 videos per month",
          "Professional listing videos",
          "Captions & music",
          "Your branding",
          "Social formats",
          "Client space & project history",
          "Delivery to your account",
        ],
      },
      pro: {
        name: "Pro",
        tagline: "For teams and high-volume agents.",
        cta: "Choose Pro",
        features: [
          "Everything in Agent",
          "Up to 10 videos per month",
          "Priority production",
          "Advanced content options",
          "Full platform access",
        ],
      },
    },
    addOnsTitle: "Add-ons",
    addOns: {
      walkthrough: { name: "3D Virtual Tour", price: "+{price}" },
      ads: { name: "Custom video ads", price: "Custom quote" },
    },
    limitsNote: "Unused videos don't roll over to the next month. Need more than 10 a month? Write to us.",
    faq: [
      {
        q: "How much does a real estate video cost?",
        a: "{singlePrice} for a single video. The Agent plan includes 4 videos a month for {agentPrice}, and the Pro plan up to 10 videos a month for {proPrice}. Your first video is free.",
      },
      {
        q: "Are there travel or filming fees?",
        a: "No. Everything is made from your listing photos: no travel, no filming, no hidden fees.",
      },
      {
        q: "Do unused videos roll over?",
        a: "No. The videos included in your plan renew every month and don't carry over to the next month.",
      },
      {
        q: "Can I change plans or cancel?",
        a: "Yes, anytime from your account. Your plan stays active until the end of the current billing period.",
      },
      {
        q: "How much does the 3D virtual tour cost?",
        a: "The 3D virtual tour is a {walkthroughPrice} add-on on any listing, on top of the video.",
      },
    ],
  },

  results: {
    eyebrow: "Results",
    headline: [{ text: "Created for real estate." }, { text: "Built for real ", accent: "results." }],
    description: "Every project is tracked from upload to delivery.",
    photos: "{count} photos",
    video: "{count} sec video",
    delivered: "Delivered in {count}h",
    metrics: { views: "Views", likes: "Likes", shares: "Shares", saves: "Saves" },
    demoNotice:
      "Layout preview with placeholder content. Real client stories will replace these cards.",
    empty: {
      title: "Be one of our first featured agents.",
      description:
        "We're collecting stories from our launch clients. Create your first video free and, if you love it, we'd be glad to feature it here.",
    },
    demo: [
      {
        quote: "Placeholder quote: the agent's own words about their first delivered video will appear here.",
        name: "Demo agent",
        role: "Brokerage name",
        property: "Sample property",
      },
      {
        quote: "Placeholder quote: a short, specific sentence about speed, quality or results.",
        name: "Demo agent",
        role: "Brokerage name",
        property: "Sample condo",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    headline: [{ text: "Real estate video ", accent: "questions." }],
    stillQuestions: "Another question?",
    showMore: "Show {count} more questions",
    showLess: "Show fewer questions",
    contact: "Write to us",
    items: [
      {
        q: "What is a Grow Media real estate video?",
        a: "It's a professional video of your listing, made from your photos with no film shoot. We add motion, transitions, music, captions and your branding, then deliver it in 24 hours, ready for Instagram, Facebook, TikTok and YouTube.",
      },
      {
        q: "How do you turn photos into a real estate video?",
        a: "Create a project, upload your listing photos and pick a style. Our team produces the video with professional editing and AI-assisted motion, then delivers it to your account, usually within 24 hours.",
      },
      {
        q: "How much does a real estate video cost?",
        a: "{singlePrice} for a single video. The Agent plan includes 4 videos a month for {agentPrice}, and the Pro plan up to 10 videos for {proPrice}. Your first video is free, no credit card required.",
      },
      {
        q: "Do I need a film shoot or a videographer?",
        a: "No. Everything is made from your listing photos. If you have video clips, we can include them too.",
      },
      {
        q: "What do I need to send you?",
        a: "Your listing photos, ideally 10 to 25 in high resolution. Optionally: your headshot, logo, listing details and video clips. If your branding is saved, it's applied automatically.",
      },
      {
        q: "How quickly will I receive my video?",
        a: "Most videos are delivered about 24 hours after you submit your project. It can take longer during peak periods or for complex requests; you follow the live status in your account.",
      },
      {
        q: "Does a video help sell a property?",
        a: "A video gives buyers a better sense of the property and usually draws more attention on social media than a photo alone. It also lets you post more often about each listing.",
      },
      {
        q: "Can I request changes?",
        a: "Yes. Every video includes one revision round. Describe your changes directly on the project and we'll handle them.",
      },
      {
        q: "Can you add my logo and branding?",
        a: "Yes. Your logo, colors, name, photo and contact details can appear on every video. Save them once; they're applied automatically after that.",
      },
      {
        q: "Which platforms can I post my videos on?",
        a: "Videos are formatted for Instagram Reels and Stories, Facebook, TikTok, YouTube Shorts and paid social. Widescreen versions are available for YouTube and your website.",
      },
      {
        q: "Do you serve all of Quebec?",
        a: "Yes. Everything happens online: we work with agents across Quebec and Canada, in French and English.",
      },
      {
        q: "What happens after my free video?",
        a: "Nothing, unless you want more. No card is saved and nothing is charged. You can then buy single videos or choose a monthly plan.",
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes, anytime from your account. Your plan stays active until the end of the current billing period.",
      },
      {
        q: "Do you offer AI UGC?",
        a: "Yes. We create social-style videos featuring you (agent introductions, property promotion, educational content), built only from your likeness and content you approve.",
      },
      {
        q: "Do you create video ads?",
        a: "Yes. We design video ad creatives for Meta, Instagram, Facebook and TikTok. Since every campaign is different, we start with a short conversation: write to us for a quote.",
      },
      {
        q: "How does the 3D virtual tour work?",
        a: "From your photos and room information, we create an immersive tour buyers explore remotely. It's a {walkthroughPrice} add-on on any listing.",
      },
    ],
  },

  finalCta: {
    headline: [{ text: "Your next listing deserves" }, { text: "more than ", accent: "photos." }],
    supporting: "Send your photos today. Get your video tomorrow.",
  },

  pages: {
    services: {
      eyebrow: "Services",
      headline: [{ text: "Video services for" }, { text: "real estate ", accent: "agents." }],
      intro:
        "Listing videos, 3D virtual tours, AI UGC and video ads: everything you need to showcase your properties on social media, made from your photos and delivered in 24 hours.",
      breadcrumb: "Services",
    },
    pricing: {
      eyebrow: "Pricing",
      headline: [{ text: "Real estate video" }, { text: "", accent: "pricing." }],
      intro:
        "A real estate video costs {singlePrice} on its own, or under $25 per video with the Agent plan. No filming, no travel, no hidden fees.",
      faqTitle: "Pricing questions",
      breadcrumb: "Pricing",
    },
    contact: {
      eyebrow: "Contact",
      headline: [{ text: "Let's talk about your" }, { text: "", accent: "listings." }],
      intro:
        "A question before your free video, a plan for your team or an ad campaign? Write to us and we'll reply quickly, in English or French.",
      breadcrumb: "Contact",
      emailLabel: "Email",
      form: {
        name: "Full name",
        email: "Email",
        phone: "Phone (optional)",
        agency: "Brokerage (optional)",
        topic: "Topic",
        topics: {
          question: "General question",
          team: "Team plan",
          ads: "Video ads",
          walkthrough: "3D virtual tour",
          other: "Other",
        },
        message: "Message",
        messagePlaceholder: "Tell us about your listings and what you're looking for.",
        submit: "Send message",
        sending: "Sending…",
        sent: "Thank you! We received your message and will reply quickly.",
        error: "We couldn't send your message right now. Try again, or email us directly.",
        invalid: "Please check your name, email and message.",
        privacy: "Your details are only used to reply to you.",
      },
      aside: {
        title: "Ready to try?",
        text: "The fastest way to get to know us: your first video, free.",
      },
    },
    homeTeaser: {
      eyebrow: "Learn more",
      headline: [{ text: "Everything you need to know," }, { text: "in ", accent: "two clicks." }],
      services: { title: "Services & FAQ", text: "Listing videos, 3D tours, UGC, ads, and answers to your questions.", cta: "See services" },
      pricing: { title: "Pricing", text: "From {singlePrice} per video, plans from {agentPrice}. First video free.", cta: "See pricing" },
      contact: { title: "Contact", text: "A question, a team project or a campaign? Write to us.", cta: "Write to us" },
    },
    breadcrumbHome: "Home",
  },

  footer: {
    tagline: "Professional real estate videos, no film shoot. For agents across Quebec and Canada.",
    product: "Product",
    company: "Company",
    account: "Account",
    legal: "Legal",
    about: "How it works",
    contact: "Contact",
    createAccount: "Create Account",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    rights: "© {year} {brand}. All rights reserved.",
    social: "Social media",
  },

  signup: {
    creating: "Creating your account…",
    uploading: "Uploading photo {current} of {total}…",
    confirm: {
      title: "Check your inbox.",
      description: "We sent a confirmation link to {email}. Open it to activate your account — your free video starts right after.",
    },
    serverErrors: {
      invalidEmail: "This email address doesn't look right. Check for typos (e.g. .com, not .coom).",
      rateLimited: "Too many sign-ups in a short time. Wait a few minutes and try again.",
      emailSend: "We couldn't send your confirmation email. Try again shortly, or write to us.",
      exists: "An account already exists with this email. Log in instead.",
      weak: "Choose a stronger password (at least 8 characters).",
      generic: "We couldn't create your account. Try again in a moment.",
      upload: "Your account is ready, but some photos didn't upload. You can add them in the next step.",
    },
    title: "Create your first video — free",
    subtitle: "Three quick steps. No credit card.",
    stepOf: "Step {current} of {total}",
    steps: ["Your details", "Password", "Your listing"],
    firstName: "First name",
    lastName: "Last name",
    email: "Work email",
    emailPlaceholder: "you@brokerage.com",
    password: "Create a password",
    passwordHint: "At least 8 characters.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    google: "Continue with Google",
    or: "or",
    uploadTitle: "Add your listing photos",
    uploadHint: "JPG, PNG or WEBP — drag & drop or browse",
    browse: "Browse files",
    filesSelected: "{count} photos selected",
    submit: "Create my free video",
    haveAccount: "Already have an account?",
    terms: "By continuing you agree to our Terms and Privacy Policy.",
    errors: {
      required: "This field is required.",
      email: "Enter a valid email address.",
      password: "Use at least 8 characters.",
      files: "Add at least one photo.",
    },
    pending: {
      title: "Almost there.",
      description:
        "Online accounts open very soon — nothing has been saved yet. In the meantime, email your listing photos to {contact} and we'll produce your free video personally.",
      action: "Email my photos",
    },
  },

  auth: {
    loginTitle: "Welcome back",
    loginSubtitle: "Log in to manage your projects and videos.",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    submit: "Log in",
    submitting: "Logging in…",
    noAccount: "New here?",
    unavailable: "Client accounts open shortly. In the meantime, start with your free video.",
    google: "Continue with Google",
    or: "or",
    errors: {
      invalid: "That email and password don't match. Check both and try again.",
      unconfirmed: "Confirm your email first — we sent you a link when you signed up.",
      link: "That link has expired or was already used. Request a new one below.",
      generic: "Something went wrong. Try again in a moment.",
      rateLimited: "Too many attempts. Wait a minute and try again.",
    },
    forgotTitle: "Reset your password",
    forgotSubtitle: "Enter your email and we'll send you a link to choose a new password.",
    forgotSubmit: "Send reset link",
    forgotSent: "If an account exists for {email}, a reset link is on its way. Check your inbox.",
    backToLogin: "Back to login",
    resetTitle: "Choose a new password",
    resetSubtitle: "Use at least 8 characters.",
    newPassword: "New password",
    resetSubmit: "Save new password",
    resetDone: "Password updated. Taking you to your dashboard…",
    resetNoSession: "Open the reset link from your email to continue.",
    signOut: "Sign out",
  },

  legal: {
    title: { privacy: "Privacy Policy", terms: "Terms of Service", cookies: "Cookie Policy" },
    pending: "This document is being finalized and will be published before launch.",
    back: "Back to home",
  },

  notFound: {
    title: "This page isn't on the market.",
    back: "Back to home",
  },

  media: {
    alt: {
      winter: "Family home on a snowy winter day",
      forSale: "House with a for-sale sign on the lawn",
      bathroom: "Bright, simple bathroom",
      entrance: "Front entrance and hallway of a home",
      couple: "Couple in front of their new home",
      creator: "Real estate agent smiling at the camera",
      exterior: "Front of a family home",
      frontYard: "House with a front yard on a sunny day",
      twoStory: "Two-storey suburban house",
      townhouse: "Townhouse on a residential street",
      street: "Suburban neighbourhood homes",
      facade: "Front view of a house",
      kitchen: "Bright modern kitchen",
      living: "Cozy living room",
      bedroom: "Bedroom in natural light",
      dining: "Kitchen and dining area",
      interior: "Living room with a sofa",
      agentWoman: "Real estate agent holding a sold sign in front of a house",
      agentMan: "Real estate broker portrait",
      agentPhone: "Agent recording a video with a phone",
      keys: "Agent handing house keys to a client",
      handshake: "Agent handing keys to new homeowners",
      showing: "Agent showing a home to a couple",
    },
  },

  app,
};

export default en;
