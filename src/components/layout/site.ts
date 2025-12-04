
import { CarFront, Home, Info, PenTool, Phone } from "lucide-react";

export const NAV_LINKS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/accompagnement", label: "Accompagnement", icon: CarFront },
  { href: "/mecanique", label: "Mécanique", icon: PenTool },
  { href: "/propos", label: "À Propos", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone, isCta: true },
];