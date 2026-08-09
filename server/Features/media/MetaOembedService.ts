import envConfig from '../../Configs/envConfig.js';

export interface MetaOembedResponse {
  html?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  width?: number;
  height?: number;
}

export class MetaOembedService {
  /**
   * Obtiene el token de aplicación de Meta si las credenciales están presentes en la configuración.
   */
  private static getAppToken(): string | null {
    const appId = envConfig.MetaAppId;
    const appSecret = envConfig.MetaAppSecret;
    if (appId && appSecret) {
      return `${appId}|${appSecret}`;
    }
    return null;
  }

  /**
   * Consulta la API oEmbed oficial de Meta para Instagram o Facebook.
   * Retorna null si las credenciales no están configuradas o si la consulta falla, activando el fallback.
   */
  public static async fetchOembedInfo(url: string, type: 'facebook' | 'instagram'): Promise<MetaOembedResponse | null> {
    const token = this.getAppToken();
    if (!token || !url) {
      return null;
    }

    try {
      let endpoint = '';
      if (type === 'instagram') {
        endpoint = `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${token}`;
      } else {
        const isPost = /\/(posts|photos|permalink\.php|groups|reel|reels)\//i.test(url);
        const subEndpoint = isPost ? 'oembed_post' : 'oembed_video';
        endpoint = `https://graph.facebook.com/v19.0/${subEndpoint}?url=${encodeURIComponent(url)}&access_token=${token}`;
      }

      const res = await fetch(endpoint);
      if (!res.ok) {
        console.warn(`[MetaOembedService] Petición fallida (${res.status}): ${await res.text()}`);
        return null;
      }

      const data: MetaOembedResponse = await res.json();
      return data;
    } catch (err) {
      console.error('[MetaOembedService] Error al consultar Meta oEmbed API:', err);
      return null;
    }
  }
}
