export interface ProgramItem {
  id: string;
  name: string;
  duration: string;
  regularFee: number;
  foundersFee: number;
  savings: number;
  description: string;
  highlights: string[];
  popular?: boolean;
  bestValue?: boolean;
}

export interface BrochureCategory {
  id: "boutique" | "fashion-designing" | "fabric-painting";
  title: string;
  shortTitle: string;
  tagline: string;
  subtitle: string;
  badge: string;
  brochureImage: string;
  brochureAlt: string;
  iconName: "scissors" | "fashion" | "palette";
  admissionFee: number;
  includes: string[];
  specialFeatureTitle?: string;
  specialFeatures?: string[];
  programs: ProgramItem[];
}

export const BROCHURE_CATEGORIES: BrochureCategory[] = [
  {
    id: "boutique",
    title: "Boutique & Stitching Academy",
    shortTitle: "Boutique & Stitching",
    tagline: "Dreaming of Starting Your Own Boutique?",
    subtitle: "Turn Your Passion for Fashion into a Career or Business in Just 6 Months!",
    badge: "Boutique Entrepreneurship",
    brochureImage: "/images/brochures/boutique-courses-brochure.jpg",
    brochureAlt: "Radhe Vastraz Boutique & Stitching Courses Brochure",
    iconName: "scissors",
    admissionFee: 2000,
    includes: [
      "Expert Master Trainers",
      "100% Practical Sewing Machine Training",
      "Official Certificate on Completion",
      "Lifetime Support & Alumni Advisory",
      "Boutique Setup & Business Guidance",
    ],
    programs: [
      {
        id: "personalized-learning",
        name: "Personalized Learning",
        duration: "1 Month",
        regularFee: 25000,
        foundersFee: 15000,
        savings: 10000,
        description: "One-on-one tailored curriculum customized to your individual tailoring goals and pace.",
        highlights: [
          "Custom syllabus adapted to your skill level",
          "One-on-one dedicated instructor attention",
          "Machine fundamentals & precision stitching",
          "Certificate of Completion",
        ],
      },
      {
        id: "foundation-stitching",
        name: "Foundation Stitching",
        duration: "2 Months",
        regularFee: 50000,
        foundersFee: 30000,
        savings: 20000,
        description: "Essential tailoring fundamentals, accurate body measurements, drafting, and finishing.",
        highlights: [
          "Industrial sewing machine mastery",
          "Body measurement & pattern drafting",
          "Neckline finishes, zippers & piping",
          "Basic kurtis, skirts & simple blouses",
        ],
      },
      {
        id: "professional-stitching",
        name: "Professional Stitching",
        duration: "3 Months",
        regularFee: 75000,
        foundersFee: 45000,
        savings: 30000,
        popular: true,
        description: "Comprehensive precision stitching covering designer blouses, princess cuts, and ethnic wear.",
        highlights: [
          "Princess cut, katori & padded blouses",
          "Designer kurtas, palazzo & churidar sets",
          "Pattern alternation & bespoke fitting",
          "Finishing & press work standards",
        ],
      },
      {
        id: "advanced-boutique",
        name: "Advanced Boutique",
        duration: "4 Months",
        regularFee: 100000,
        foundersFee: 60000,
        savings: 40000,
        description: "Advanced cuts, western silhouettes, bridal trousseau tailoring, and client alteration protocols.",
        highlights: [
          "Bridal lehenga choli & can-can attachment",
          "Western gowns & contemporary fusion cuts",
          "Client trial & alteration masterclass",
          "Fabric estimation & cost computation",
        ],
      },
      {
        id: "designer-course",
        name: "Designer Course",
        duration: "5 Months",
        regularFee: 125000,
        foundersFee: 75000,
        savings: 50000,
        description: "High-end bridal couture, indo-western drape design, drafting, and custom embellishments.",
        highlights: [
          "Couture bridal blouses with deep neckline cuts",
          "Draped sarees & Indo-western silhouettes",
          "Surface ornamentation coordination",
          "Portfolio garments creation",
        ],
      },
      {
        id: "master-boutique-course",
        name: "Master Boutique Course",
        duration: "6 Months",
        regularFee: 150000,
        foundersFee: 90000,
        savings: 60000,
        bestValue: true,
        description: "Complete boutique entrepreneurship: master stitching, studio setup, fabric sourcing, and scaling.",
        highlights: [
          "Complete end-to-end boutique operational training",
          "Fabric wholesale sourcing contacts in Hyderabad",
          "Pricing strategy, profit margins & invoicing",
          "Staff management & tailor recruitment guidance",
          "Instagram branding & client acquisition",
        ],
      },
      {
        id: "machine-embroidery-maggam",
        name: "Machine Embroidery & Maggam Essentials",
        duration: "1 Month",
        regularFee: 20000,
        foundersFee: 12000,
        savings: 8000,
        description: "Intensive training in machine embroidery, aari/maggam work, zardosi, and bridal motifs.",
        highlights: [
          "Aari needle handling & thread tension",
          "Zardosi, bead, sequin & stone setting",
          "Bridal blouse necklines & sleeve border motifs",
          "Machine embroidery stitching techniques",
        ],
      },
    ],
  },
  {
    id: "fashion-designing",
    title: "Professional Fashion Designing",
    shortTitle: "Fashion Designing",
    tagline: "Design | Learn | Create | Grow",
    subtitle: "Turn Your Creativity Into a Career! Fashion Today, Success Tomorrow.",
    badge: "Couture & Design",
    brochureImage: "/images/brochures/fashion-designing-brochure.jpg",
    brochureAlt: "Radhe Vastraz Fashion Designing Courses Brochure",
    iconName: "fashion",
    admissionFee: 2000,
    includes: [
      "Expert Fashion Designers & Trainers",
      "Hands-on Practical Studio Training",
      "Recognized Certification on Completion",
      "Professional Portfolio Development",
      "Lifetime Support & Mentorship",
      "Business & Career Guidance",
    ],
    programs: [
      {
        id: "basic-fashion-designing",
        name: "Basic Fashion Designing",
        duration: "1 Month",
        regularFee: 30000,
        foundersFee: 18000,
        savings: 12000,
        description: "Foundational fashion design course covering core concepts, garment aesthetics, and design principles.",
        highlights: [
          "Elements & principles of fashion design",
          "Basic fashion croquis figure sketching",
          "Color theory, mood boards & fabric swatching",
          "Introductory pattern drafting fundamentals",
        ],
      },
      {
        id: "fashion-designing",
        name: "Fashion Designing",
        duration: "3 Months",
        regularFee: 90000,
        foundersFee: 54000,
        savings: 36000,
        popular: true,
        description: "Comprehensive 3-month program with practical design techniques, draping, and portfolio development.",
        highlights: [
          "Advanced fashion illustration & rendering",
          "Textile science & fabric grain manipulation",
          "Standard & designer pattern construction",
          "Mini-collection creation & lookbook",
        ],
      },
      {
        id: "advanced-fashion-designing",
        name: "Advanced Fashion Designing",
        duration: "6 Months",
        regularFee: 180000,
        foundersFee: 108000,
        savings: 72000,
        description: "In-depth fashion designing with advanced couture styling, pattern grading, and industry portfolio.",
        highlights: [
          "Couture garment construction & boning techniques",
          "Dart manipulation, contouring & draping on mannequins",
          "Ethnic, western & bridal collection design",
          "Full photoshoot portfolio development",
        ],
      },
      {
        id: "professional-fashion-designing-complete",
        name: "Professional Fashion Designing (Complete Course)",
        duration: "1 Year",
        regularFee: 300000,
        foundersFee: 180000,
        savings: 120000,
        bestValue: true,
        description: "Full 1-year master diploma covering end-to-end couture, runway collection, and boutique business launch.",
        highlights: [
          "Master curriculum in Haute Couture & Pret-a-porter",
          "Complete boutique brand identity & marketing launch",
          "Final graduation runway collection presentation",
          "Commercial pattern grading & tech pack creation",
          "Internship / Live client incubation support",
        ],
      },
    ],
  },
  {
    id: "fabric-painting",
    title: "Professional Fabric Painting",
    shortTitle: "Fabric Painting",
    tagline: "Paint Your Imagination on Fabric",
    subtitle: "Art Creates A More Beautiful You: Turn Your Creativity Into a Career.",
    badge: "Artisan Craftsmanship",
    brochureImage: "/images/brochures/fabric-painting-brochure.jpg",
    brochureAlt: "Radhe Vastraz Professional Fabric Painting Courses Brochure",
    iconName: "palette",
    admissionFee: 2000,
    includes: [
      "Expert Artisan Trainers",
      "Hands-on Practical Training on Real Fabrics",
      "Certificate on Completion",
      "Portfolio Development",
      "Lifetime Support",
      "Business & Career Guidance",
    ],
    specialFeatureTitle: "What You Will Learn",
    specialFeatures: [
      "Brush Techniques & Color Mixing",
      "Floral, Traditional & Modern Designs",
      "Saree, Dupatta & Blouse Painting",
      "Kalamkari, Pichwai, Madhubani & More",
      "3D, Texture & Metallic Painting",
      "Bridal & Designer Collections",
      "Live Projects & Client Work Training",
      "Pricing & Product Development",
      "Instagram Selling & Business Guidance",
      "Portfolio Development",
    ],
    programs: [
      {
        id: "basic-fabric-painting",
        name: "Basic Fabric Painting",
        duration: "1 Month",
        regularFee: 25000,
        foundersFee: 15000,
        savings: 10000,
        description: "Foundational fabric painting course covering brush control, color blending, floral motifs, and dupattas.",
        highlights: [
          "Color mixing, brush strokes & medium selection",
          "Floral, foliage & traditional border motifs",
          "Fabric preparation, color fixation & wash care",
          "Dupatta, blouse & kurti painting projects",
        ],
      },
      {
        id: "advanced-fabric-painting",
        name: "Advanced Fabric Painting",
        duration: "3 Months",
        regularFee: 75000,
        foundersFee: 45000,
        savings: 30000,
        bestValue: true,
        popular: true,
        description: "Master Kalamkari, Pichwai, Madhubani, 3D texture & metallic painting for bridal sarees and designer collections.",
        highlights: [
          "Authentic Pichwai cow & lotus art on silk",
          "Traditional Kalamkari peacock & tree of life",
          "Madhubani heritage motifs on tussar & cotton",
          "3D outliner, metallic gold & embossed texture",
          "Complete bridal saree collection execution",
          "Pricing your art, client orders & Instagram business",
        ],
      },
    ],
  },
];

export const GENERAL_INCLUSIONS = [
  {
    title: "Expert Trainers",
    description: "Learn directly from veteran master tailors, certified fashion designers, and traditional artisans.",
    icon: "GraduationCap",
  },
  {
    title: "100% Practical Training",
    description: "Hands-on work on industrial sewing machines, dress forms, drafting tables, and fabric painting easels.",
    icon: "Scissors",
  },
  {
    title: "Certificate on Completion",
    description: "Receive a verified certificate from Radhe Vastraz Academy to authenticate your professional skills.",
    icon: "Award",
  },
  {
    title: "Portfolio Development",
    description: "Build a physical and digital portfolio of your bespoke stitched garments, designs, and painted art.",
    icon: "Layers",
  },
  {
    title: "Lifetime Support",
    description: "Access our alumni guidance network, instructor advice, and technical updates even after graduation.",
    icon: "Heart",
  },
  {
    title: "Business & Career Guidance",
    description: "Step-by-step guidance on boutique setup, fabric wholesale sourcing, pricing, and Instagram marketing.",
    icon: "Briefcase",
  },
];

