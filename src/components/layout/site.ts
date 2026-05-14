
import { CarFront, Cpu, HelpCircle, Package, PenTool, Phone } from "lucide-react";

export const NAV_LINKS = [
  { href: "/pieces", label: "Pièces", icon: Package },
  { href: "/reprogrammation", label: "Reprogrammation", icon: Cpu },
  { href: "/accompagnement", label: "Accompagnement", icon: CarFront },
  { href: "/mecanique", label: "Mécanique", icon: PenTool },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/contact", label: "Prendre rendez-vous", icon: Phone, isCta: true },
];