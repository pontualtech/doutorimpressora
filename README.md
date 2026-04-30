# Doutor Impressora — Site v2 (starter)

Estrutura inicial para reconstrução do site `doutorimpressora.com` saindo do Wix para GitHub Pages, seguindo o mesmo padrão dos sites irmãos (sosimpressora, rcimpressoras, pontualtech.net).

## Estado atual

- **5 páginas-alvo** ainda a desenvolver: `index.html` (placeholder pronto), `servicos.html`, `sobre.html`, `contato.html`, `dicas.html`
- **9 redirects HTML estáticos** já criados para URLs Wix legacy (`/conserto-de-impressora/`, `/book-online/`, `/members/`, `/blog/`, `/post/...`, `/servicos/`, `/quem-somos/`, `/contate-nos/`, etc.)
- **SEO multi-engine + AI** já configurado: `robots.txt` com 14 motores + 17 AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.), `llms.txt`, `sitemap.xml`
- `CNAME` apontando para `doutorimpressora.com`
- `.nojekyll` para evitar processamento Jekyll do GitHub Pages
- Schema.org `LocalBusiness` + `FAQPage` no `index.html`

## Como deployar

### 1. Criar repositório GitHub

```bash
# Via web: https://github.com/new
# Owner: pontualtech
# Repo: doutorimpressora
# Visibility: Public (necessário para GitHub Pages no plano free)
```

### 2. Inicializar git local e fazer push

```bash
cd "site-doutorimpressora-v2"
git init
git branch -M main
git remote add origin https://github.com/pontualtech/doutorimpressora.git
git add .
git commit -m "feat: initial site structure with SEO multi-engine + AI"
git push -u origin main
```

### 3. Habilitar GitHub Pages

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Custom domain: `doutorimpressora.com`
5. Aguardar checkmark verde
6. Após DNS propagar, marcar **Enforce HTTPS**

### 4. Mudar DNS (sair do Wix)

Atualmente em `ns4.wixdns.net` e `ns5.wixdns.net`.

Opção mais simples: trocar A records no Wix Domains pra apontar para os IPs do GitHub Pages.

A records (apex):
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

CNAME (www): `pontualtech.github.io`

⚠ Antes de trocar DNS, baixar TTL pra 300s. Após troca, validar com `curl -I https://doutorimpressora.com/`.

## Próximos passos do design

1. Refazer `index.html` com identidade visual definitiva (manter `<head>` SEO já completo)
2. Criar `servicos.html`, `sobre.html`, `contato.html`, `dicas.html` (replicar `<head>` SEO)
3. Adicionar GA4/GTM/Pixel (igual aos sites irmãos)
4. Criar formulário de contato (FormSubmit, Web3Forms, ou Cloudflare Forms)
5. Conteúdo: ver Plano 90d em `SEO_MASTER_PLAN_2026-04-30.md`
