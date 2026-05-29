import { Service, Zone, Realisation, Testimonial, FaqItem, SiteSettings } from './types';

export const defaultSiteSettings: SiteSettings = {
  businessName: "AB Couvreur — Antibes & Côte d'Azur",
  phone: "07 77 39 30 18",
  email: "",
  address: "Antibes, Alpes-Maritimes (06)",
  chaletAddress: "Antibes, Alpes-Maritimes (06)",
  siret: "",
  decennale: "Garantie décennale incluse",
  yearsExperience: 15,
};

const ANTIBES_ZONES_TEXT =
  "Antibes, Juan-les-Pins, Cap d'Antibes, La Fontonne, Cannes, Le Cannet, Mougins, Mandelieu-la-Napoule, Vallauris, Golfe-Juan, Biot, Sophia Antipolis, Valbonne, Opio, Roquefort-les-Pins, Villeneuve-Loubet, Cagnes-sur-Mer, Saint-Laurent-du-Var et Nice.";

const sharedFaqs = (label: string) => [
  {
    question: `Intervenez-vous pour ${label} autour d'Antibes ?`,
    answer: `Oui. AB Couvreur se déplace quotidiennement à ${ANTIBES_ZONES_TEXT} Le devis et le diagnostic sur site sont gratuits.`,
  },
  {
    question: "Le devis est-il vraiment gratuit ?",
    answer: "Oui. Nous nous déplaçons sans engagement pour évaluer la toiture, expliquer les points sensibles, photographier les zones concernées et chiffrer précisément les travaux. Aucun frais de diagnostic n'est facturé.",
  },
  {
    question: "Sous quel délai pouvez-vous intervenir ?",
    answer: "Pour une urgence (fuite active, tempête, bâchage), nous intervenons en général sous 24 à 48 h sur l'ensemble du bassin antibois. Pour un chantier planifié (rénovation, isolation, Velux), nous fixons une date après validation du devis.",
  },
  {
    question: "Êtes-vous assurés en garantie décennale ?",
    answer: "Oui. Nos travaux de couverture, zinguerie, étanchéité et isolation bénéficient d'une garantie décennale. L'attestation d'assurance est remise sur simple demande avec le devis.",
  },
];

export const defaultServices: Service[] = [
  {
    id: "toiture",
    title: "Couverture & rénovation de toiture",
    slug: "couverture-toiture-antibes",
    shortDescription:
      "Pose, rénovation et réparation de toitures tuiles, ardoises, zinc ou bac acier sur villas, maisons de ville et immeubles du bassin antibois.",
    longDescription:
      "Restaurez l'éclat et l'étanchéité de votre toiture avec AB Couvreur, artisan couvreur installé à Antibes. Nous inspectons l'intégralité du support, contrôlons faîtages, rives, noues et solins, choisissons le matériau adapté à votre bâti — tuiles canal provençales, tuiles mécaniques, ardoises, zinc, bac acier — et réalisons une couverture durable, ventilée et parfaitement étanche. Notre méthode reprend les exigences d'une couverture artisanale traditionnelle en les adaptant au climat du littoral azuréen : soleil intense, embruns marins, épisodes méditerranéens et coups de mistral.",
    icon: "Hammer",
    image: "/assets/ab-source/ab-13.webp",
    priceEstimate: "Sur devis gratuit",
    durationEstimate: "Selon diagnostic",
    seoTitle: "Couverture & rénovation toiture Antibes, Cannes, Nice | AB Couvreur",
    seoDescription:
      "Couvreur à Antibes pour rénovation et pose de toiture en tuiles, ardoises, zinc ou bac acier. Diagnostic et devis gratuits dans tout le 06.",
    faqs: sharedFaqs("la rénovation de toiture"),
  },
  {
    id: "recherche-fuite",
    title: "Recherche de fuite & dépannage",
    slug: "recherche-fuite-toiture-antibes",
    shortDescription:
      "Localisation rapide d'infiltration, traces d'humidité, solins abîmés, noues encombrées ou raccords de Velux défaillants.",
    longDescription:
      "Une fuite de toiture ne se traite jamais au hasard. Nous contrôlons méthodiquement les tuiles cassées, faîtages descellés, rives ouvertes, gouttières débordantes, abergements de cheminée, raccords de Velux et points de zinguerie afin d'identifier la véritable origine de l'eau avant toute réparation. En cas d'orage méditerranéen ou de pluies cévenoles soudaines, nous proposons une mise en sécurité immédiate puis une réparation durable une fois la cause précisément localisée.",
    icon: "Droplets",
    image: "/assets/ab-source/ab-19.webp",
    priceEstimate: "Diagnostic gratuit",
    durationEstimate: "Urgence 24/48 h",
    seoTitle: "Recherche de fuite toiture Antibes | Dépannage rapide 06",
    seoDescription:
      "Fuite de toit, infiltration ou tuile cassée à Antibes, Cannes ou Nice ? Diagnostic gratuit et intervention sous 24 à 48 h par AB Couvreur.",
    faqs: sharedFaqs("la recherche de fuite"),
  },
  {
    id: "bachage-toiture",
    title: "Bâchage de toiture",
    slug: "bachage-toiture-antibes",
    shortDescription:
      "Protection provisoire après sinistre, tempête, infiltration ou chantier ouvert sur le littoral antibois.",
    longDescription:
      "Le bâchage est une solution temporaire indispensable pour protéger une toiture en cas de sinistre, de travaux ou d'intempéries. Il préserve l'étanchéité du bâtiment en attendant la réparation définitive. Nous posons une bâche imperméable adaptée — polyéthylène armé, PVC renforcé selon la nature du support — tendue, lestée et fixée par liteaux ou sangles pour résister aux vents de mer. Le bâchage limite les dégâts sur la charpente, l'isolation et les pièces intérieures, et sécurise rapidement le chantier.",
    icon: "ShieldAlert",
    image: "/assets/ab-source/ab-12.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Intervention rapide",
    seoTitle: "Bâchage de toiture Antibes, Cannes | Urgence intempéries AB Couvreur",
    seoDescription:
      "Bâchage rapide de toiture après sinistre ou tempête à Antibes, Cannes, Nice. AB Couvreur intervient en urgence dans tout le 06.",
    faqs: sharedFaqs("le bâchage de toiture"),
  },
  {
    id: "mise-en-securite-toiture",
    title: "Mise en sécurité toiture",
    slug: "mise-en-securite-toiture-antibes",
    shortDescription:
      "Stabilisation d'une toiture endommagée, évacuation des éléments dangereux et protection du logement après sinistre.",
    longDescription:
      "La mise en sécurité d'une toiture est une intervention visant à protéger un bâtiment après un sinistre — tempête, incendie, effondrement partiel, infiltration importante — ou avant des travaux lourds. Elle évite l'aggravation des dégâts en combinant bâchage, contrôle des zones fragiles, consolidation temporaire de la charpente, évacuation des débris et, si nécessaire, pose d'un dispositif de sécurisation des personnes. AB Couvreur établit un diagnostic, applique les mesures provisoires, sécurise les intervenants et prépare la réparation définitive.",
    icon: "AlertTriangle",
    image: "/assets/ab-source/ab-11.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Sous 24 h selon urgence",
    seoTitle: "Mise en sécurité toiture Antibes | Sinistre & tempête 06",
    seoDescription:
      "Mise en sécurité de toiture après sinistre à Antibes, Cannes, Nice. AB Couvreur stabilise, bâche et sécurise sous 24 h.",
    faqs: sharedFaqs("la mise en sécurité"),
  },
  {
    id: "nettoyage-toiture",
    title: "Nettoyage toiture",
    slug: "nettoyage-toiture-antibes",
    shortDescription:
      "Démoussage, brossage et traitement adapté aux tuiles, ardoises, zinc et couvertures anciennes du sud-est.",
    longDescription:
      "Au fil des saisons, votre toiture est soumise aux intempéries, à la pollution littorale, aux embruns, aux dépôts de mousses, lichens et algues qui fragilisent les matériaux et compromettent l'étanchéité. Le nettoyage régulier préserve l'étanchéité, améliore l'esthétique et prolonge la durée de vie de la couverture. Notre méthode : inspection complète, nettoyage haute ou basse pression selon la nature du support, brossage manuel sur tuiles fragiles, puis application d'un traitement anti-mousse et hydrofuge certifié. Nous traitons aussi bien les villas du Cap d'Antibes que les toits provençaux de l'arrière-pays.",
    icon: "Sparkles",
    image: "/assets/ab-source/ab-16.webp",
    priceEstimate: "Au m² après visite",
    durationEstimate: "1 à 2 jours",
    seoTitle: "Nettoyage toiture Antibes, Cannes, Nice | Démoussage AB Couvreur",
    seoDescription:
      "Nettoyage et démoussage de toiture à Antibes, Cannes, Nice. Traitement anti-mousse et hydrofuge par AB Couvreur. Devis gratuit.",
    faqs: sharedFaqs("le nettoyage de toiture"),
  },
  {
    id: "hydrofuge-toiture",
    title: "Traitement hydrofuge coloré",
    slug: "hydrofuge-toiture-antibes",
    shortDescription:
      "Protection incolore ou colorée pour ralentir la porosité, prévenir le retour des mousses et limiter les infiltrations.",
    longDescription:
      "Après un nettoyage en profondeur, l'application d'un hydrofuge crée une barrière respirante qui aide l'eau à perler sur la tuile au lieu de pénétrer le matériau. Nous proposons des hydrofuges certifiés en versions incolores ou colorées, respectueux de l'environnement. Ce traitement prolonge la durée de vie de la couverture, ralentit le retour des mousses, améliore la résistance aux UV intenses du littoral et aux pluies méditerranéennes. Une finition colorée permet aussi de redonner un coup de jeune à des tuiles ternies par le soleil.",
    icon: "Shield",
    image: "/assets/ab-source/ab-15.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "1 jour",
    seoTitle: "Hydrofuge toiture coloré Antibes, Cannes | AB Couvreur",
    seoDescription:
      "Traitement hydrofuge coloré ou incolore pour toiture à Antibes, Cannes, Nice. Protection durable contre les mousses et infiltrations.",
    faqs: sharedFaqs("le traitement hydrofuge"),
  },
  {
    id: "zinguerie",
    title: "Zinguerie de toiture",
    slug: "zinguerie-antibes",
    shortDescription:
      "Solins, noues, abergements, chéneaux, rives et raccords métalliques pour une évacuation fiable des eaux pluviales.",
    longDescription:
      "La zinguerie assure toutes les jonctions sensibles d'une toiture : raccord avec les cheminées, abergement de fenêtre de toit, descente de gouttière, chéneau de villa ou solin de mur mitoyen. Nous façonnons sur mesure et réparons les éléments en zinc, cuivre ou aluminium qui protègent ces points de ruissellement. Une zinguerie bien posée et bien entretenue est la clé d'une toiture qui ne fuit jamais, même lors des épisodes méditerranéens les plus violents.",
    icon: "Wrench",
    image: "/assets/ab-source/ab-09.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "1 à 3 jours",
    seoTitle: "Zinguerie Antibes, Cannes, Nice | Solins & noues AB Couvreur",
    seoDescription:
      "Travaux de zinguerie à Antibes : solins, noues, abergements, chéneaux. AB Couvreur intervient à Cannes, Nice et dans tout le 06.",
    faqs: sharedFaqs("les travaux de zinguerie"),
  },
  {
    id: "gouttieres",
    title: "Pose & réparation de gouttières",
    slug: "gouttieres-antibes",
    shortDescription:
      "Installation, nettoyage et remplacement de gouttières en zinc, aluminium ou PVC sur toute la Côte d'Azur.",
    longDescription:
      "Une gouttière mal dimensionnée, encombrée par les feuilles de pin ou les aiguilles de cyprès provoque débordements, humidité de façade et infiltrations en bas de mur. Nous contrôlons la pente, les descentes, les fixations, l'écoulement complet jusqu'au regard. Nous remplaçons les éléments percés ou déformés et nous proposons des grilles de protection adaptées aux jardins méditerranéens.",
    icon: "Activity",
    image: "/assets/ab-source/ab-10.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "1 à 3 jours",
    seoTitle: "Gouttières Antibes, Cannes, Nice | Pose & nettoyage AB Couvreur",
    seoDescription:
      "Pose, nettoyage et remplacement de gouttières à Antibes, Cannes, Nice. Zinc, aluminium ou PVC, devis gratuit AB Couvreur.",
    faqs: sharedFaqs("la pose et la réparation de gouttières"),
  },
  {
    id: "charpente",
    title: "Charpente bois & métal",
    slug: "charpente-antibes",
    shortDescription:
      "Contrôle, réparation et renforcement de charpente traditionnelle, à fermettes ou métallique.",
    longDescription:
      "La charpente est l'ossature qui supporte toute la couverture du toit : poutres, chevrons, fermes, arbalétriers, liteaux. Elle assure la solidité, la sécurité et la durabilité de la couverture. Nous intervenons sur les trois grandes familles — charpente traditionnelle à fermes (idéale pour les villas anciennes et mas provençaux), charpente industrielle à fermettes (plus rapide à installer) et charpente métallique (très résistante pour grandes portées). Avant toute rénovation, nous inspectons les pièces structurelles, traces d'humidité, déformations et attaques biologiques (capricornes, vrillettes) afin de proposer la consolidation adaptée.",
    icon: "Hammer",
    image: "/assets/ab-source/ab-17.webp",
    priceEstimate: "Diagnostic sur place",
    durationEstimate: "Selon structure",
    seoTitle: "Charpente Antibes, Cannes, Nice | Bois & métal AB Couvreur",
    seoDescription:
      "Charpente traditionnelle, fermettes ou métallique à Antibes, Cannes, Nice. Diagnostic, renforcement et création par AB Couvreur.",
    faqs: sharedFaqs("les travaux de charpente"),
  },
  {
    id: "isolation-toiture",
    title: "Isolation toiture & combles",
    slug: "isolation-toiture-antibes",
    shortDescription:
      "Isolation des combles, rampants et toitures pour un meilleur confort thermique et une vraie économie d'énergie.",
    longDescription:
      "Une bonne isolation est essentielle pour limiter les pertes de chaleur l'hiver, freiner la surchauffe l'été dans le sud, réduire votre consommation énergétique et améliorer votre confort au quotidien. Nous adaptons la solution à la toiture et au mode de vie : laine minérale soufflée, panneaux en laine de roche, isolant mince ou solution sarking lors d'une réfection complète. Cette étape est cruciale sur la Côte d'Azur où les écarts entre nuits hivernales et journées estivales mettent le bâti à rude épreuve.",
    icon: "ShieldCheck",
    image: "/assets/ab-source/ab-18.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon surface",
    seoTitle: "Isolation toiture & combles Antibes, Cannes, Nice | AB Couvreur",
    seoDescription:
      "Isolation toiture et combles à Antibes : laine de verre, laine de roche, sarking. Confort thermique été comme hiver. Devis gratuit.",
    faqs: sharedFaqs("l'isolation de toiture"),
  },
  {
    id: "sarking",
    title: "Isolation Sarking",
    slug: "sarking-antibes",
    shortDescription:
      "Isolation de toiture par l'extérieur lors d'une réfection complète, sans perte d'espace habitable.",
    longDescription:
      "Le sarking consiste à isoler la toiture par l'extérieur, sur la charpente, avant la repose d'une nouvelle couverture. Cette technique haut de gamme permet d'obtenir une continuité thermique parfaite, sans pont thermique, sans réduire l'espace intérieur. Idéale lors d'une rénovation lourde ou d'une création de combles aménagés sur villa antiboise, elle associe écran sous-toiture, isolant performant et nouvelle couverture homogène.",
    icon: "ShieldCheck",
    image: "/assets/ab-source/ab-12.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Chantier planifié",
    seoTitle: "Isolation Sarking Antibes, Cannes | Toiture par l'extérieur",
    seoDescription:
      "Isolation Sarking de toiture à Antibes, Cannes, Nice. Solution haut de gamme par l'extérieur lors d'une réfection complète.",
    faqs: sharedFaqs("l'isolation Sarking"),
  },
  {
    id: "laine-de-verre",
    title: "Isolation laine de verre",
    slug: "laine-de-verre-antibes",
    shortDescription:
      "Pose d'un isolant performant et économique pour combles perdus et rampants.",
    longDescription:
      "La laine de verre reste une solution efficace, économique et polyvalente pour limiter les déperditions thermiques et améliorer le confort acoustique. Posée en rouleaux, en panneaux ou soufflée dans les combles perdus, elle convient à la grande majorité des villas et appartements de la région antiboise.",
    icon: "Shield",
    image: "/assets/ab-source/ab-11.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon accès",
    seoTitle: "Isolation laine de verre Antibes, Cannes | AB Couvreur",
    seoDescription:
      "Isolation laine de verre des combles à Antibes, Cannes, Nice. Confort thermique et acoustique, pose par AB Couvreur.",
    faqs: sharedFaqs("l'isolation en laine de verre"),
  },
  {
    id: "laine-de-roche",
    title: "Isolation laine de roche",
    slug: "laine-de-roche-antibes",
    shortDescription:
      "Isolation thermique, acoustique et résistante au feu pour toitures et combles.",
    longDescription:
      "La laine de roche convient particulièrement aux toitures, combles et parois qui exigent une bonne tenue dans le temps et une protection renforcée contre la chaleur. Sa densité offre un excellent confort d'été — atout précieux sur la Côte d'Azur — et améliore l'isolation acoustique face aux nuisances urbaines.",
    icon: "Shield",
    image: "/assets/ab-source/ab-11.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon accès",
    seoTitle: "Isolation laine de roche Antibes, Cannes | AB Couvreur",
    seoDescription:
      "Isolation laine de roche pour toiture et combles à Antibes, Cannes, Nice. Performance été/hiver, sécurité incendie.",
    faqs: sharedFaqs("l'isolation en laine de roche"),
  },
  {
    id: "velux",
    title: "Fenêtres de toit Velux",
    slug: "velux-antibes",
    shortDescription:
      "Pose, remplacement, entretien et étanchéité de fenêtres de toit pour combles aménagés.",
    longDescription:
      "L'installation d'une fenêtre de toit Velux apporte lumière naturelle, ventilation et valorisation aux combles. Elle ne doit jamais créer de point faible sur la couverture. Nous traitons l'ouverture dans la charpente, l'habillage intérieur, le raccord d'étanchéité avec la couverture existante et l'évacuation des eaux. Une pose soignée est la garantie d'une fenêtre durable et sans infiltration, même lors des grosses pluies azuréennes.",
    icon: "FileText",
    image: "/assets/ab-source/ab-19.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "1 à 2 jours",
    seoTitle: "Velux Antibes, Cannes, Nice | Pose & remplacement AB Couvreur",
    seoDescription:
      "Pose, remplacement et étanchéité de Velux à Antibes, Cannes, Nice. AB Couvreur installe vos fenêtres de toit dans tout le 06.",
    faqs: sharedFaqs("la pose de Velux"),
  },
  {
    id: "velux-electrique",
    title: "Velux électrique",
    slug: "velux-electrique-antibes",
    shortDescription:
      "Fenêtres de toit motorisées pour un confort d'ouverture et une ventilation contrôlée.",
    longDescription:
      "Le Velux électrique facilite l'usage quotidien, particulièrement dans les combles hauts ou les vérandas. Nous assurons la pose, le raccordement électrique, le réglage des automatismes et la vérification des raccords d'étanchéité.",
    icon: "FileText",
    image: "/assets/ab-source/ab-19.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon modèle",
    seoTitle: "Velux électrique Antibes, Cannes | Motorisé AB Couvreur",
    seoDescription:
      "Velux électrique motorisé à Antibes, Cannes, Nice. Pose et raccordement par AB Couvreur, devis gratuit.",
    faqs: sharedFaqs("la pose de Velux électrique"),
  },
  {
    id: "velux-solaire",
    title: "Velux solaire",
    slug: "velux-solaire-antibes",
    shortDescription:
      "Fenêtre de toit autonome alimentée par énergie solaire, idéale en rénovation.",
    longDescription:
      "Le Velux solaire évite souvent un raccordement électrique lourd et profite pleinement de l'ensoleillement de la Côte d'Azur. Il améliore l'aération des combles avec une solution moderne, écologique et pratique. Pose rapide, batterie intégrée, télécommande fournie.",
    icon: "Sparkles",
    image: "/assets/ab-source/ab-19.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon modèle",
    seoTitle: "Velux solaire Antibes, Cannes | Énergie solaire AB Couvreur",
    seoDescription:
      "Velux solaire autonome à Antibes, Cannes, Nice. Idéal en rénovation, profite du soleil méditerranéen. Pose AB Couvreur.",
    faqs: sharedFaqs("la pose de Velux solaire"),
  },
  {
    id: "velux-rotation",
    title: "Velux à rotation",
    slug: "velux-rotation-antibes",
    shortDescription:
      "Fenêtre de toit polyvalente pour combles et pièces sous toiture, ouverture par rotation.",
    longDescription:
      "Le Velux à rotation offre un compromis idéal entre luminosité, ventilation et accessibilité. Nous assurons la pose et tous les raccords adaptés à la couverture (tuiles canal, tuiles mécaniques, ardoises, zinc).",
    icon: "RotateCcw",
    image: "/assets/ab-source/ab-19.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "1 à 2 jours",
    seoTitle: "Velux à rotation Antibes, Cannes, Nice | AB Couvreur",
    seoDescription:
      "Velux à rotation, modèle polyvalent pour combles. Pose à Antibes, Cannes, Nice par AB Couvreur. Devis gratuit.",
    faqs: sharedFaqs("la pose de Velux à rotation"),
  },
  {
    id: "bac-acier",
    title: "Bac acier",
    slug: "bac-acier-antibes",
    shortDescription:
      "Couverture métallique légère, résistante et rapide à poser pour dépendances, extensions et bâtiments.",
    longDescription:
      "Le bac acier convient aux dépendances, extensions, vérandas, bâtiments professionnels et certaines habitations contemporaines. Il peut être simple peau, isolé ou imitation tuile selon le rendu souhaité. Léger et résistant, il s'adapte parfaitement aux contraintes du littoral azuréen lorsque la finition anticorrosion est correctement choisie.",
    icon: "Shield",
    image: "/assets/ab-source/ab-09.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon surface",
    seoTitle: "Bac acier Antibes, Cannes, Nice | Toiture métallique AB Couvreur",
    seoDescription:
      "Pose de toiture bac acier à Antibes, Cannes, Nice. Simple peau, isolé ou imitation tuile. Devis gratuit AB Couvreur.",
    faqs: sharedFaqs("la pose de bac acier"),
  },
  {
    id: "bac-acier-isole",
    title: "Bac acier isolé",
    slug: "bac-acier-isole-antibes",
    shortDescription:
      "Panneaux métalliques avec isolation intégrée pour une toiture performante en une seule pose.",
    longDescription:
      "Le bac acier isolé combine résistance, rapidité de pose et confort thermique. Il réduit la condensation et améliore l'efficacité énergétique du bâtiment, particulièrement intéressant pour les bâtiments commerciaux ou les extensions modernes du bassin antibois.",
    icon: "ShieldCheck",
    image: "/assets/ab-source/ab-09.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon surface",
    seoTitle: "Bac acier isolé Antibes, Cannes | AB Couvreur",
    seoDescription:
      "Bac acier isolé pour toiture professionnelle ou résidentielle à Antibes, Cannes, Nice. Performance et rapidité de pose.",
    faqs: sharedFaqs("la pose de bac acier isolé"),
  },
  {
    id: "ardoise-naturelle",
    title: "Ardoise naturelle",
    slug: "ardoise-naturelle-antibes",
    shortDescription:
      "Couverture élégante, durable et haut de gamme pour un cachet patrimonial irréprochable.",
    longDescription:
      "L'ardoise naturelle apporte une excellente longévité (souvent plus d'un siècle) et une esthétique forte. Sa pose demande précision, calepinage minutieux, choix de crochets adaptés au climat méditerranéen et ventilation correcte sous toiture. Idéale pour les villas de caractère et les bâtiments patrimoniaux.",
    icon: "Sparkles",
    image: "/assets/ab-source/ab-17.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Chantier planifié",
    seoTitle: "Ardoise naturelle Antibes, Cannes | AB Couvreur",
    seoDescription:
      "Pose d'ardoise naturelle pour villa de caractère à Antibes, Cannes, Nice. Haut de gamme et longévité. AB Couvreur.",
    faqs: sharedFaqs("la pose d'ardoise naturelle"),
  },
  {
    id: "ardoise-artificielle",
    title: "Ardoise artificielle",
    slug: "ardoise-artificielle-antibes",
    shortDescription:
      "Alternative plus légère et économique à l'ardoise naturelle, parfaite en rénovation.",
    longDescription:
      "L'ardoise artificielle imite parfaitement l'aspect traditionnel avec une pose plus simple et un coût maîtrisé. Elle convient à de nombreuses rénovations résidentielles tout en conservant un rendu noble.",
    icon: "Sparkles",
    image: "/assets/ab-source/ab-17.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Chantier planifié",
    seoTitle: "Ardoise artificielle Antibes, Cannes | AB Couvreur",
    seoDescription:
      "Ardoise artificielle pour toiture à Antibes, Cannes, Nice. Aspect noble, coût maîtrisé. Pose par AB Couvreur.",
    faqs: sharedFaqs("la pose d'ardoise artificielle"),
  },
  {
    id: "tuiles-mecaniques",
    title: "Tuiles mécaniques",
    slug: "tuiles-mecaniques-antibes",
    shortDescription:
      "Pose et remplacement de tuiles mécaniques à emboîtement, solution moderne et homogène.",
    longDescription:
      "Les tuiles mécaniques offrent une excellente tenue grâce à leur système d'emboîtement et permettent une pose régulière. Nous remplaçons les éléments cassés et reprenons les zones sensibles (rives, faîtages, abergements) avec des tuiles assorties à votre couverture existante.",
    icon: "Hammer",
    image: "/assets/ab-source/ab-16.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon surface",
    seoTitle: "Tuiles mécaniques Antibes, Cannes, Nice | AB Couvreur",
    seoDescription:
      "Pose et remplacement de tuiles mécaniques à Antibes, Cannes, Nice. Couverture homogène, devis gratuit AB Couvreur.",
    faqs: sharedFaqs("la pose de tuiles mécaniques"),
  },
  {
    id: "tuiles-plates",
    title: "Tuiles plates",
    slug: "tuiles-plates-antibes",
    shortDescription:
      "Couverture traditionnelle avec finition soignée, parfaite pour les bâtiments à caractère.",
    longDescription:
      "La tuile plate exige une pose précise et un bon recouvrement. Elle convient particulièrement aux toitures à caractère patrimonial ou aux rénovations exigeantes où la finesse du calepinage est essentielle.",
    icon: "Hammer",
    image: "/assets/ab-source/ab-15.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon surface",
    seoTitle: "Tuiles plates Antibes, Cannes, Nice | AB Couvreur",
    seoDescription:
      "Pose de tuiles plates traditionnelles à Antibes, Cannes, Nice. Finition haut de gamme par AB Couvreur.",
    faqs: sharedFaqs("la pose de tuiles plates"),
  },
  {
    id: "etancheite-toiture",
    title: "Étanchéité de toiture (toit-terrasse)",
    slug: "etancheite-toiture-antibes",
    shortDescription:
      "Étanchéité bitumineuse, EPDM ou multicouche pour toits plats, terrasses, annexes et zones sensibles.",
    longDescription:
      "L'étanchéité parfaite d'une toiture-terrasse est une condition essentielle pour préserver le bâtiment des infiltrations d'eau, des moisissures et des pertes thermiques. Nous utilisons des matériaux professionnels — bitume élastomère, membranes EPDM, complexes multicouches — adaptés aux toitures plates, inclinées, industrielles ou résidentielles très présentes dans l'architecture contemporaine du bassin antibois. Avant application : contrôle des relevés, évacuations, points singuliers et compatibilité du support.",
    icon: "Droplets",
    image: "/assets/ab-source/ab-14.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon support",
    seoTitle: "Étanchéité toiture-terrasse Antibes, Cannes | AB Couvreur",
    seoDescription:
      "Étanchéité de toiture-terrasse à Antibes, Cannes, Nice. Bitume, EPDM, multicouche. Protection durable AB Couvreur.",
    faqs: sharedFaqs("l'étanchéité de toiture-terrasse"),
  },
  {
    id: "ravalement-facade",
    title: "Ravalement de façade",
    slug: "ravalement-facade-antibes",
    shortDescription:
      "Nettoyage, réparation et protection de façade en complément naturel des travaux de toiture.",
    longDescription:
      "Avec le temps, votre façade subit les agressions climatiques, la pollution, les fissures et le développement de mousses ou salissures. Un ravalement offre une protection contre l'humidité, prolonge la durée de vie des murs et valorise le patrimoine immobilier. Nos étapes : diagnostic précis (fissures, cloquages, décollements, porosité), nettoyage profond par hydrogommage ou haute pression, traitements curatifs (anti-mousse, anti-humidité, hydrofuge coloré), réparation des fissures et joints, puis revêtement de finition (enduits projetés, crépis, peintures microporeuses). Une façade saine prolonge directement la performance de votre toiture.",
    icon: "Sparkles",
    image: "/assets/ab-source/ab-14.webp",
    priceEstimate: "Sur devis",
    durationEstimate: "Selon façade",
    seoTitle: "Ravalement de façade Antibes, Cannes, Nice | AB Couvreur",
    seoDescription:
      "Ravalement de façade à Antibes, Cannes, Nice. Nettoyage, traitement, finition. Devis gratuit par AB Couvreur.",
    faqs: sharedFaqs("le ravalement de façade"),
  },
];

export const defaultZones: Zone[] = [
  {
    id: "antibes",
    city: "Antibes",
    postalCode: "06600",
    slug: "couvreur-antibes",
    localIntro:
      "Couvreur à Antibes, Juan-les-Pins, Cap d'Antibes et La Fontonne pour réparation de toiture, recherche de fuite, entretien, pose de Velux, zinguerie et interventions d'urgence.",
    distance: "Zone principale",
    h1: "Couvreur à Antibes et Juan-les-Pins",
    seoTitle: "Couvreur à Antibes et Juan-les-Pins | AB Couvreur Alpes-Maritimes",
    seoDescription:
      "Couvreur à Antibes & Juan-les-Pins : réparation de toiture, fuite, Velux, zinguerie, nettoyage et rénovation. Devis gratuit au 07 77 39 30 18.",
    keyServices: ["recherche-fuite", "toiture", "nettoyage-toiture", "zinguerie", "velux", "bachage-toiture"],
  },
  {
    id: "cannes",
    city: "Cannes",
    postalCode: "06400",
    slug: "couvreur-cannes",
    localIntro:
      "Interventions à Cannes, Le Cannet, Mougins et Mandelieu-la-Napoule pour villas, immeubles haussmanniens et bâtiments professionnels.",
    distance: "Environ 12 km",
    h1: "Couvreur à Cannes et Le Cannet",
    seoTitle: "Couvreur à Cannes et Le Cannet | AB Couvreur Alpes-Maritimes",
    seoDescription:
      "Couvreur à Cannes & Le Cannet : réparation, fuite, Velux, zinguerie, nettoyage et rénovation. Devis gratuit AB Couvreur 07 77 39 30 18.",
    keyServices: ["recherche-fuite", "toiture", "nettoyage-toiture", "zinguerie", "velux", "bachage-toiture"],
  },
  {
    id: "nice",
    city: "Nice",
    postalCode: "06000",
    slug: "couvreur-nice",
    localIntro:
      "Déplacements à Nice, Cagnes-sur-Mer, Saint-Laurent-du-Var et Villeneuve-Loubet pour fuite, nettoyage, gouttières et travaux complets de couverture.",
    distance: "Environ 20 km",
    h1: "Couvreur à Nice et alentours",
    seoTitle: "Couvreur à Nice et alentours | AB Couvreur Alpes-Maritimes",
    seoDescription:
      "Couvreur à Nice : recherche de fuite, Velux, zinguerie, nettoyage et rénovation. AB Couvreur, devis gratuit dans tout le 06.",
    keyServices: ["recherche-fuite", "toiture", "nettoyage-toiture", "zinguerie", "velux", "bachage-toiture"],
  },
  {
    id: "biot-vallauris",
    city: "Biot & Vallauris",
    postalCode: "06410 / 06220",
    slug: "couvreur-biot-vallauris",
    localIntro:
      "Zone de proximité immédiate : Biot, Vallauris, Golfe-Juan, Sophia Antipolis, Valbonne et Villeneuve-Loubet. Idéal pour interventions rapides et chantiers courts.",
    distance: "Moins de 10 km",
    h1: "Couvreur à Biot, Vallauris et Valbonne",
    seoTitle: "Couvreur à Biot, Vallauris, Valbonne | AB Couvreur 06",
    seoDescription:
      "Couvreur à Biot, Vallauris, Valbonne et Sophia Antipolis : fuite, Velux, zinguerie, rénovation. Devis gratuit AB Couvreur.",
    keyServices: ["recherche-fuite", "toiture", "nettoyage-toiture", "zinguerie", "velux", "bachage-toiture"],
  },
  {
    id: "mougins-valbonne",
    city: "Mougins & Valbonne",
    postalCode: "06250 / 06560",
    slug: "couvreur-mougins-valbonne",
    localIntro:
      "Interventions planifiées ou urgentes sur villas, résidences et bâtiments autour de Mougins, Valbonne, Opio et Roquefort-les-Pins.",
    distance: "Secteur Ouest 06",
    h1: "Couvreur à Mougins et Valbonne",
    seoTitle: "Couvreur à Mougins et Valbonne | AB Couvreur Alpes-Maritimes",
    seoDescription:
      "Couvreur à Mougins, Valbonne, Opio : fuite, Velux, zinguerie, nettoyage et rénovation. Devis gratuit AB Couvreur.",
    keyServices: ["recherche-fuite", "toiture", "nettoyage-toiture", "zinguerie", "velux", "bachage-toiture"],
  },
];

export const defaultRealisations: Realisation[] = [
  {
    id: "photo-zinc-joint-debout",
    title: "Couverture zinc à joint debout",
    description:
      "Couverture en zinc à joint debout, profilés parfaitement alignés et abergements traités autour des sorties de toit.",
    image: "/assets/ab-source/ab-09.webp",
  },
  {
    id: "photo-zinguerie-detail",
    title: "Détail de zinguerie",
    description:
      "Reprise de zinguerie soignée : raccords métalliques, solins et finitions au niveau des points sensibles.",
    image: "/assets/ab-source/ab-10.webp",
  },
  {
    id: "photo-charpente-ecran",
    title: "Charpente & écran sous-toiture",
    description:
      "Charpente mise à nu, pose d'un écran sous-toiture neuf et liteaux prêts à recevoir les tuiles terre cuite stockées sur place.",
    image: "/assets/ab-source/ab-11.webp",
  },
  {
    id: "photo-tuiles-pose",
    title: "Pose de tuiles",
    description:
      "Couverture en cours de pose : calepinage régulier des tuiles, traitement soigné des rives et faîtage.",
    image: "/assets/ab-source/ab-12.webp",
  },
  {
    id: "photo-couverture-complete",
    title: "Toiture en finition",
    description:
      "Vue d'ensemble d'une toiture résidentielle en cours de finition. Pose homogène, rives nettes.",
    image: "/assets/ab-source/ab-13.webp",
  },
  {
    id: "photo-facade",
    title: "Façade exposée",
    description:
      "Façade marquée par les ruissellements et les salissures du temps — situation typique avant un nettoyage et un traitement hydrofuge.",
    image: "/assets/ab-source/ab-14.webp",
  },
  {
    id: "photo-tuiles-hydrofuge",
    title: "Tuiles après hydrofuge",
    description:
      "Tuiles canal anciennes après démoussage, brossage et application d'un hydrofuge : couleur ravivée et eau qui perle à nouveau.",
    image: "/assets/ab-source/ab-15.webp",
  },
  {
    id: "photo-nettoyage",
    title: "Démoussage de toiture",
    description:
      "Toiture en cours de nettoyage à pression contrôlée, retrait des mousses et lichens accumulés au fil des saisons.",
    image: "/assets/ab-source/ab-16.webp",
  },
  {
    id: "photo-charpente-traditionnelle",
    title: "Charpente bois traditionnelle",
    description:
      "Vue intérieure d'une charpente bois traditionnelle : pièces structurelles inspectées pour anticiper un éventuel renforcement.",
    image: "/assets/ab-source/ab-17.webp",
  },
  {
    id: "photo-isolation",
    title: "Isolation de combles",
    description:
      "Pose d'isolant en combles : meilleur confort thermique l'hiver et fraîcheur préservée l'été.",
    image: "/assets/ab-source/ab-18.webp",
  },
  {
    id: "photo-velux",
    title: "Fenêtre de toit Velux",
    description:
      "Velux posé en toiture avec raccord d'étanchéité et habillage intérieur — apport de lumière naturelle aux combles.",
    image: "/assets/ab-source/ab-19.webp",
  },
  {
    id: "photo-couverture-finition",
    title: "Couverture en finition haut de gamme",
    description:
      "Finition d'une couverture neuve : tuiles bien jointes, rives droites, ensemble prêt à affronter les intempéries méditerranéennes.",
    image: "/assets/ab-source/ab-20.webp",
  },
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    author: "Famille L.",
    rating: 5,
    comment: "Intervention claire, devis détaillé et chantier propre. L'équipe a pris le temps d'expliquer les points faibles de la toiture et nous a envoyé des photos chaque jour.",
    city: "Antibes",
    service: "Réparation toiture",
    date: "2026",
  },
  {
    id: "2",
    author: "Propriétaire villa",
    rating: 5,
    comment: "Diagnostic rapide après infiltration, mise en sécurité immédiate puis réparation définitive. Très rassurant et professionnel.",
    city: "Cannes",
    service: "Recherche de fuite",
    date: "2026",
  },
  {
    id: "3",
    author: "Client particulier",
    rating: 5,
    comment: "Nettoyage et traitement hydrofuge réalisés proprement. Les photos avant/après parlent d'elles-mêmes, et l'équipe a tout remis en état autour de la maison.",
    city: "Nice",
    service: "Nettoyage toiture",
    date: "2026",
  },
  {
    id: "4",
    author: "M. R.",
    rating: 5,
    comment: "Pose de Velux nickel, finition irréprochable et chantier sans débordement. Conseils avisés sur le modèle adapté.",
    city: "Juan-les-Pins",
    service: "Velux",
    date: "2026",
  },
];

export const defaultFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "AB Couvreur intervient-il vraiment autour d'Antibes ?",
    answer:
      "Oui. Notre antenne Côte d'Azur est basée à Antibes et intervient quotidiennement à Juan-les-Pins, Cannes, Nice, Biot, Vallauris, Mougins, Valbonne, Cagnes-sur-Mer et toutes les communes du bassin antibois.",
    category: "Intervention",
  },
  {
    id: "faq-2",
    question: "Le devis toiture est-il gratuit ?",
    answer:
      "Oui. Le diagnostic sur place et le devis sont entièrement gratuits et sans engagement. Le formulaire permet aussi de joindre des photos pour qualifier votre demande à distance avant la visite.",
    category: "Devis",
  },
  {
    id: "faq-3",
    question: "Quels travaux proposez-vous exactement ?",
    answer:
      "Couverture (tuiles, ardoises, zinc, bac acier), recherche de fuite, bâchage, mise en sécurité, nettoyage, hydrofuge, zinguerie, gouttières, charpente, isolation, sarking, Velux, étanchéité de toiture-terrasse et ravalement de façade.",
    category: "Services",
  },
  {
    id: "faq-4",
    question: "Que faire en cas de fuite pendant un orage méditerranéen ?",
    answer:
      "Ne montez surtout pas sur le toit, surtout par vent ou pluie. Placez seaux et serpillières sous la fuite, coupez l'électricité si nécessaire, puis appelez AB Couvreur pour organiser une mise en sécurité ou un bâchage, suivi d'une réparation durable.",
    category: "Urgence",
  },
  {
    id: "faq-5",
    question: "Êtes-vous assurés en garantie décennale ?",
    answer:
      "Oui. Tous nos travaux de couverture, zinguerie, étanchéité et isolation bénéficient d'une garantie décennale. L'attestation d'assurance peut être jointe au devis sur simple demande.",
    category: "Garanties",
  },
  {
    id: "faq-6",
    question: "Travaillez-vous avec les assurances après un sinistre ?",
    answer:
      "Oui. Nous établissons un rapport d'intervention détaillé, photographions chaque étape et fournissons les justificatifs nécessaires à votre compagnie d'assurance après tempête, incendie ou dégât des eaux.",
    category: "Assurance",
  },
];
