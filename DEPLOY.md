# Deploy doutorimpressora.com — Wix → GitHub Pages

Passo-a-passo pra colocar o site novo no ar. Tempo total: ~30 min (incluindo propagação DNS).

---

## ✅ Pré-checagem (já feito)

- [x] Estrutura local em `site-doutorimpressora-v2/` com 5 HTMLs + redirects + arquivos SEO
- [x] Push no monorepo `opensquad-content` (commit `aa101bb`)
- [x] CNAME = `doutorimpressora.com`
- [x] `.nojekyll` + `robots.txt` + `sitemap.xml` + `llms.txt`

---

## Passo 1 — Criar repo dedicado no GitHub (3 min)

GitHub Pages precisa de **um repo separado** (não pode ser subpasta do `opensquad-content`). Vai em:

**https://github.com/new**

Configura:
- **Owner:** `pontualtech`
- **Repository name:** `doutorimpressora`
- **Visibility:** `Public` (obrigatório no plano grátis do GitHub Pages)
- **NÃO** marca "Add README", "Add .gitignore" nem "Add license" — repo precisa estar vazio
- Clica **Create repository**

---

## Passo 2 — Push do conteúdo local (5 min)

Abre o terminal nessa pasta e roda:

```bash
cd "c:/Users/pontu/Downloads/CURSO  CLAUDE/site-doutorimpressora-v2"

git init
git branch -M main
git remote add origin https://github.com/pontualtech/doutorimpressora.git
git add .
git commit -m "feat: initial site with SEO multi-engine + AI"
git push -u origin main
```

Se pedir login GitHub, usa o token que você usa nos outros repos (mesmo do sosimpressora/rcimpressoras).

---

## Passo 3 — Habilitar GitHub Pages (2 min)

1. Vai em https://github.com/pontualtech/doutorimpressora/settings/pages
2. **Source:** `Deploy from a branch`
3. **Branch:** `main`
4. **Folder:** `/ (root)`
5. Clica **Save**
6. Em **Custom domain:** digita `doutorimpressora.com` e Save
7. Vai dar erro DNS (esperado — ainda não trocamos DNS). Ignora.
8. **NÃO marca "Enforce HTTPS" ainda.** Marca depois que DNS propagar.

Em ~1 min o GitHub vai buildar e o site fica acessível em:
**https://pontualtech.github.io/doutorimpressora/**

**Teste essa URL antes de mexer em DNS.** Se o site aparece (mesmo o placeholder), build funcionou.

---

## Passo 4 — Trocar A records no Wix Domains (5 min)

⚠ **MOMENTO CRÍTICO** — depois daqui o site Wix antigo deixa de aparecer.

### 4.1 — Antes de mexer, baixa TTL (faz isso primeiro)

1. Login em https://wix.com → entra na conta dona do `doutorimpressora.com`
2. **My Account** → **Domains** → escolhe `doutorimpressora.com`
3. **Advanced** → **DNS Records** (ou "Edit DNS")
4. Pra cada registro existente, muda **TTL** pra **300** (5 min) e salva
5. **Espera 1 hora** antes do passo 4.2 (TTL antigo expirar)

### 4.2 — Trocar A records pra GitHub Pages

Volta no DNS Records e:

**Remove os A records existentes do Wix** (apontam pra IPs Wix, geralmente começam com `185.230.x` ou `23.236.x`).

**Adiciona estes 4 A records novos** (apex `@`):

| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| A | @ | `185.199.108.153` | 300 |
| A | @ | `185.199.109.153` | 300 |
| A | @ | `185.199.110.153` | 300 |
| A | @ | `185.199.111.153` | 300 |

**Substitui o CNAME `www`:**

| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| CNAME | www | `pontualtech.github.io` | 300 |

Salva.

### 4.3 — Aguardar propagação (5–30 min)

Testa no terminal:

```bash
curl -I https://doutorimpressora.com/
nslookup doutorimpressora.com 8.8.8.8
```

Quando o `Server:` retornar `GitHub.com` (em vez de `Pepyaka` do Wix), DNS propagou.

Pra checagem visual: https://dnschecker.org/#A/doutorimpressora.com

---

## Passo 5 — Habilitar HTTPS no GitHub Pages (1 min)

1. Volta em https://github.com/pontualtech/doutorimpressora/settings/pages
2. Aguarda o checkmark verde de "DNS check successful" (até 24h, geralmente <1h)
3. **Marca "Enforce HTTPS"**
4. Aguarda o certificado Let's Encrypt ser emitido (até 24h, geralmente minutos)

---

## Passo 6 — Validação final

Testa todas as URLs antigas Wix esperando 301 ou 200 (redirect HTML):

```bash
for u in /servicos /quem-somos /contate-nos /conserto-de-impressora /book-online /members /blog; do
  echo "${u}: $(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "https://doutorimpressora.com${u}/")"
done
```

E testa as 5 páginas do site novo:

```bash
for u in / /servicos.html /sobre.html /contato.html /dicas.html; do
  echo "${u}: $(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "https://doutorimpressora.com${u}")"
done
```

Esperado: **todos 200**.

---

## Passo 7 — Pós-deploy (mesmo dia)

- [ ] Atualizar telefone WhatsApp em todos os HTMLs (placeholder `ATUALIZAR`)
- [ ] Adicionar GA4/GTM IDs (copiar do site irmão `pontualtech-site` ou criar novo)
- [ ] Submeter sitemap em:
  - Google Search Console: `https://doutorimpressora.com/sitemap.xml`
  - Bing Webmaster: idem
  - Yandex Webmaster: idem
- [ ] **Cancelar plano Wix** (se não tiver outro site lá) — economiza mensalidade
- [ ] Adicionar perfil **Google Meu Negócio** com NAP idêntico

---

## Rollback (se algo der errado)

DNS se reverte fácil:

1. Volta no Wix Domain DNS
2. Remove os 4 A records do GitHub Pages
3. Adiciona de volta os A records originais do Wix (anota antes de remover, no passo 4.2!)
4. Em 5 min (TTL=300) volta pro Wix antigo

Por isso o passo 4.1 é importante: TTL baixo permite reversão rápida.

---

## Troubleshooting

**"DNS check successful" não aparece após 24h:**
- Confirma os 4 A records exatos no Wix
- `dig +short doutorimpressora.com` deve retornar os 4 IPs do GitHub

**Site abre mas mostra 404 do GitHub:**
- Confirma que `CNAME` no repo tem `doutorimpressora.com` na primeira linha (sem `www.`)
- Confirma que branch é `main` e folder `/ (root)` em Settings → Pages

**HTTPS não habilita:**
- GitHub leva até 24h pra emitir cert. Aguarda.
- Se passar 24h: Settings → Pages → desmarca custom domain → salva → marca de novo → salva

**Algum redirect (ex `/servicos/`) dá 404:**
- Confirma que pastas `servicos/`, `quem-somos/`, etc estão no repo (com `index.html` dentro)
- Se faltou, faz outro `git push` com elas
