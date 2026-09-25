/**
 * Single source of truth for the site. Every string is bilingual: { es, en }.
 * Rendered by <T /> as data-es/data-en so the language toggle swaps text
 * in place, without a reload and without shipping the page twice.
 *
 * Voice: first person, rioplatense, direct. Concrete over impressive.
 */
export type L = { es: string; en: string };

export const meta = {
  name: "Nicolás Amoroso",
  initials: "NA",
  role: {
    es: "Desarrollador Fullstack",
    en: "Fullstack Developer",
  } satisfies L,
  title: {
    es: "Nicolás Amoroso · CV & Portafolio 2026",
    en: "Nicolás Amoroso · CV & Portfolio 2026",
  } satisfies L,
  description: {
    es: "Portafolio de Nicolás Amoroso: desarrollo fullstack, TypeScript, React, Java, AWS e IA aplicada. Montevideo, Uruguay.",
    en: "Nicolás Amoroso's portfolio: fullstack development, TypeScript, React, Java, AWS and applied AI. Montevideo, Uruguay.",
  } satisfies L,
  email: "contact@nicolasamoroso.com",
  github: "https://github.com/nicolasamoroso",
  linkedin: "https://www.linkedin.com/in/nicolas-amoroso/",
  location: { es: "Montevideo, Uruguay", en: "Montevideo, Uruguay" } satisfies L,
};

export const nav: { href: string; label: L }[] = [
  { href: "#trayectoria", label: { es: "CV / PERFIL", en: "CV / PROFILE" } },
  { href: "#areas", label: { es: "ÍNDICE", en: "INDEX" } },
  { href: "#proyectos", label: { es: "01 / PROYECTOS", en: "01 / PROJECTS" } },
  { href: "#casos", label: { es: "02 / CASOS TÉCNICOS", en: "02 / CASE STUDIES" } },
  { href: "#stack", label: { es: "03 / STACK", en: "03 / STACK" } },
  { href: "#contacto", label: { es: "GRACIAS / CONTACTO", en: "THANKS / CONTACT" } },
];

export const hero = {
  word: { es: "PORTAFOLIO", en: "PORTFOLIO" },
  top: {
    es: "FULLSTACK / TYPESCRIPT · JAVA · AWS",
    en: "FULLSTACK / TYPESCRIPT · JAVA · AWS",
  } satisfies L,
  scroll: {
    es: "SABER MÁS",
    en: "LEARN MORE",
  } satisfies L,
};

/* ── Index ──────────────────────────────────────────────────────────────── */

export const areas = {
  title: {
    es: "Empezá<br /><em>por acá.</em>",
    en: "Start<br /><em>here.</em>",
  } satisfies L,
  cards: [
    {
      href: "#proyectos",
      klass: "interest-frontend",
      icon: "layout-grid",
      markClass: "app-mark-ts",
      label: { es: "Proyectos", en: "Projects" } satisfies L,
    },
    {
      href: "#casos",
      klass: "interest-backend",
      icon: "workflow",
      markClass: "app-mark-backend",
      label: { es: "Casos<br />Técnicos", en: "Case<br />Studies" } satisfies L,
    },
    {
      href: "#stack",
      klass: "interest-cloud",
      icon: "layers",
      markClass: "app-mark-cloud",
      label: { es: "Stack", en: "Stack" } satisfies L,
    },
  ],
};

/* ── 01 · Projects ──────────────────────────────────────────────────────── */

export type Project = {
  id: string;
  src: string;
  title: string;
  year: string;
  badge?: L;
  kicker: L;
  headline: L;
  description: L;
  /** Short bullet points: what the site does, at a glance. */
  features?: L[];
  /** The full write-up, shown in the project's detail panel. */
  detail?: {
    summary: L;
    useCases: L[];
    built: L[];
    gallery: { src: string; caption: L }[];
  };
  tags: string[];
  href: string;
  github?: string;
};

export const projects: Project[] = [
  {
    id: "annsweets",
    src: "/img/annsweets.png",
    title: "AnnSweets",
    year: "2026",
    badge: { es: "TESIS", en: "THESIS" },
    kicker: { es: "ANNSWEETS / 2026", en: "ANNSWEETS / 2026" },
    headline: {
      es: "Mil tortas<br /><em>en un producto.</em>",
      en: "A thousand cakes<br /><em>in one product.</em>",
    },
    description: {
      es: "Mi proyecto de tesis. Es un e-commerce de tortas personalizadas: el cliente elige tamaño, sabores, rellenos y colores, y el precio se recalcula mientras arma el pedido. La parte difícil no fue la tienda, fue el CMS: la administradora tiene que poder cambiar ingredientes, opciones y combinaciones válidas de cada producto sin tocar una línea de código. Lo armé como monorepo con Turborepo para que la tienda y el panel compartan los mismos tipos y nunca se desincronicen.",
      en: "My thesis project. It's a custom cake e-commerce: the customer picks size, flavors, fillings and colors, and the price recalculates as they build the order. The hard part wasn't the storefront, it was the CMS: the owner has to be able to change ingredients, options and valid combinations for every product without touching a line of code. I built it as a Turborepo monorepo so the store and the admin panel share the same types and never drift apart.",
    },
    features: [
      {
        es: "Tortas a medida: tamaño, sabores, rellenos y colores, con el precio en vivo",
        en: "Custom cakes: size, flavors, fillings and colors, with live pricing",
      },
      {
        es: "Entrega o retiro con horarios por día, fechas bloqueadas y cupo diario",
        en: "Delivery or pickup with per-day hours, blocked dates and a daily cap",
      },
      {
        es: "CMS con pedidos, agenda, productos, promociones, reseñas y textos editables",
        en: "CMS with orders, calendar, products, promotions, reviews and editable copy",
      },
      {
        es: "Pagos con Mercado Pago y base de datos con migraciones versionadas",
        en: "Mercado Pago payments and a database with versioned migrations",
      },
    ],
    detail: {
      summary: {
        es: "Tienda online y CMS para una pastelería que vende tortas, postres y tortas personalizadas. La tienda y el panel comparten código en un monorepo.",
        en: "Online store and CMS for a bakery that sells cakes, desserts and made-to-order cakes. The store and the admin panel share code in one monorepo.",
      },
      useCases: [
        {
          es: "Un cliente arma su torta eligiendo tamaño, sabores y rellenos, y ve el precio antes de pagar.",
          en: "A customer builds a cake by picking size, flavors and fillings, and sees the price before paying.",
        },
        {
          es: "Pide una torta personalizada con referencias y sigue su pedido desde un link.",
          en: "Requests a made-to-order cake with references and follows the order from a link.",
        },
        {
          es: "La dueña carga productos, opciones, promociones y fotos desde el CMS, sin depender de nadie.",
          en: "The owner adds products, options, promotions and photos from the CMS, without depending on anyone.",
        },
      ],
      built: [
        {
          es: "Tienda: catálogo por categorías, carrito, checkout, cuenta de usuario, favoritos y seguimiento del pedido.",
          en: "Store: category catalog, cart, checkout, user accounts, favorites and order tracking.",
        },
        {
          es: "Tortas personalizadas: formulario de pedido con referencias y galería de trabajos.",
          en: "Made-to-order cakes: request form with references and a gallery of past work.",
        },
        {
          es: "Pagos con Mercado Pago y códigos promocionales.",
          en: "Mercado Pago payments and promo codes.",
        },
        {
          es: "Entrega o retiro con horarios por día, fechas bloqueadas y cupo de unidades por día.",
          en: "Delivery or pickup with per-day hours, blocked dates and a daily unit cap.",
        },
        {
          es: "CMS: pedidos, agenda, productos, categorías, sabores y opciones, promociones, reseñas, preguntas frecuentes, newsletter, usuarios y registro de cambios.",
          en: "CMS: orders, calendar, products, categories, flavors and options, promotions, reviews, FAQs, newsletter, users and an audit log.",
        },
        {
          es: "Textos y marca editables desde el panel, con una base pensada para reutilizarse en otros rubros.",
          en: "Copy and branding editable from the panel, on a base designed to be reused for other businesses.",
        },
        {
          es: "Base de datos en Supabase con migraciones versionadas y políticas de acceso por fila.",
          en: "Supabase database with versioned migrations and row-level access policies.",
        },
        {
          es: "Monorepo con Turborepo: tienda y CMS comparten tipos y componentes.",
          en: "Turborepo monorepo: store and CMS share types and components.",
        },
      ],
      gallery: [
        { src: "/img/annsweets.png", caption: { es: "Inicio de la tienda", en: "Store home" } },
        {
          src: "/img/projects/annsweets-gallery.webp",
          caption: { es: "Galería de tortas personalizadas", en: "Made-to-order cake gallery" },
        },
        {
          src: "/img/projects/annsweets-product.webp",
          caption: {
            es: "Producto con opciones y precio que se actualiza",
            en: "Product with options and a live price",
          },
        },
      ],
    },
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Mercado Pago", "Turborepo"],
    href: "https://www.annsweets.com/",
  },
  {
    id: "dardanelli",
    src: "/img/familiadardanelli.png",
    title: "Familia Dardanelli",
    year: "2025",
    kicker: { es: "FAMILIA DARDANELLI / 2025", en: "FAMILIA DARDANELLI / 2025" },
    headline: {
      es: "Reservar una cata<br /><em>sin llamar a nadie.</em>",
      en: "Book a tasting<br /><em>without calling anyone.</em>",
    },
    description: {
      es: "Catálogo de vinos y sistema de reservas de degustaciones. La parte interesante fue la reserva, hay que manejar cupos por horario, cobrar la seña por adelantado con Mercado Pago Checkout Pro para bajar los no-shows, y que la bodega pueda abrir y cerrar fechas sola, sin depender de mí para cada cambio.",
      en: "Wine catalog and tasting reservation system. The interesting part was the booking: handling slots per time, charging a deposit upfront through Mercado Pago Checkout Pro to cut down no-shows, and letting the winery open and close dates on its own without depending on me for every change.",
    },
    features: [
      {
        es: "Cupos por horario, con el turno bloqueado 5 minutos mientras se paga",
        en: "Per-slot capacity, with the slot held for 5 minutes while paying",
      },
      {
        es: "Pagos con Mercado Pago (webhook con firma verificada) y PayPal",
        en: "Mercado Pago payments (signature-verified webhook) and PayPal",
      },
      {
        es: "Panel con reservas, blog con editor y publicación programada, y registro de errores y pagos",
        en: "Admin with bookings, a blog with an editor and scheduled publishing, and error and payment logs",
      },
      {
        es: "Español, inglés y portugués, con mails de confirmación",
        en: "Spanish, English and Portuguese, with confirmation emails",
      },
    ],
    detail: {
      summary: {
        es: "Sitio de la bodega Familia Dardanelli: catálogo de vinos, reserva de visitas y degustaciones con pago online, blog y un panel para administrar todo.",
        en: "Website for the Familia Dardanelli winery: wine catalog, tour and tasting bookings with online payment, a blog and an admin panel to manage it all.",
      },
      useCases: [
        {
          es: "Un visitante elige una degustación, un horario y paga online para asegurar su lugar.",
          en: "A visitor picks a tasting and a time slot and pays online to secure a spot.",
        },
        {
          es: "Un turista lo lee en español, inglés o portugués.",
          en: "A tourist reads it in Spanish, English or Portuguese.",
        },
        {
          es: "La bodega bloquea fechas por eventos privados y carga reservas a mano desde el panel.",
          en: "The winery blocks dates for private events and enters bookings by hand from the panel.",
        },
        {
          es: "La bodega publica notas en el blog, incluso programadas.",
          en: "The winery publishes blog posts, including scheduled ones.",
        },
      ],
      built: [
        {
          es: "Reservas por horario con cupos y bloqueo de 5 minutos mientras se paga; cada reserva pasa por estados (disponible, bloqueada, paga, cancelada, vencida).",
          en: "Time-slot bookings with capacity and a 5-minute hold while paying; each booking moves through states (available, held, paid, cancelled, expired).",
        },
        {
          es: "Pagos con Mercado Pago (webhook con firma HMAC verificada) y PayPal.",
          en: "Payments with Mercado Pago (webhook with a verified HMAC signature) and PayPal.",
        },
        {
          es: "Mails de confirmación con Resend y respaldo con Nodemailer.",
          en: "Confirmation emails through Resend, with Nodemailer as a fallback.",
        },
        {
          es: "Catálogo de vinos con filtros por categoría y tipo, y buscador.",
          en: "Wine catalog with category and type filters, and search.",
        },
        {
          es: "Blog con editor TipTap, categorías, SEO por nota y publicación programada.",
          en: "Blog with a TipTap editor, categories, per-post SEO and scheduled publishing.",
        },
        {
          es: "Panel: reservas, reservas manuales, eventos, blog y visor de logs.",
          en: "Admin: bookings, manual bookings, events, blog and a log viewer.",
        },
        {
          es: "Sitio en tres idiomas (ES, EN, PT-BR) con rutas por idioma y sitemap.",
          en: "Three-language site (ES, EN, PT-BR) with per-language routes and a sitemap.",
        },
        {
          es: "Registro centralizado de errores y eventos de pago.",
          en: "Centralized logging of errors and payment events.",
        },
      ],
      gallery: [
        { src: "/img/familiadardanelli.png", caption: { es: "Inicio del sitio", en: "Site home" } },
        {
          src: "/img/projects/dardanelli-experiences.webp",
          caption: { es: "Experiencias con reserva online", en: "Experiences with online booking" },
        },
        {
          src: "/img/projects/dardanelli-wines.webp",
          caption: { es: "Catálogo de vinos con filtros", en: "Wine catalog with filters" },
        },
      ],
    },
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Mercado Pago", "PayPal"],
    href: "https://www.familiadardanelli.com.uy/",
  },
  {
    id: "casagrande",
    src: "/img/vinoscasagrande.png",
    title: "Casa Grande",
    year: "2024",
    kicker: { es: "VINOS CASA GRANDE / 2024", en: "VINOS CASA GRANDE / 2024" },
    headline: {
      es: "Un catálogo<br /><em>para recorrer.</em>",
      en: "A catalog<br /><em>made to wander.</em>",
    },
    description: {
      es: "Catálogo de vinos y reservas de degustaciones. Casi todo el tráfico entra desde el celular, así que la regla fue simple: si no carga instantáneo en un teléfono en el medio del campo, no sirve. Cada etiqueta se lee como una ficha editorial, sin carruseles pesados ni imágenes de 3 MB.",
      en: "Wine catalog and tasting bookings. Almost all the traffic comes from phones, so the rule was simple: if it doesn't load instantly on a phone in the middle of the countryside, it's useless. Every label reads like an editorial spread, with no heavy carousels and no 3 MB images.",
    },
    features: [
      {
        es: "Tienda sobre Shopify, con pagos por Mercado Pago y códigos promocionales",
        en: "Shopify-powered store, with Mercado Pago payments and promo codes",
      },
      {
        es: "Eventos con venta de entradas, preventas y avisos por mail",
        en: "Events with ticket sales, presales and email reminders",
      },
      {
        es: "Panel para editar textos, eventos y códigos sin tocar código",
        en: "Admin to edit copy, events and codes without touching code",
      },
      {
        es: "Español, inglés y portugués, con analítica de Google y Meta",
        en: "Spanish, English and Portuguese, with Google and Meta analytics",
      },
    ],
    detail: {
      summary: {
        es: "Sitio y tienda de la bodega Casa Grande: vinos a la venta online, enoturismo con degustaciones, eventos con entradas y un panel para administrar el contenido.",
        en: "Website and store for the Casa Grande winery: wines for sale online, wine tourism with tastings, ticketed events and an admin panel to manage the content.",
      },
      useCases: [
        {
          es: "Un cliente compra vinos y packs online, con Mercado Pago y un código promocional si tiene.",
          en: "A customer buys wines and packs online, paying with Mercado Pago and a promo code if they have one.",
        },
        {
          es: "Un visitante reserva una degustación o compra entradas para un evento, con preventa.",
          en: "A visitor books a tasting or buys tickets for an event, with presale.",
        },
        {
          es: "Desde el exterior se lee en inglés o portugués.",
          en: "From abroad it reads in English or Portuguese.",
        },
        {
          es: "La bodega cambia textos, eventos y códigos desde el panel.",
          en: "The winery edits copy, events and codes from the panel.",
        },
      ],
      built: [
        {
          es: "Tienda con Shopify Storefront API: colecciones, filtros, favoritos, carrito y checkout con Mercado Pago; los pedidos se sincronizan con Shopify por API y webhook.",
          en: "Store on the Shopify Storefront API: collections, filters, favorites, cart and a Mercado Pago checkout; orders sync back to Shopify through the API and a webhook.",
        },
        {
          es: "Códigos promocionales con ámbitos: todo el sitio, un evento o productos puntuales.",
          en: "Promo codes with scopes: the whole site, one event or specific products.",
        },
        {
          es: "Eventos: venta de entradas, preventas, pago por transferencia o Mercado Pago, mails al cliente, recordatorios de pago y traslado opcional.",
          en: "Events: ticket sales, presales, payment by transfer or Mercado Pago, customer emails, payment reminders and optional transport.",
        },
        {
          es: "Enoturismo: una página por experiencia, con integración a Google Calendar.",
          en: "Wine tourism: a page per experience, with a Google Calendar integration.",
        },
        {
          es: "Panel: eventos, experiencias, códigos promocionales, newsletter y textos editables.",
          en: "Admin: events, experiences, promo codes, newsletter and editable copy.",
        },
        {
          es: "Sitio en español, inglés y portugués, con detección del idioma del navegador.",
          en: "Site in Spanish, English and Portuguese, detecting the browser language.",
        },
        {
          es: "Analítica con Google Tag Manager, Google Ads y Meta Pixel; límite de pedidos por IP en la API.",
          en: "Analytics with Google Tag Manager, Google Ads and Meta Pixel; per-IP rate limiting on the API.",
        },
        { es: "Página para personalizar botellas.", en: "A page to personalize bottles." },
      ],
      gallery: [
        { src: "/img/vinoscasagrande.png", caption: { es: "Inicio del sitio", en: "Site home" } },
        {
          src: "/img/projects/casagrande-tourism.webp",
          caption: { es: "Enoturismo: experiencias", en: "Wine tourism: experiences" },
        },
        {
          src: "/img/projects/casagrande-shop.webp",
          caption: {
            es: "Colección con filtros, precios y favoritos",
            en: "Collection with filters, prices and favorites",
          },
        },
      ],
    },
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Shopify", "Mercado Pago"],
    href: "https://www.vinoscasagrande.com/",
  },
  {
    id: "basement",
    src: "/img/basementchallenge.png",
    title: "Basement Challenge",
    year: "2023",
    kicker: { es: "BASEMENT CHALLENGE / 2023", en: "BASEMENT CHALLENGE / 2023" },
    headline: {
      es: "Del Figma<br /><em>al píxel exacto.</em>",
      en: "From Figma<br /><em>to the exact pixel.</em>",
    },
    description: {
      es: "Un desafío de diseño de Basement Studio: te dan el Figma y tenés que clavarlo. Lo hice sin librerías de UI, CSS a mano, replicando cada medida, cada tipografía y cada animación. Es el proyecto que me enseñó a mirar un diseño y ver los números atrás.",
      en: "A design challenge from Basement Studio: they hand you the Figma and you have to nail it. I did it with no UI libraries, hand-written CSS, replicating every measurement, typeface and animation. It's the project that taught me to look at a design and see the numbers behind it.",
    },
    tags: ["Next.js", "CSS"],
    href: "https://bsmnt.nicolasamoroso.com/",
    github: "https://github.com/nicolasamoroso/basement-challenge",
  },
];

export const projectsCopy = {
  title: { es: "Proyectos.", en: "Projects." } satisfies L,
  subtitle: { es: "SITIOS EN PRODUCCIÓN", en: "LIVE IN PRODUCTION" } satisfies L,
  visit: { es: "Ver", en: "Visit" } satisfies L,
  code: { es: "Código", en: "Code" } satisfies L,
  openDetail: { es: "Ver detalle", en: "View details" } satisfies L,
  back: { es: "Proyectos", en: "Projects" } satisfies L,
  next: { es: "SIGUIENTE PROYECTO", en: "NEXT PROJECT" } satisfies L,
  summaryLabel: { es: "RESUMEN", en: "SUMMARY" } satisfies L,
  useCasesLabel: { es: "CASOS DE USO", en: "USE CASES" } satisfies L,
  builtLabel: { es: "QUÉ SE HIZO", en: "WHAT WAS BUILT" } satisfies L,
  stackLabel: { es: "STACK", en: "STACK" } satisfies L,
  galleryLabel: { es: "CAPTURAS", en: "SCREENSHOTS" } satisfies L,
};

/* ── 02 · Engineering case studies ──────────────────────────────────────── */

export type CaseStudy = {
  id: string;
  tab: L;
  kicker: L;
  name: L;
  description: L;
  facts: { label: L; value: L; note?: L }[];
  metrics: { value: string; label: L; note: L }[];
  stack: string[];
  detail: L[];
};

export const cases: CaseStudy[] = [
  {
    id: "asistente-ia",
    tab: { es: "Asistente con IA", en: "AI assistant" },
    kicker: { es: "CASO 01 / ICASH.ONE", en: "CASE 01 / ICASH.ONE" },
    name: {
      es: "Un asistente que además hace cosas",
      en: "An assistant that also does things",
    },
    description: {
      es: "El equipo comercial vivía pidiéndole consultas al equipo de datos y esperando. Co-desarrollamos un asistente que responde preguntas en lenguaje natural sobre los datos del negocio y, cuando la respuesta implica una acción, la ejecuta. Esa última parte es la que lo hace útil y también la que lo hace peligroso, así que la mayor parte del trabajo fue acotar qué puede tocar y qué no.",
      en: "The commercial team spent its time asking the data team for queries and waiting. We co-developed an assistant that answers natural-language questions about business data and, when the answer implies an action, executes it. That last part is what makes it useful and also what makes it dangerous, so most of the work went into scoping what it can and can't touch.",
    },
    facts: [
      {
        label: { es: "Mi rol", en: "My role" },
        value: { es: "Co-desarrollador · fullstack", en: "Co-developer · fullstack" },
      },
      { label: { es: "Frontend", en: "Frontend" }, value: { es: "React", en: "React" } },
      {
        label: { es: "Backend", en: "Backend" },
        value: { es: "Python serverless", en: "Serverless Python" },
      },
      {
        label: { es: "Datos", en: "Data" },
        value: { es: "Redshift + DynamoDB", en: "Redshift + DynamoDB" },
      },
    ],
    metrics: [
      {
        value: "Bedrock",
        label: { es: "Dónde corre el modelo", en: "Where the model runs" },
        note: { es: "Los datos no salen de la cuenta", en: "Data never leaves the account" },
      },
      {
        value: "Lambda",
        label: { es: "Cómputo", en: "Compute" },
        note: { es: "Escala a cero entre consultas", en: "Scales to zero between queries" },
      },
      {
        value: "Redshift",
        label: { es: "Fuente de verdad", en: "Source of truth" },
        note: { es: "Solo lectura, permisos acotados", en: "Read-only, narrow permissions" },
      },
      {
        value: "DynamoDB",
        label: { es: "Memoria", en: "Memory" },
        note: { es: "Historial por usuario", en: "Per-user history" },
      },
    ],
    stack: ["React", "Python", "AWS Lambda", "DynamoDB", "Bedrock", "Redshift"],
    detail: [
      {
        es: "Cada consulta levanta una Lambda que arma el contexto, llama al modelo en Bedrock y, si hace falta, ejecuta la acción contra los servicios del negocio. Serverless porque el uso es a ráfagas: no tiene sentido pagar un servidor prendido todo el día para que lo usen diez personas.",
        en: "Every query spins up a Lambda that assembles the context, calls the model on Bedrock and, if needed, executes the action against the business services. Serverless because usage is bursty: there's no point paying for a server running all day so that ten people can use it.",
      },
      {
        es: "El historial vive en DynamoDB por usuario. Así se pueden hacer preguntas de seguimiento sin reenviar todo el contexto en cada turno, que es donde se te va el presupuesto de tokens.",
        en: "History lives in DynamoDB per user, so follow-up questions work without resending the whole context every turn, which is exactly where your token budget goes.",
      },
      {
        es: "Redshift entra de solo lectura y con permisos acotados. El asistente lee lo que necesita y nada más: si algo sale mal, el peor caso es una respuesta equivocada, no un dato modificado.",
        en: "Redshift is wired in read-only with narrow permissions. The assistant reads what it needs and nothing else: if something goes wrong, the worst case is a wrong answer, not modified data.",
      },
    ],
  },
  {
    id: "modulos-aws",
    tab: { es: "Módulos end-to-end", en: "End-to-end modules" },
    kicker: { es: "CASO 02 / ICASH.ONE", en: "CASE 02 / ICASH.ONE" },
    name: {
      es: "De la infra al pixel, yo solo",
      en: "From infra to pixel, on my own",
    },
    description: {
      es: "Varios módulos de negocio salieron enteros desde cero: modelo de datos, backend, infra en AWS ECS, despliegue y la interfaz que el equipo usa todos los días. Suena a mucho, pero tener todo bajo el mismo techo es justamente lo que hace que salga rápido: no hay que negociar contratos de API entre equipos cuando ya es tarde.",
      en: "Several business modules shipped whole from scratch: data model, backend, AWS ECS infra, deployment and the interface the team uses every day. It sounds like a lot, but having it all under one roof is exactly what makes it fast: you don't negotiate API contracts across teams when it's already too late.",
    },
    facts: [
      {
        label: { es: "Mi rol", en: "My role" },
        value: { es: "Dueño del módulo", en: "Module owner" },
      },
      { label: { es: "Infra", en: "Infra" }, value: { es: "AWS ECS", en: "AWS ECS" } },
      {
        label: { es: "Backend", en: "Backend" },
        value: { es: "Java + MySQL", en: "Java + MySQL" },
      },
      {
        label: { es: "Frontend", en: "Frontend" },
        value: { es: "React + TypeScript", en: "React + TypeScript" },
      },
    ],
    metrics: [
      {
        value: "ECS",
        label: { es: "Servicios en contenedor", en: "Containerized services" },
        note: { es: "Levantados y configurados por mí", en: "Set up and configured by me" },
      },
      {
        value: "E2E",
        label: { es: "Alcance", en: "Scope" },
        note: { es: "Infra, backend, API y UI", en: "Infra, backend, API and UI" },
      },
      {
        value: "MySQL",
        label: { es: "Modelo de datos", en: "Data model" },
        note: { es: "Diseñado desde cero", en: "Designed from scratch" },
      },
      {
        value: "Java",
        label: { es: "Lógica de negocio", en: "Business logic" },
        note: { es: "El núcleo de los módulos", en: "The core of the modules" },
      },
    ],
    stack: ["Java", "MySQL", "AWS ECS", "React", "TypeScript"],
    detail: [
      {
        es: "El modelo de datos, la API y la UI se diseñaron juntos. Cuando el que escribe la query es el mismo que arma la pantalla, desaparecen los endpoints que devuelven veinte campos para que la UI use tres.",
        en: "The data model, the API and the UI were designed together. When the person writing the query is the one building the screen, you stop getting endpoints that return twenty fields so the UI can use three.",
      },
      {
        es: "La lógica core va en Java sobre MySQL: links de referidos, códigos promocionales y la integración de servicios entre módulos. Nada de eso vive en el frontend.",
        en: "Core logic lives in Java over MySQL: referral links, promo codes and service integration across modules. None of that lives in the frontend.",
      },
    ],
  },
  {
    id: "checkouts",
    tab: { es: "Checkouts & pagos", en: "Checkouts & payments" },
    kicker: { es: "CASO 03 / FREELANCE", en: "CASE 03 / FREELANCE" },
    name: {
      es: "Donde un bug es plata",
      en: "Where a bug is money",
    },
    description: {
      es: "El checkout es el único lugar donde un bug se traduce directo en plata perdida. Trabajé de punta a punta en checkouts, pasarelas y códigos promocionales en los e-commerce que armé freelance. Después de unos cuantos, terminás con reglas bastante innegociables.",
      en: "Checkout is the one place where a bug translates straight into lost money. I worked end-to-end on checkouts, gateways and promo codes across the e-commerce sites I built freelance. After a few of them you end up with some fairly non-negotiable rules.",
    },
    facts: [
      { label: { es: "Mi rol", en: "My role" }, value: { es: "Fullstack", en: "Fullstack" } },
      {
        label: { es: "Pasarelas", en: "Gateways" },
        value: { es: "Mercado Pago · Shopify", en: "Mercado Pago · Shopify" },
      },
      {
        label: { es: "Backend", en: "Backend" },
        value: { es: "Next.js · Supabase", en: "Next.js · Supabase" },
      },
      {
        label: { es: "Dónde", en: "Where" },
        value: { es: "Freelance", en: "Freelance" },
      },
    ],
    metrics: [
      {
        value: "3",
        label: { es: "Tiendas cobrando", en: "Stores taking money" },
        note: { es: "En producción, plata real", en: "In production, real money" },
      },
      {
        value: "Checkout Pro",
        label: { es: "Mercado Pago", en: "Mercado Pago" },
        note: { es: "Integrado end-to-end", en: "Integrated end-to-end" },
      },
      {
        value: "Storefront",
        label: { es: "Shopify API", en: "Shopify API" },
        note: { es: "Frontend propio sobre su stock", en: "Custom frontend over their inventory" },
      },
      {
        value: "Promos",
        label: { es: "Códigos y referidos", en: "Codes & referrals" },
        note: { es: "Lógica server-side en Supabase", en: "Server-side logic in Supabase" },
      },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Mercado Pago", "Shopify"],
    detail: [
      {
        es: "Regla uno: el estado del pago vive en el backend, nunca en el cliente. La pantalla muestra lo que confirmó el webhook, no lo que el usuario cree que pasó. Suena obvio hasta que ves cuántas tiendas lo hacen al revés.",
        en: "Rule one: payment state lives in the backend, never in the client. The screen shows what the webhook confirmed, not what the user thinks happened. It sounds obvious until you see how many stores do it the other way round.",
      },
      {
        es: "Regla dos: los códigos promocionales y los links de referidos se validan del lado del servidor. La lógica de acumulación y vencimiento vive en un solo lugar, porque si vive en dos se van a contradecir.",
        en: "Rule two: promo codes and referral links get validated server-side. Stacking and expiry logic lives in exactly one place, because if it lives in two they will contradict each other.",
      },
    ],
  },
  {
    id: "rediseno",
    tab: { es: "Rediseño & performance", en: "Redesign & performance" },
    kicker: { es: "CASO 04 / ICASH.ONE", en: "CASE 04 / ICASH.ONE" },
    name: {
      es: "Modernizar sin frenar a nadie",
      en: "Modernizing without stalling anyone",
    },
    description: {
      es: "Varios productos arrastraban interfaces viejas y librerías sin actualizar hacía años. Rediseñé las interfaces e implementé los diseños nuevos mientras actualizaba el stack por debajo. El efecto colateral fue el mejor: el entorno local y el despliegue pasaron a tardar bastante menos, así que todo el equipo ganó tiempo.",
      en: "Several products were dragging around old interfaces and libraries that hadn't been updated in years. I redesigned the interfaces and implemented the new designs while upgrading the stack underneath. The side effect was the best part: local setup and deployment got noticeably faster, so the whole team gained time.",
    },
    facts: [
      {
        label: { es: "Mi rol", en: "My role" },
        value: { es: "Responsable del rediseño", en: "Redesign lead" },
      },
      {
        label: { es: "Alcance", en: "Scope" },
        value: { es: "Varios productos", en: "Several products" },
      },
      {
        label: { es: "Stack", en: "Stack" },
        value: { es: "React + TypeScript", en: "React + TypeScript" },
      },
      {
        label: { es: "Riesgo", en: "Risk" },
        value: { es: "Sin cortar el servicio", en: "No downtime" },
      },
    ],
    metrics: [
      {
        value: "↓",
        label: { es: "Arranque local", en: "Local startup" },
        note: { es: "Más rápido tras la migración", en: "Faster after the migration" },
      },
      {
        value: "↓",
        label: { es: "Tiempo de despliegue", en: "Deployment time" },
        note: { es: "Más rápido tras la migración", en: "Faster after the migration" },
      },
      {
        value: "UI",
        label: { es: "Interfaces renovadas", en: "Interfaces renewed" },
        note: { es: "Diseño nuevo implementado", en: "New design implemented" },
      },
      {
        value: "0",
        label: { es: "Semanas de features frenadas", en: "Weeks of frozen features" },
        note: { es: "Migración incremental", en: "Incremental migration" },
      },
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    detail: [
      {
        es: "Incremental, siempre. Actualizar librerías de a poco y en paralelo al rediseño, en vez de congelar el desarrollo de features durante semanas para hacer el big bang que después nadie se anima a mergear.",
        en: "Incremental, always. Upgrade libraries gradually and in parallel with the redesign, instead of freezing feature work for weeks to do the big bang nobody dares to merge afterwards.",
      },
    ],
  },
];

export const casesCopy = {
  title: {
    es: "Casos<br /><em>Técnicos.</em>",
    en: "Case<br /><em>Studies.</em>",
  } satisfies L,
  selectHint: { es: "ELEGÍ UN CASO ↓", en: "PICK A CASE ↓" } satisfies L,
  tabNote: { es: "DECISIONES + STACK", en: "DECISIONS + STACK" } satisfies L,
  factsLabel: { es: "FICHA TÉCNICA", en: "TECHNICAL SHEET" } satisfies L,
  stackLabel: { es: "STACK DEL CASO", en: "CASE STACK" } satisfies L,
  detailSummary: { es: "Cómo lo resolví", en: "How I solved it" } satisfies L,
  note: {
    es: "Todo esto es trabajo hecho en iCash.One y en proyectos freelance.",
    en: "All of this is work done at iCash.One and on freelance projects.",
  } satisfies L,
};

/* ── 03 · Stack ─────────────────────────────────────────────────────────── */

export type Tech = { slug: string; name: string; hex: string; note: L };

export const stack: Tech[] = [
  {
    slug: "typescript",
    name: "TypeScript",
    hex: "3178C6",
    note: { es: "Mi idioma por defecto", en: "My default language" },
  },
  {
    slug: "react",
    name: "React",
    hex: "61DAFB",
    note: { es: "En producción desde 2022", en: "In production since 2022" },
  },
  {
    slug: "nextdotjs",
    name: "Next.js",
    hex: "FFFFFF",
    note: { es: "Todos mis e-commerce", en: "Every e-commerce I built" },
  },
  {
    slug: "openjdk",
    name: "Java",
    hex: "F89820",
    note: { es: "La lógica que no puede fallar", en: "The logic that can't fail" },
  },
  {
    slug: "nodedotjs",
    name: "Node.js",
    hex: "5FA04E",
    note: { es: "APIs y tooling", en: "APIs and tooling" },
  },
  {
    slug: "python",
    name: "Python",
    hex: "3776AB",
    note: { es: "Serverless e IA", en: "Serverless and AI" },
  },
  {
    slug: "mysql",
    name: "MySQL",
    hex: "4479A1",
    note: { es: "Modelar antes de escribir", en: "Model before you write" },
  },
  {
    slug: "amazonwebservices",
    name: "AWS",
    hex: "FF9900",
    note: { es: "ECS, Lambda, DynamoDB, Bedrock", en: "ECS, Lambda, DynamoDB, Bedrock" },
  },
  {
    slug: "supabase",
    name: "Supabase",
    hex: "3FCF8E",
    note: { es: "Auth, base de datos y storage", en: "Auth, database and storage" },
  },
  {
    slug: "tailwindcss",
    name: "Tailwind CSS",
    hex: "06B6D4",
    note: { es: "Cuando hay que ir rápido", en: "When you need to move fast" },
  },
  {
    slug: "claudecode",
    name: "Claude Code",
    hex: "D97757",
    note: { es: "Pair programming diario", en: "Daily pair programming" },
  },
  {
    slug: "git",
    name: "Git",
    hex: "F05032",
    note: { es: "Commits chicos, siempre", en: "Small commits, always" },
  },
];

export const stackCopy = {
  title: {
    es: "Lo que uso<br /><em>todos los días.</em>",
    en: "What I use<br /><em>every day.</em>",
  } satisfies L,
  hint: {
    es: "Elegí una tecla.",
    en: "Pick a key.",
  } satisfies L,
  tiltOn: { es: "Mover con el giroscopio", en: "Move with the gyroscope" } satisfies L,
  tiltStatus: {
    es: "Inclinás el celular y las tarjetas se mueven.",
    en: "Tilt your phone and the cards move.",
  } satisfies L,
};

/* ── CV board ───────────────────────────────────────────────────────────── */

export const cv = {
  labels: {
    experience: { es: "// EXPERIENCIA", en: "// EXPERIENCE" } satisfies L,
    education: { es: "// FORMACIÓN", en: "// EDUCATION" } satisfies L,
  },

  resumeLabel: { es: "CV", en: "Resume" } satisfies L,
  resumeEs: { es: "Español", en: "Spanish" } satisfies L,
  resumeEn: { es: "Inglés", en: "English" } satisfies L,

  /** One entry per job, achievements in the open, no drawer. */
  experience: [
    {
      period: { es: "2025 - HOY", en: "2025 - NOW" } satisfies L,
      company: "iCash.One",
      role: { es: "Desarrollador Fullstack", en: "Fullstack Developer" } satisfies L,
      place: { es: "Montevideo, UY", en: "Montevideo, UY" } satisfies L,
      items: [
        {
          es: "Rediseño y modernización de la interfaz de varios productos: implementación de los diseños nuevos y actualización de librerías obsoletas, con menores tiempos de arranque local y de despliegue.",
          en: "Interface redesign and modernization across several products: implementation of the new designs and updates to outdated libraries, with shorter local startup and deployment times.",
        },
        {
          es: "Módulos de negocio nuevos de punta a punta, con la infraestructura en AWS ECS y el backend completo.",
          en: "New business modules built end to end, with the AWS ECS infrastructure and the full backend.",
        },
        {
          es: "Lógica core en Java y MySQL: links de referidos, códigos promocionales, pasarelas de pago e integración de servicios entre módulos.",
          en: "Core logic in Java and MySQL: referral links, promo codes, payment gateways and service integration across modules.",
        },
        {
          es: "Desarrollo en equipo de un asistente conversacional con IA que responde consultas y ejecuta acciones sobre el negocio, integrado con Redshift. Frontend en React, backend serverless en Python sobre Lambda, DynamoDB y Bedrock.",
          en: "Team development of an AI conversational assistant that answers queries and executes actions on the business, integrated with Redshift. React frontend, serverless Python backend on Lambda, DynamoDB and Bedrock.",
        },
        {
          es: "Flujos críticos del producto: checkouts, búsqueda, integraciones nuevas y paneles de administración.",
          en: "Critical product flows: checkouts, search, new integrations and admin panels.",
        },
      ] satisfies L[],
      stack: ["Java", "MySQL", "AWS ECS", "Lambda", "React", "TypeScript", "Python"],
    },
    {
      period: { es: "2024 - 2025", en: "2024 - 2025" } satisfies L,
      company: "Freelance",
      role: { es: "Desarrollador Web", en: "Web Developer" } satisfies L,
      place: { es: "Uruguay", en: "Uruguay" } satisfies L,
      items: [
        {
          es: '<a href="https://www.vinoscasagrande.com/" target="_blank" rel="noopener noreferrer">Casa Grande</a>: e-commerce con Next.js, TypeScript, shadcn y Shopify Storefront API, con Supabase y Mercado Pago Checkout Pro.',
          en: '<a href="https://www.vinoscasagrande.com/" target="_blank" rel="noopener noreferrer">Casa Grande</a>: e-commerce with Next.js, TypeScript, shadcn and the Shopify Storefront API, plus Supabase and Mercado Pago Checkout Pro.',
        },
        {
          es: '<a href="https://www.familiadardanelli.com.uy/" target="_blank" rel="noopener noreferrer">Familia Dardanelli</a>: catálogo de vinos y reservas de degustaciones en Next.js, TypeScript y Tailwind CSS.',
          en: '<a href="https://www.familiadardanelli.com.uy/" target="_blank" rel="noopener noreferrer">Familia Dardanelli</a>: wine catalog and tasting bookings in Next.js, TypeScript and Tailwind CSS.',
        },
        {
          es: '<a href="https://www.annsweets.com/" target="_blank" rel="noopener noreferrer">AnnSweets</a>: e-commerce de tortas personalizadas con CMS completo. También fue mi proyecto de tesis.',
          en: '<a href="https://www.annsweets.com/" target="_blank" rel="noopener noreferrer">AnnSweets</a>: custom cake e-commerce with a full CMS. It was also my thesis project.',
        },
      ] satisfies L[],
      stack: ["Next.js", "TypeScript", "Supabase", "Shopify", "Mercado Pago"],
    },
  ],

  /** Degree and certificate together, each with the document behind it. */
  education: [
    {
      title: {
        es: "Analista en Tecnologías de la Información",
        en: "Information Technology Analyst",
      } satisfies L,
      where: {
        es: "Universidad ORT Uruguay · Montevideo",
        en: "Universidad ORT Uruguay · Montevideo",
      } satisfies L,
      period: { es: "2023 - 2026 · En curso", en: "2023 - 2026 · In progress" } satisfies L,
      doc: { es: "Escolaridad (PDF)", en: "Transcript (PDF)" } satisfies L,
      href: "/certificates/academic_transcript.pdf",
    },
    {
      title: {
        es: "Jóvenes a Programar · Desarrollo Web",
        en: "Jóvenes a Programar · Web Development",
      } satisfies L,
      where: { es: "Plan Ceibal", en: "Plan Ceibal" } satisfies L,
      period: { es: "2022 · Finalizado", en: "2022 · Completed" } satisfies L,
      doc: { es: "Certificado (PDF)", en: "Certificate (PDF)" } satisfies L,
      href: "/certificates/certificadoJaP.pdf",
    },
  ],
};

/* ── Contact ────────────────────────────────────────────────────────────── */

export const contact = {
  title: { es: "Gracias.", en: "Thanks." } satisfies L,
  body: {
    es: "Para proyectos, propuestas de trabajo o cualquier consulta, escribime por mail.",
    en: "For projects, job opportunities or any question, send me an email.",
  } satisfies L,
  resume: { es: "CV", en: "Resume" } satisfies L,
  resumeEs: { es: "Español", en: "Spanish" } satisfies L,
  resumeEn: { es: "Inglés", en: "English" } satisfies L,
  backTop: { es: "VOLVER ARRIBA", en: "BACK TO TOP" } satisfies L,
};
