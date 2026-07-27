export type OsPlatform = "windows" | "linux";

export type ReleaseAsset = {
  name: string;
  size: number;
  url: string;
  kind: "exe" | "msi" | "deb" | "appimage" | "rpm" | "other";
};

export type Release = {
  tag: string;
  name: string;
  publishedAt: string | null;
  htmlUrl: string;
  windows: ReleaseAsset[];
  linux: ReleaseAsset[];
};

type GitHubAsset = {
  name: string;
  size: number;
  browser_download_url: string;
};

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  html_url: string;
  assets: GitHubAsset[];
};

const REPO_API = "https://api.github.com/repos/Franklivania/gwuma/releases";

const FALLBACK_RELEASE: Release = {
  tag: "v1.0.0",
  name: "Gwuma v1.0.0",
  publishedAt: "2026-07-26T17:07:17Z",
  htmlUrl: "https://github.com/Franklivania/gwuma/releases/tag/v1.0.0",
  windows: [
    {
      name: "Gwuma_1.0.0_x64-setup.exe",
      size: 2909415,
      url: "https://github.com/Franklivania/gwuma/releases/download/v1.0.0/Gwuma_1.0.0_x64-setup.exe",
      kind: "exe",
    },
    {
      name: "Gwuma_1.0.0_x64_en-US.msi",
      size: 3772416,
      url: "https://github.com/Franklivania/gwuma/releases/download/v1.0.0/Gwuma_1.0.0_x64_en-US.msi",
      kind: "msi",
    },
  ],
  linux: [
    {
      name: "Gwuma_1.0.0_amd64.deb",
      size: 3740576,
      url: "https://github.com/Franklivania/gwuma/releases/download/v1.0.0/Gwuma_1.0.0_amd64.deb",
      kind: "deb",
    },
    {
      name: "Gwuma_1.0.0_amd64.AppImage",
      size: 81414648,
      url: "https://github.com/Franklivania/gwuma/releases/download/v1.0.0/Gwuma_1.0.0_amd64.AppImage",
      kind: "appimage",
    },
    {
      name: "Gwuma-1.0.0-1.x86_64.rpm",
      size: 3741196,
      url: "https://github.com/Franklivania/gwuma/releases/download/v1.0.0/Gwuma-1.0.0-1.x86_64.rpm",
      kind: "rpm",
    },
  ],
};

function assetKind(name: string): ReleaseAsset["kind"] {
  const lower = name.toLowerCase();
  if (lower.endsWith(".exe")) return "exe";
  if (lower.endsWith(".msi")) return "msi";
  if (lower.endsWith(".deb")) return "deb";
  if (lower.endsWith(".appimage")) return "appimage";
  if (lower.endsWith(".rpm")) return "rpm";
  return "other";
}

function toAsset(asset: GitHubAsset): ReleaseAsset {
  return {
    name: asset.name,
    size: asset.size,
    url: asset.browser_download_url,
    kind: assetKind(asset.name),
  };
}

const WINDOWS_ORDER: ReleaseAsset["kind"][] = ["exe", "msi"];
const LINUX_ORDER: ReleaseAsset["kind"][] = ["deb", "appimage", "rpm"];

function sortByKind(
  assets: ReleaseAsset[],
  order: ReleaseAsset["kind"][],
): ReleaseAsset[] {
  return [...assets].sort(
    (a, b) => order.indexOf(a.kind) - order.indexOf(b.kind),
  );
}

function mapRelease(release: GitHubRelease): Release {
  const assets = release.assets.map(toAsset);
  const windows = sortByKind(
    assets.filter((a) => a.kind === "exe" || a.kind === "msi"),
    WINDOWS_ORDER,
  );
  const linux = sortByKind(
    assets.filter(
      (a) => a.kind === "deb" || a.kind === "appimage" || a.kind === "rpm",
    ),
    LINUX_ORDER,
  );

  return {
    tag: release.tag_name,
    name: release.name ?? release.tag_name,
    publishedAt: release.published_at,
    htmlUrl: release.html_url,
    windows,
    linux,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function getReleases(): Promise<Release[]> {
  try {
    const response = await fetch(REPO_API, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "gwuma-web",
      },
    });

    if (!response.ok) return [FALLBACK_RELEASE];

    const data = (await response.json()) as GitHubRelease[];
    const mapped = data
      .map(mapRelease)
      .filter((r) => r.windows.length || r.linux.length);
    return mapped.length > 0 ? mapped : [FALLBACK_RELEASE];
  } catch {
    return [FALLBACK_RELEASE];
  }
}

export async function getLatestRelease(): Promise<Release> {
  const releases = await getReleases();
  return releases[0] ?? FALLBACK_RELEASE;
}

export function getDownloadForOs(
  release: Release,
  os: OsPlatform,
): ReleaseAsset | null {
  const list = os === "windows" ? release.windows : release.linux;
  return list[0] ?? null;
}
