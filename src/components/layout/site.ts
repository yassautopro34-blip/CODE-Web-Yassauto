
import { Euro, Package, PenTool, Phone, ShieldAlert } from "lucide-react";

export const NAV_LINKS = [
  { href: "/mecanique", label: "Mécanique", icon: PenTool },
  { href: "/tarifs", label: "Tarifs", icon: Euro },
  { href: "/reprogrammation", label: "FAP / EGR", icon: ShieldAlert },
  { href: "/pieces", label: "Pièces", icon: Package },
  { href: "/contact", label: "Contact", icon: Phone, isCta: true },
];