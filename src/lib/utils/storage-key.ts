function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, '');
}

export function getObjectKeyFromUrl(value: string, publicBaseUrl?: string) {
  if (!value) {
    return '';
  }

  if (publicBaseUrl) {
    const normalizedBaseUrl = publicBaseUrl.replace(/\/+$/, '');

    if (value.startsWith(`${normalizedBaseUrl}/`)) {
      return value.slice(normalizedBaseUrl.length + 1);
    }
  }

  try {
    const parsedUrl = new URL(value);
    const path = trimSlashes(parsedUrl.pathname);

    if (!publicBaseUrl) {
      return decodeURIComponent(path);
    }

    const basePath = trimSlashes(new URL(publicBaseUrl).pathname);

    if (!basePath) {
      return decodeURIComponent(path);
    }

    return decodeURIComponent(path.replace(new RegExp(`^${basePath}/?`), ''));
  } catch {
    return trimSlashes(value);
  }
}
