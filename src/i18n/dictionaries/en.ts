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
    title: "Professional real estate listing videos — without the shoot",
    description:
      "Turn your listing photos into cinematic, branded videos for Instagram, Facebook, TikTok and YouTube Shorts. Delivered in about 24 hours. First video free.",
    ogAlt: "A listing photo transformed into a vertical social media video",
  },

  common: {
    skipToContent: "Skip to content",
    freeVideoCta: "Create My First Video Free",
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
    trustLine: ["No credit card required", "24h delivery", "Ready to post"],
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
    login: "Login",
    cta: "First Video Free",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },

  hero: {
    offerPill: "Launch offer — your first video is free",
    headline: [
      { text: "Professional listing videos." },
      { text: "Without the ", accent: "shoot." },
    ],
    supporting: "Turn your listing photos into scroll-stopping videos.",
    description:
      "Send us your listing photos. We turn them into cinematic, branded videos ready for social media — delivered in approximately 24 hours.",
    visual: {
      label: "Your listing photos becoming a vertical social video",
      inputLabel: "Listing photos",
      processing: "Producing",
      output: "Ready to post",
      tags: ["Motion", "Agent branding", "Captions", "Music", "9:16"],
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
    eyebrow: "Photo → Video",
    headline: [
      { text: "From static listing to" },
      { text: "scroll-stopping ", accent: "content." },
    ],
    description:
      "Same photos. A completely different result. Drag the handle to compare a standard listing with what we deliver.",
    before: "Before",
    after: "After",
    beforeCaption: "Standard listing photo",
    afterCaption: "Social-ready video",
    sliderLabel: "Compare before and after",
    transformButton: "Transform",
    resetButton: "Reset",
    added: "What we add",
    addedItems: ["Motion", "Transitions", "Music", "Captions", "Branding", "Social formatting"],
    listing: {
      price: "$489,900",
      address: "1234 Example Street",
      specs: "3 bd · 2 ba · 1,650 sq ft",
      status: "For sale",
    },
    compare: {
      title: "What it typically costs",
      traditionalLabel: "Traditional video shoot",
      traditionalValue: "Often $1,000+",
      traditionalNote: "Videographer, scheduling, on-site shoot, editing.",
      oursLabel: "{brand} listing video",
      oursValue: "From {price}",
      oursNote: "Your existing photos. About 24h turnaround.",
      footnote:
        "Traditional production costs vary widely by market, provider and scope. Figures shown are an illustrative typical range, not a quote.",
    },
  },

  trust: {
    label: "Built for agents at Quebec and Canada's leading brokerages — and ready for the platforms your buyers use",
  },
  examples: {
    eyebrow: "Examples",
    headline: [{ text: "See it in ", accent: "motion." }],
    description:
      "Real videos produced from listing assets. Press play — each one loads only when you ask for it.",
    playLabel: "Play video: {title}",
    items: {
      one: { title: "Cinematic listing reel", meta: "Listing video" },
      two: { title: "Property showcase", meta: "Listing video" },
      three: { title: "Social-first teaser", meta: "Listing video" },
    },
    modalTitle: "Example video",
  },

  how: {
    eyebrow: "How it works",
    headline: [{ text: "Three steps. ", accent: "That's it." }],
    description: "No filming day, no scheduling, no editing software. Just your listing.",
    steps: {
      upload: {
        number: "01",
        label: "Upload",
        title: "Send us your listing.",
        description:
          "Property photos, your headshot, logo, listing details — and optional video footage if you have it.",
        address: "1234 Example Street",
        uploaded: "{count} photos uploaded",
        dropHint: "Drag & drop photos, logo, footage",
        items: ["Property photos", "Agent photo", "Logo", "Listing info", "Footage (optional)"],
      },
      customize: {
        number: "02",
        label: "Customize",
        title: "Tell us the vibe. Or let us handle it.",
        description: "Pick a style in one tap, add a note if you want. We take it from there.",
        styles: ["Luxury", "Cinematic", "Modern", "Energetic", "Minimal", "Surprise Me"],
        briefLabel: "Creative brief (optional)",
        briefExample: "Make it elegant, modern and premium.",
      },
      receive: {
        number: "03",
        label: "Receive & publish",
        title: "Ready the next day.",
        description: "Download, request a revision, or share — formatted for every platform.",
        checklist: ["Video ready", "Caption ready", "9:16 social format", "Branding applied"],
        actions: { download: "Download", revise: "Request revision", share: "Share" },
      },
    },
  },

  content: {
    eyebrow: "Content engine",
    headline: [{ text: "One listing." }, { text: "Endless ", accent: "content." }],
    description: "Turn the same listing into content for every stage of your marketing.",
    sponsored: "Sponsored",
    tablistLabel: "Content formats",
    formats: {
      reel: {
        label: "Listing Reel",
        format: "9:16 · 20–30 s",
        description: "The classic: a fast, cinematic vertical tour built for Reels and Shorts.",
        overlay: "Just listed",
      },
      cinematic: {
        label: "Cinematic Video",
        format: "16:9 · 45–60 s",
        description: "A widescreen film for your website, YouTube and listing presentations.",
        overlay: "Welcome home",
      },
      ugc: {
        label: "AI Agent UGC",
        format: "9:16 · 15–30 s",
        description: "You, presenting the property — built from your approved likeness and content.",
        overlay: "“Let me show you around”",
      },
      facebookAd: {
        label: "Facebook Ad",
        format: "4:5 · 15 s",
        description: "Paid-social creative with a clear hook and a call to action.",
        overlay: "Open house Saturday",
      },
      story: {
        label: "Instagram Story",
        format: "9:16 · 10 s",
        description: "Short, tappable teasers that keep your listing top of mind.",
        overlay: "Swipe for the kitchen",
      },
      teaser: {
        label: "Property Teaser",
        format: "1:1 · 8 s",
        description: "A coming-soon hint before the listing goes live.",
        overlay: "Coming soon",
      },
      walkthrough: {
        label: "Virtual Walkthrough",
        format: "3D · interactive",
        description: "An immersive space buyers can explore remotely, room by room.",
        overlay: "Explore in 3D",
      },
      shortAd: {
        label: "Short-Form Ad",
        format: "9:16 · 6 s",
        description: "Punchy bumper ads for TikTok, Reels and YouTube.",
        overlay: "3 bd · Big backyard",
      },
    },
  },

  benefits: {
    eyebrow: "Why agents use it",
    headline: [
      { text: "Built for agents who want more content —" },
      { text: "without more ", accent: "work." },
    ],
    items: {
      more: {
        title: "More content",
        description: "Turn one listing into multiple marketing assets — reels, stories, ads and more.",
      },
      fast: {
        title: "Fast delivery",
        description: "Content delivered in approximately 24 hours. No shoot to schedule.",
        timeline: ["Upload", "Production", "Ready"],
      },
      ready: {
        title: "Ready to post",
        description: "Captions, formatting and branding included.",
      },
      cost: {
        title: "Lower production cost",
        description: "Professional content without organizing a complete shoot.",
      },
      consistent: {
        title: "Stay consistent",
        description: "Publish regularly, even during your busiest weeks.",
        days: ["M", "T", "W", "T", "F", "S", "S"],
      },
      brand: {
        title: "Your brand",
        description: "Logo, colors, name and contact details integrated into every video.",
      },
      social: {
        title: "Social first",
        description: "Designed for Reels, Shorts, TikTok and paid social.",
      },
      scale: {
        title: "Scale",
        description: "One property or an entire portfolio — same quality, same simplicity.",
        listings: "{count} listings",
      },
    },
  },

  services: {
    eyebrow: "Services",
    headline: [{ text: "More than ", accent: "listing videos." }],
    description: "One partner for the content your listings and your personal brand need.",
    quote: "Custom quote",
    items: {
      listing: {
        title: "AI Listing Video",
        description: "Turn listing photos into cinematic social videos with music, captions and your branding.",
        cta: "Create Video",
        points: ["Vertical & widescreen", "Music & captions", "About 24h delivery"],
      },
      walkthrough: {
        title: "3D / Virtual Walkthrough",
        description:
          "An immersive digital property experience that lets buyers explore the space remotely.",
        cta: "Learn More",
        points: ["Explore room by room", "Shareable link", "Add to any listing"],
      },
      ugc: {
        title: "AI UGC",
        description:
          "Social-style videos featuring you — built from your approved likeness and content.",
        cta: "Learn More",
        points: ["Agent introductions", "Property promotion", "Educational content"],
      },
      ads: {
        title: "AI Video Ads",
        description: "Video creatives designed for Meta, Instagram, Facebook and TikTok campaigns.",
        cta: "Talk to Us",
        points: ["Hook-first creative", "Multiple variations", "Planned with you"],
      },
    },
  },

  pricing: {
    eyebrow: "Pricing",
    headline: [{ text: "Content that fits ", accent: "your business." }],
    description: "Simple plans. Clear limits. No hidden fees.",
    offer: {
      badge: "Limited launch offer",
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
        cta: "Create One Video",
        features: ["1 professional listing video", "Captions", "Music", "Branding", "Social formats", "Approximately 24h delivery"],
      },
      agent: {
        name: "Agent",
        tagline: "For agents listing every month.",
        cta: "Choose Agent",
        features: [
          "4 videos per month",
          "Professional listing videos",
          "Captions & music",
          "Agent branding",
          "Social formats",
          "Client platform & project history",
          "Content delivery",
          "Content ideas",
        ],
      },
      pro: {
        name: "Pro",
        tagline: "For high-volume agents and teams.",
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
      walkthrough: { name: "3D Virtual Walkthrough", price: "+{price}" },
      ads: { name: "Custom AI Ads", price: "Talk to us" },
    },
    limitsNote: "Unused videos don't roll over. Need more than 10 a month? Talk to us.",
  },

  results: {
    eyebrow: "Results",
    headline: [{ text: "Created for real estate." }, { text: "Built for real ", accent: "results." }],
    description: "Every project is tracked from upload to delivery — here's what that looks like.",
    photos: "{count} photos",
    video: "{count} sec video",
    delivered: "Delivered in {count}h",
    metrics: { views: "Views", likes: "Likes", shares: "Shares", saves: "Saves" },
    demoNotice:
      "Layout preview with placeholder content. Real client stories will replace these cards.",
    empty: {
      title: "Be one of our first featured agents.",
      description:
        "We're collecting stories from our launch clients. Create your first video free — and if you love it, we'd love to feature it here.",
    },
    demo: [
      {
        quote:
          "Placeholder quote — the agent's own words about their first delivered video will appear here.",
        name: "Demo agent",
        role: "Brokerage name",
        property: "Sample property",
      },
      {
        quote:
          "Placeholder quote — a short, specific sentence about speed, quality or results goes here.",
        name: "Demo agent",
        role: "Brokerage name",
        property: "Sample condo",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    headline: [{ text: "Questions, ", accent: "answered." }],
    stillQuestions: "Still have a question?",
    contact: "Write to us",
    items: [
      {
        q: "How does it work?",
        a: "Create a project, upload your listing photos and pick a style. Our team produces your video using professional editing and AI-assisted motion, then delivers it to your account — usually within about 24 hours.",
      },
      {
        q: "What do I need to send you?",
        a: "Your listing photos (ideally 10–25, high resolution). Optionally: your headshot, logo, listing details and any video clips you already have. If you've set up your Brand Kit, your branding is applied automatically.",
      },
      {
        q: "How quickly will I receive my video?",
        a: "Most videos are delivered in approximately 24 hours after you submit your project. Delivery can take longer during peak periods or for complex requests — you'll always see the live status in your dashboard.",
      },
      {
        q: "Can I request changes?",
        a: "Yes. Every video includes a revision round. Tell us what you'd like changed directly on the project and we'll handle it.",
      },
      {
        q: "Can you add my logo and branding?",
        a: "Yes. Your logo, colors, name, photo and contact details can be added to every video. Save them once in your Brand Kit and they're reused automatically.",
      },
      {
        q: "Which social platforms are supported?",
        a: "Videos are formatted for Instagram Reels and Stories, Facebook, TikTok, YouTube Shorts and paid social. Widescreen versions are available for YouTube and websites.",
      },
      {
        q: "What happens after my free video?",
        a: "Nothing, unless you want more. There's no card on file and no automatic charge. If you love it, you can buy single videos or choose a monthly plan.",
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes, anytime from your account. Your plan stays active until the end of the current billing period.",
      },
      {
        q: "What is included in the Agent plan?",
        a: "4 professional listing videos per month with captions, music, agent branding and social formats, plus the client platform, project history, content delivery and monthly content ideas.",
      },
      {
        q: "What is included in the Pro plan?",
        a: "Everything in Agent, up to 10 videos per month, priority production, advanced content options and full platform access.",
      },
      {
        q: "Do you offer AI UGC?",
        a: "Yes. We create social-style videos featuring you — agent introductions, property promotion and educational content — built only from likeness and material you've approved.",
      },
      {
        q: "Do you create advertisements?",
        a: "Yes. We design video ad creatives for Meta, Instagram, Facebook and TikTok. Because every campaign is different, we start with a short conversation — talk to us for a quote.",
      },
      {
        q: "How does the virtual walkthrough work?",
        a: "From your photos and floor information, we create an immersive digital experience that buyers can explore remotely. It's available as a {walkthroughPrice} add-on to any listing.",
      },
    ],
  },

  finalCta: {
    headline: [{ text: "Your next listing deserves" }, { text: "more than ", accent: "photos." }],
    supporting: "Turn your listing into content people want to watch.",
  },

  footer: {
    tagline: "Professional listing videos. Without the shoot.",
    product: "Product",
    company: "Company",
    account: "Account",
    legal: "Legal",
    about: "About",
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
