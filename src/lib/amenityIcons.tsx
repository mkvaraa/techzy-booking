import type { AmenityId } from "@/types"
import {
  AccessibilityIcon,
  MonitorIcon,
  PencilRulerIcon,
  PhoneIcon,
  ProjectorIcon,
  SunIcon,
  TvIcon,
  UtensilsIcon,
  VideoIcon,
  WifiIcon,
  type LucideIcon,
} from "lucide-react"

export const AMENITY_ICONS: Record<AmenityId, LucideIcon> = {
  projector: ProjectorIcon,
  whiteboard: PencilRulerIcon,
  video_conference: VideoIcon,
  tv_screen: TvIcon,
  conference_phone: PhoneIcon,
  wifi: WifiIcon,
  standing_desk: MonitorIcon,
  accessible: AccessibilityIcon,
  catering: UtensilsIcon,
  natural_light: SunIcon,
}
