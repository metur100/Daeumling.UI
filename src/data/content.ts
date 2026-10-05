export const contact = {
  phone: '09081 290 9 290',
  phoneHref: 'tel:090812909290',
  email: 'info@däumling.de',
  emailHref: 'mailto:info@xn--dumling-5wa.de',
}

export const nav = [
  { id: 'system', label: 'Leistungen' },
  { id: 'ablauf', label: 'Ablauf' },
  { id: 'check', label: 'Blitz-Check' },
  { id: 'unternehmen', label: 'Unternehmen' },
  { id: 'standorte', label: 'Standorte' },
  { id: 'wissen', label: 'Wissen' },
  { id: 'faq', label: 'FAQ' },
]

export type PartId = 'fang' | 'ableitung' | 'erdung' | 'spd' | 'pruefung'

export const parts: {
  id: PartId
  title: string
  tech: string
  text: string
  points: string[]
}[] = [
  {
    id: 'fang',
    title: 'Blitzschutzplanung',
    tech: 'Fangeinrichtung',
    text: 'Fangstangen und Fangleitungen auf dem Dach sind der Punkt, an dem der Blitz einschlagen soll. Wir planen sie passgenau für Ihr Gebäude, damit kein Bereich ungeschützt bleibt.',
    points: ['Schutzraum-Berechnung', 'Fangstangen und Maschennetz', 'Integration von PV-Anlagen'],
  },
  {
    id: 'ableitung',
    title: 'Gebäudeblitzschutz',
    tech: 'Ableitung',
    text: 'Der äußere Blitzschutz führt den Blitzstrom über Ableitungen an der Fassade kontrolliert nach unten – vorbei an allem, was brennen oder zerstört werden kann.',
    points: ['Neuinstallation und Nachrüstung', 'Denkmalgerechte Ausführung', 'Trennstellen für die Prüfung'],
  },
  {
    id: 'erdung',
    title: 'Erdungsanlagen',
    tech: 'Erdung',
    text: 'Fundament-, Ring- und Tiefenerder leiten den Strom sicher ins Erdreich. Eine gute Erdung senkt zugleich das Risiko von Überspannungsschäden im ganzen Haus.',
    points: ['Fundament- und Ringerder', 'Tiefenerder', 'Erdungsmessung'],
  },
  {
    id: 'spd',
    title: 'Überspannungsschutz',
    tech: 'Innerer Blitzschutz',
    text: 'Überspannungsschutzgeräte reagieren blitzschnell und leiten hohe Ströme gefahrlos ab – bevor Elektronik, Heizung, Wechselrichter oder Server Schaden nehmen.',
    points: ['Potentialausgleich', 'Schutz für PV-Wechselrichter', 'Datenleitungen und Netzwerk'],
  },
  {
    id: 'pruefung',
    title: 'Prüfservice',
    tech: 'Prüfung und Wartung',
    text: 'Nur eine regelmäßig geprüfte Anlage schützt dauerhaft. Wir prüfen normgerecht, dokumentieren lückenlos und behalten Ihre Prüfintervalle im Blick.',
    points: ['Sicht- und umfassende Prüfung', 'Prüfbericht für die Versicherung', 'Erinnerung an Folgetermine'],
  },
]

export const steps = [
  { title: 'Bestandsaufnahme', text: 'Wir sehen uns Ihr Objekt vor Ort an – kostenlos und unverbindlich.' },
  { title: 'Prüfung', text: 'Normgerechte Prüfung Ihrer Anlage, ganz gleich wie alt sie ist.' },
  { title: 'Instandsetzung', text: 'Wir beheben Mängel und modernisieren nach aktuellem Stand der Technik.' },
  { title: 'Dokumentation', text: 'Lückenlose Prüfberichte – auch als Nachweis für Ihre Versicherung.' },
  { title: 'Überwachung', text: 'Wir behalten Ihre Prüfintervalle im Blick und melden uns rechtzeitig.' },
]

export const locations = [
  {
    id: 'noerdlingen',
    name: 'Nördlingen',
    role: 'Hauptsitz',
    street: 'Bei der Industriestraße 1',
    city: '86720 Nördlingen',
    phone: '09081 29 09 290',
    phoneHref: 'tel:090812909290',
    fax: '09081 29 09 292',
  },
  {
    id: 'muenchen',
    name: 'München',
    role: 'Filiale',
    street: 'Löfflerstraße 5a',
    city: '80999 München',
    phone: '089 200 407 82',
    phoneHref: 'tel:08920040782',
    fax: '089 925 642 34',
  },
  {
    id: 'voehringen',
    name: 'Vöhringen',
    role: 'Filiale',
    street: 'Carl-Benz-Straße 22',
    city: '89269 Vöhringen',
    phone: '07306 95 20 115',
    phoneHref: 'tel:073069520115',
    fax: '07306 95 20 116',
  },
  {
    id: 'kempten',
    name: 'Kempten',
    role: 'Filiale seit 2019',
    street: 'Ried 24b',
    city: '87477 Sulzberg',
    phone: '08376 97 63 946',
    phoneHref: 'tel:083769763946',
    fax: '08376 97 63 945',
  },
]


export const references = ['Große Kreisstadt Donauwörth', 'Donauries', 'Stadt Aalen']

export const posts = [
  {
    title: 'Wie hoch ist die Wahrscheinlichkeit, vom Blitz getroffen zu werden?',
    text: 'Blitze faszinieren – und sind gefährlicher, als viele denken. Wir ordnen das Risiko ein und zeigen, wie Sie sich schützen.',
    art: 'odds' as const,
  },
  {
    title: 'Was ist der Blitzschutz-Potentialausgleich?',
    text: 'Wie der Potentialausgleich Menschen, Sachwerte und sensible Elektronik vor gefährlichen Spannungsunterschieden schützt.',
    art: 'bonding' as const,
  },
  {
    title: 'Arten von Blitzschutzsystemen',
    text: 'Ein Überblick über die gängigen Systeme, die Gebäude, technische Anlagen und Menschen vor den Folgen eines Einschlags bewahren.',
    art: 'systems' as const,
  },
]

export const faqs = [
  {
    q: 'Was macht eine Blitzschutzfirma?',
    a: 'Eine Blitzschutzfirma ist ein Spezialbetrieb, der Blitzableiter, Erdungsanlagen und Überspannungsschutz plant, installiert und wartet. Sie sorgt dafür, dass Blitze sicher abgeleitet werden und Menschen sowie Sachwerte geschützt sind.',
  },
  {
    q: 'Woran erkenne ich eine zuverlässige Blitzschutzfirma?',
    a: 'Achten Sie auf Zertifikate, Referenzen und geschultes Fachpersonal – und auf eine ausführliche Beratung, eine transparente Kostenaufstellung und regelmäßige Wartungsangebote. Unsere Mitarbeiter sind vom VDB zertifizierte Blitzschutzfachkräfte.',
  },
  {
    q: 'Welche Leistungen gehören zu einer Blitzschutzanlage?',
    a: 'Zum ganzheitlichen Schutz gehören Planung, Installation, Erdung, Potentialausgleich und die regelmäßige Wartung des Blitzschutzsystems. Wir übernehmen alle Schritte aus einer Hand.',
  },
  {
    q: 'Was kostet eine Blitzschutzanlage?',
    a: 'Die Kosten hängen von Gebäudegröße, Gefährdungsgrad und Art des Systems ab. Nach der kostenlosen Bestandsaufnahme erstellen wir Ihnen ein individuelles, transparentes Angebot.',
  },
  {
    q: 'Warum ist eine moderne Blitzschutzanlage unverzichtbar?',
    a: 'Ein Einschlag kann Brände auslösen, elektrische Geräte zerstören, Menschen gefährden und wichtige Systeme wie Heizung, Server oder Notstrom lahmlegen. Moderne Anlagen kombinieren äußeren Blitzschutz mit innerem Blitzschutz. Nur fachgerechte Planung und regelmäßige Wartung senken das Risiko dauerhaft – und erfüllen die Auflagen Ihrer Versicherung.',
  },
]
