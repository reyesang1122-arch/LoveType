"use client";

import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";

/** Xinyu CTA link that logs a `xinyu_clicked` event before navigating out. */
export default function XinyuButton({
  className,
  children,
  archetype,
}: {
  className?: string;
  children: React.ReactNode;
  archetype?: string;
}) {
  return (
    <a
      href={SITE.xinyuUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => void track("xinyu_clicked", { archetype })}
    >
      {children}
    </a>
  );
}
