// got's default User-Agent ("got (https://github.com/sindresorhus/got)") gets
// blocked by Cloudflare bot protection on Notion's unofficial API. Sending a
// browser-like User-Agent avoids the 403.
const NOTION_GOT_OPTIONS = {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  }
}

export default NOTION_GOT_OPTIONS
