export class Url {
  // Ensures this does not end in slash
  static baseUrl() {
    const base = process.env.NEXT_PUBLIC_APP_BASE_URL
    return base?.endsWith('/') ? base.slice(0, -1) : base
  }

  static getAbsolutePath(path: string) {
    if (path.startsWith('http')) {
      return path
    }

    return this.baseUrl() + (path.startsWith('/') ? '' : '/') + path
  }
}
