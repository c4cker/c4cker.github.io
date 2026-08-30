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
    objective: "Ofrecer una utilidad educativa y directa para entender el flujo de gestión de claves y cifrado de archivos desde una interfaz interactiva de terminal.",
    pending: "Por ahora no tiene argumentos CLI, selección de algoritmos, gestión segura de secretos, borrado seguro de originales, pruebas automatizadas ni una interfaz gráfica. La clave debe conservarse manualmente: perderla impide descifrar el archivo.",
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
    objective: "Concentrar ejercicios pequeños de seguridad defensiva y reconocimiento autorizado en un único proyecto fácil de ejecutar y estudiar.",
    pending: "Por ahora el flujo es interactivo y monolítico: faltan una CLI con subcomandos, pruebas automatizadas, mejor manejo de errores, salida estructurada, límites configurables para el escaneo, detección de versiones de servicios y el refactor indicado en el README. El escaneo y las consultas deben limitarse a activos propios o autorizados.",
    repoUrl: "https://github.com/c4cker/Tool-box"
  }
];
