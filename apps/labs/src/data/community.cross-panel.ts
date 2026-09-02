import type { CommunityResource } from "./community";

/** Fichas contextuales: mismo recurso, segundo panel y descripción enfocada. */
export const crossPanelResources: CommunityResource[] = [
  {
    category: "CTF", title: "pwn.college · Dojos", source: "pwn.college", description: "Dojos prácticos para convertir fundamentos de sistemas y seguridad en ejercicios tipo CTF.", href: "https://pwn.college/dojos", topics: ["CTF", "Linux", "sistemas"], level: "Mixto", format: "Dojos", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "CTF", title: "OverTheWire · Wargames", source: "OverTheWire", description: "Wargames para practicar terminal, Linux, redes y escalada de privilegios en entornos controlados.", href: "https://overthewire.org/wargames/", topics: ["Linux", "terminal", "CTF"], level: "Mixto", format: "Wargames", language: "Inglés", access: "Gratis"
  },
  {
    category: "Red Team · Pentesting", title: "GTFOBins", source: "GTFOBins", description: "Referencia de binarios Unix que pueden ser relevantes en revisiones de privilegios y post-explotación autorizadas.", href: "https://gtfobins.github.io/", topics: ["Linux", "privilegios", "post-explotación"], level: "Avanzado", format: "Referencia", language: "Inglés", access: "Gratis"
  },
  {
    category: "Blue Team", title: "How To Secure A Linux Server", source: "GitHub", description: "Lista de controles para revisar y endurecer servidores Linux.", href: "https://github.com/imthenachoman/How-To-Secure-A-Linux-Server", topics: ["Linux", "hardening", "defensa"], level: "Intermedio", format: "Checklist", language: "Inglés", access: "Gratis"
  },
  {
    category: "Linux", title: "revshells · Linux reference", source: "revshells", description: "Generador y referencia de shells inversas para comprender conexiones de laboratorio y controles de detección.", href: "https://www.revshells.com/", topics: ["Linux", "shell", "redes"], level: "Avanzado", format: "Herramienta", language: "Inglés", access: "Gratis", curation: "pendiente", warning: "Uso dual: emplealo únicamente en laboratorios o sistemas autorizados."
  },
  {
    category: "Computer Science", title: "HackTricks · fundamentos técnicos", source: "HackTricks", description: "Wiki de consulta para relacionar técnicas de sistemas, redes y aplicaciones durante el estudio de seguridad.", href: "https://book.hacktricks.wiki/en/index.html", topics: ["sistemas", "redes", "seguridad"], level: "Avanzado", format: "Wiki", language: "Inglés", access: "Gratis"
  },
  {
    category: "Red Team · Pentesting", title: "MITRE ATT&CK · operaciones ofensivas", source: "MITRE", description: "Matriz para estudiar tácticas y técnicas ofensivas con contexto, procedimientos y mitigaciones.", href: "https://attack.mitre.org/", topics: ["tácticas", "técnicas", "emulación"], level: "Avanzado", format: "Base de conocimiento", language: "Inglés", access: "Gratis"
  },
  {
    category: "Blue Team", title: "MITRE ATT&CK · detección y mitigación", source: "MITRE", description: "Misma matriz enfocada en detecciones, mitigaciones y análisis defensivo.", href: "https://attack.mitre.org/", topics: ["detección", "mitigación", "threat hunting"], level: "Avanzado", format: "Base de conocimiento", language: "Inglés", access: "Gratis"
  },
  {
    category: "Red Team · Pentesting", title: "Web Security Academy · pentesting", source: "PortSwigger", description: "Laboratorios para practicar pruebas web y entender la metodología de evaluación de aplicaciones.", href: "https://portswigger.net/web-security", topics: ["web", "pentesting", "laboratorios"], level: "Mixto", format: "Academia y laboratorios", language: "Inglés", access: "Gratis"
  },
  {
    category: "CTF", title: "Web Security Academy · retos", source: "PortSwigger", description: "Retos web guiados para entrenar enumeración, validación de hipótesis y resolución paso a paso.", href: "https://portswigger.net/web-security", topics: ["web", "retos", "CTF"], level: "Mixto", format: "Laboratorios", language: "Inglés", access: "Gratis"
  },
  {
    category: "Red Team · Pentesting", title: "OWASP Juice Shop · evaluación web", source: "OWASP", description: "Aplicación vulnerable para practicar una evaluación web completa en un entorno controlado.", href: "https://owasp.org/www-project-juice-shop/", topics: ["web", "vulnerabilidades", "pentesting"], level: "Mixto", format: "Laboratorio", language: "Inglés", access: "Gratis"
  },
  {
    category: "CTF", title: "OWASP Juice Shop · desafíos", source: "OWASP", description: "Desafíos progresivos para resolver vulnerabilidades web como práctica tipo CTF.", href: "https://owasp.org/www-project-juice-shop/", topics: ["web", "desafíos", "CTF"], level: "Mixto", format: "Laboratorio", language: "Inglés", access: "Gratis"
  },
  {
    category: "Windows", title: "LOLBAS · referencia Windows", source: "LOLBAS", description: "Catálogo de binarios y scripts legítimos de Windows que pueden ser abusados y deben monitorearse.", href: "https://lolbas-project.github.io/", topics: ["Windows", "binarios", "living off the land"], level: "Avanzado", format: "Referencia", language: "Inglés", access: "Gratis", curation: "pendiente", warning: "Material dual-use: probá únicamente en sistemas propios o autorizados."
  },
  {
    category: "Blue Team", title: "LOLBAS · detección", source: "LOLBAS", description: "Referencia para identificar abuso de binarios nativos y mejorar reglas de monitoreo en Windows.", href: "https://lolbas-project.github.io/", topics: ["Windows", "detección", "telemetría"], level: "Avanzado", format: "Referencia", language: "Inglés", access: "Gratis"
  },
  {
    category: "Cloud", title: "Google Security Operations · cloud", source: "Google Cloud", description: "Ruta de Google Cloud centrada en operaciones de seguridad, útil para estudiar servicios y flujos SIEM/SOAR.", href: "https://www.skills.google/paths/581", topics: ["Google Cloud", "SIEM", "SOAR", "operaciones"], level: "Intermedio", format: "Ruta de aprendizaje", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Blue Team", title: "Microsoft Security Solutions · defensa", source: "Microsoft Learn", description: "Ruta oficial sobre Defender, Sentinel, Entra y capacidades defensivas de Microsoft.", href: "https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-security-solutions/", topics: ["Defender", "Sentinel", "Entra", "detección"], level: "Inicial", format: "Ruta de aprendizaje", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Cloud", title: "Microsoft Security Solutions · infraestructura", source: "Microsoft Learn", description: "La misma ruta enfocada en capacidades de seguridad de red, plataforma y servicios Azure.", href: "https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-security-solutions/", topics: ["Azure", "infraestructura", "cloud security"], level: "Inicial", format: "Ruta de aprendizaje", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Cloud", title: "Protect network infrastructure in Azure", source: "Microsoft Learn", description: "Ruta específica para proteger infraestructura de red en Azure.", href: "https://learn.microsoft.com/en-us/training/career-paths/security-engineer", topics: ["Azure", "redes", "seguridad cloud"], level: "Intermedio", format: "Career path", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Blue Team", title: "Manage security posture with Defender for Cloud", source: "Microsoft Learn", description: "Ruta específica para postura de seguridad, CSPM, protección de workloads y visibilidad multicloud.", href: "https://learn.microsoft.com/en-us/training/paths/manage-security-posture-defender-cloud/", topics: ["CSPM", "Defender for Cloud", "multicloud"], level: "Intermedio", format: "Ruta de aprendizaje", language: "Inglés", access: "Gratis; puede requerir cuenta"
  },
  {
    category: "Cloud", title: "Manage security posture with Defender for Cloud", source: "Microsoft Learn", description: "Ruta centrada en conectar y proteger entornos Azure, AWS y GCP desde una postura multicloud.", href: "https://learn.microsoft.com/en-us/training/paths/manage-security-posture-defender-cloud/", topics: ["Azure", "AWS", "GCP", "CSPM"], level: "Intermedio", format: "Ruta de aprendizaje", language: "Inglés", access: "Gratis; puede requerir cuenta"
  }
];
