import type { Project } from "./projects";

export const projects: Project[] = [
  {
    slug: "encrypy",
    title: "EncryPy",
    status: "activo",
    kind: "Script",
    stack: "Python",
    language: "Python",
    description: "Herramienta de consola que protege archivos propios mediante cifrado simétrico autenticado.",
    detail: "EncryPy resuelve una necesidad concreta: cifrar un archivo y recuperar su contenido después usando una clave local. Implementa generación y carga de claves, cifrado y descifrado con Fernet a través de la librería cryptography, y crea archivos con los sufijos _encrypted y _decrypted.",
    objective: "Crear una utilidad para practicar gestión de claves y cifrado de archivos.",
    pending: "Pendientes: argumentos CLI, pruebas automatizadas, salida estructurada y gestión segura de secretos.",
    repoUrl: "https://github.com/c4cker/EncryPy"
  },
  {
    slug: "tool-box",
    title: "Tool-box",
    status: "activo",
    kind: "colección de scripts",
    stack: "Python",
    language: "Python",
    description: "Caja de herramientas educativa para practicar generación de secretos y reconocimiento básico de red.",
    detail: "Tool-box reúne cuatro utilidades en una aplicación interactiva: generador de contraseñas, analizador DNS/WHOIS, escáner TCP de puertos y comprobador de hashes SHA-256 mediante diccionario. Sirve como punto de partida para observar entradas, validaciones, consultas de red y resultados en scripts Python.",
    objective: "Reunir ejercicios pequeños de seguridad defensiva y reconocimiento autorizado en una herramienta ejecutable.",
    pending: "Pendientes: CLI con subcomandos, pruebas automatizadas, salida estructurada, límites configurables y detección de versiones. Limitá los escaneos y las consultas a activos propios o autorizados.",
    repoUrl: "https://github.com/c4cker/Tool-box"
  }
];
