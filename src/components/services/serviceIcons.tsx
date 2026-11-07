import {
  CameraIcon,
  ChartIcon,
  DocumentIcon,
  GlobeIcon,
  HandshakeIcon,
  SmartSearchIcon,
} from "@/components/ui/Icons";
import type { ServiceIcon } from "@/types/service";

/* Drawn in the shared icon library, so they match the rest of the site. */
const icons: Record<
  ServiceIcon,
  React.ComponentType<{ className?: string }>
> = {
  handshake: HandshakeIcon,
  document: DocumentIcon,
  search: SmartSearchIcon,
  globe: GlobeIcon,
  camera: CameraIcon,
  chart: ChartIcon,
};

/**
 * The icon for a service. Falls back rather than crashing the render, since
 * the key comes from an admin-editable row.
 */
export function iconFor(
  key: string,
): React.ComponentType<{ className?: string }> {
  return icons[key as ServiceIcon] ?? HandshakeIcon;
}
