# Pulser — Personal Music Streaming App

## O que é

Pulser é um streaming de música pessoal, estilo Spotify, rodando localmente em um PC e acessível via app iOS na mesma rede WiFi. O objetivo é ter controle total sobre a biblioteca musical com alta qualidade de áudio.

---

## Estrutura do Monorepo

```
pulser/
├── pulser-api/        → Backend Node.js (Fastify)
├── pulser-mobile/     → App React Native (Expo)
└── PULSER.md          → Este arquivo
```

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Fastify |
| ORM | Prisma |
| Banco | PostgreSQL |
| Transcodificação | FFmpeg via fluent-ffmpeg |
| Metadados | music-metadata |
| Mobile | React Native + Expo |
| Reprodução | expo-av |
| Processo (PC) | PM2 |

---

## Arquitetura

```
iPhone (Expo app)
      ↕  HTTP — WiFi local (ex: 192.168.1.100:3000)
  pulser-api (Fastify)
      ↕
  PostgreSQL + Arquivos de áudio no PC
```

O PC serve de servidor. O iPhone conecta via IP local fixo. Sem acesso externo por enquanto (futuro: Tailscale).

---

## Funcionalidades Planejadas

### Reprodução
- [x] Stream de áudio em alta qualidade (FLAC/MP3 → AAC/Opus via FFmpeg)
- [x] Escolha de mono ou stereo (parâmetro na requisição, FFmpeg aplica `-ac 1` ou `-ac 2`)
- [x] Transição entre faixas (crossfade configurável via FFmpeg ou Web Audio)
- [x] Play, Pause, Next, Previous
- [x] Shuffle (Fisher-Yates)

### Interface
- [x] Exibição de capa do álbum, nome da música e artista
- [x] Pesquisa por nome da música, álbum ou artista
- [x] Página de artista (com todos os álbuns)
- [x] Página de álbum (com todas as faixas)
- [x] Criação, exibição e reprodução de playlists

---

## Modelo de Dados (Prisma — visão geral)

```
Artist
  ├── id, name, bio, imageUrl
  └── → Album[]

Album
  ├── id, title, year, coverUrl, artistId
  └── → Track[]

Track
  ├── id, title, duration, filePath, trackNumber, albumId
  └── → PlaylistTrack[]

Playlist
  ├── id, name, createdAt
  └── → PlaylistTrack[]

PlaylistTrack
  └── playlistId, trackId, position
```

---

## API — Endpoints Principais

```
GET  /tracks/:id/stream          → Stream da faixa (range requests, ?mono=true)
GET  /tracks/search?q=           → Pesquisa full-text
GET  /artists/:id                → Dados do artista + álbuns
GET  /albums/:id                 → Dados do álbum + faixas
GET  /playlists                  → Lista todas as playlists
POST /playlists                  → Cria playlist
GET  /playlists/:id              → Faixas de uma playlist
POST /playlists/:id/tracks       → Adiciona faixa à playlist
GET  /covers/:filename           → Serve capa do álbum (estático)
```

---

## App Mobile (Expo)

Telas planejadas:
- **Home** — Playlists recentes, acesso rápido
- **Busca** — Input de pesquisa, resultados em tempo real
- **Artista** — Foto, bio, lista de álbuns
- **Álbum** — Capa, lista de faixas
- **Playlist** — Lista de faixas, opção de shuffle
- **Player** — Capa grande, controles (play/pause/next/prev), barra de progresso, opção mono/stereo

---

## Fluxo de Import de Músicas

1. Usuário coloca arquivos de áudio em um diretório configurável (ex: `~/Music/Pulser`)
2. Script de import (`pulser-api/scripts/import.ts`) varre o diretório
3. `music-metadata` lê ID3 tags (artista, álbum, título, ano, capa embutida)
4. Capa é extraída e salva em `pulser-api/public/covers/`
5. Dados são inseridos no PostgreSQL via Prisma

---

## Configuração de Ambiente (pulser-api)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/pulser
MUSIC_PATH=/Users/seu-usuario/Music/Pulser
COVERS_PATH=./public/covers
PORT=3000
```

---

## Migração para NAS (futuro)

Quando vier o NAS:
1. Mover arquivos de áudio para o NAS
2. Atualizar `MUSIC_PATH` e `COVERS_PATH` no `.env`
3. Fazer `pg_dump` e `pg_restore` no novo host
4. O app iOS muda apenas o IP de destino (ou usar Tailscale para IP fixo via VPN mesh)

---

## Como Continuar (próximos passos sugeridos)

1. **Configurar o banco** — criar o schema Prisma completo em `pulser-api/prisma/schema.prisma`
2. **Criar o servidor Fastify** — estrutura base com plugins (cors, static, multipart)
3. **Implementar o endpoint de stream** — com suporte a HTTP range requests e FFmpeg
4. **Script de import** — varredura de diretório, leitura de metadados, persistência
5. **Iniciar o app Expo** — configurar navegação (Expo Router) e tela do player

---

## Observações

- O servidor roda no PC com `pm2 start` para persistir entre reinicializações
- O iPhone precisa estar na mesma rede WiFi
- Configurar o roteador para reservar um IP fixo ao PC (DHCP reservation pelo MAC address)
- Para testar o app iOS sem Mac: usar **Expo Go** (desenvolvimento) ou **TestFlight** (distribuição interna)
