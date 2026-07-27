import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DetectedOs = "windows" | "linux" | "other";

type DownloadButtonProps = {
  windowsUrl: string | null;
  linuxUrl: string | null;
  className?: string;
};

function detectOs(): DetectedOs {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux") || ua.includes("x11")) return "linux";
  return "other";
}

export function DownloadButton({
  windowsUrl,
  linuxUrl,
  className,
}: DownloadButtonProps) {
  const [os, setOs] = useState<DetectedOs>("other");

  useEffect(() => {
    setOs(detectOs());
  }, []);

  const href = os === "windows" ? windowsUrl : os === "linux" ? linuxUrl : null;

  const label =
    os === "windows"
      ? "Download for Windows"
      : os === "linux"
        ? "Download for Linux"
        : "Download";

  return (
    <a
      href={href ?? "/download"}
      className={cn(buttonVariants({ size: "xl" }), className)}
      {...(href ? { download: true } : {})}
    >
      {label}
    </a>
  );
}
