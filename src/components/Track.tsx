"use client";

import { useEffect, useRef } from "react";
import { track, trafficSource, type EventName } from "@/lib/analytics";

/** Fires a single analytics event once on mount. */
export default function Track({
  event,
  withSource = false,
  archetype,
}: {
  event: EventName;
  withSource?: boolean;
  archetype?: string;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    void track(event, {
      archetype,
      metadata: withSource ? trafficSource() : undefined,
    });
  }, [event, withSource, archetype]);
  return null;
}
