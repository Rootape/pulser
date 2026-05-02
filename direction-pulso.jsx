// PULSO — Elétrica noturna
// Lime ácido + magenta + carvão. Tech-monoespaço, energia rave/club.
// Conceito: onda concêntrica / pulso sonoro

const pulso = {
  bg: '#0A0A0A',
  surface: '#111111',
  surface2: '#1A1A1A',
  ink: '#F2F2EE',
  inkMute: 'rgba(242,242,238,0.55)',
  inkFaint: 'rgba(242,242,238,0.16)',
  primary: '#C4FF3D',     // toxic lime
  primaryDeep: '#8FCC1A',
  magenta: '#FF2E97',     // hot magenta
  cyan: '#00E5D1',
  hairline: 'rgba(242,242,238,0.10)',
  font: '"Space Grotesk", -apple-system, sans-serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
};

function PulsoLogo({ size = 1, mono = false }) {
  const lime = mono ? pulso.ink : pulso.primary;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 * size, fontFamily: pulso.font }}>
      <PulsoMark size={36 * size} lime={lime} />
      <div style={{
        fontSize: 38 * size, fontWeight: 700, letterSpacing: -1.6 * size, color: pulso.ink,
        lineHeight: 0.9, textTransform: 'lowercase', display: 'flex', alignItems: 'baseline',
      }}>
        dreamvy
        <span style={{ color: lime, marginLeft: 1 }}>.</span>
      </div>
    </div>
  );
}

function PulsoMark({ size = 36, lime = pulso.primary, bg }) {
  // Concentric pulse — three offset arcs from a center dot
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" style={{ display: 'block' }}>
      {bg && <rect width="36" height="36" rx="8" fill={bg} />}
      <circle cx="18" cy="18" r="3" fill={lime} />
      <path d="M 8 18 a 10 10 0 0 1 20 0" fill="none" stroke={lime} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 3 18 a 15 15 0 0 1 30 0" fill="none" stroke={lime} strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function PSw({ c, name, hex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ width: 72, height: 92, background: c,
        boxShadow: 'inset 0 0 0 1px ' + pulso.hairline }} />
      <div style={{ fontSize: 10, color: pulso.ink, fontFamily: pulso.mono, letterSpacing: 0.5 }}>{name}</div>
      <div style={{ fontSize: 10, color: pulso.inkMute, fontFamily: pulso.mono }}>{hex}</div>
    </div>
  );
}

function PulsoFrame({ children, pad = 48, bg = pulso.bg }) {
  return (
    <div style={{ width: '100%', height: '100%', background: bg, color: pulso.ink,
      fontFamily: pulso.font, padding: pad, boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
}

function PulsoHero() {
  return (
    <PulsoFrame pad={0}>
      {/* grid bg */}
      <div style={{ position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${pulso.hairline} 1px, transparent 1px), linear-gradient(90deg, ${pulso.hairline} 1px, transparent 1px)`,
        backgroundSize: '32px 32px', opacity: 0.6 }} />
      {/* corner pulses */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: '50%',
        background: `radial-gradient(circle, ${pulso.primary}40, transparent 60%)` }} />
      <div style={{ position: 'absolute', bottom: -100, left: -80, width: 280, height: 280, borderRadius: '50%',
        background: `radial-gradient(circle, ${pulso.magenta}30, transparent 60%)` }} />
      <div style={{ position: 'absolute', inset: 0, padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, letterSpacing: 1 }}>
            DIR_02 / PULSO
          </div>
          <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.primary, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: pulso.primary,
              boxShadow: `0 0 12px ${pulso.primary}` }} />
            REC ●
          </div>
        </div>
        <div>
          <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.primary, letterSpacing: 2, marginBottom: 16 }}>
            &gt; ONDA / PULSO / SOM
          </div>
          <PulsoLogo size={1.6} />
          <div style={{ marginTop: 28, fontSize: 14, lineHeight: 1.6, color: pulso.inkMute, maxWidth: 380 }}>
            Energia de balada traduzida em sistema. Lime ácido, magenta
            elétrico, monoespaço como linguagem. Marca que vibra antes da
            primeira batida.
          </div>
        </div>
        <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.inkMute, display: 'flex', justifyContent: 'space-between' }}>
          <span>BPM: 128</span>
          <span>FREQ: 60Hz</span>
          <span>AMP: ████░░</span>
        </div>
      </div>
    </PulsoFrame>
  );
}

function PulsoLogoSheet() {
  return (
    <PulsoFrame>
      <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, letterSpacing: 1, marginBottom: 32 }}>
        // logo / construção
      </div>
      <div style={{ borderTop: `1px solid ${pulso.hairline}`, paddingTop: 28, marginBottom: 28 }}>
        <PulsoLogo size={1.5} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.inkMute, letterSpacing: 1, marginBottom: 14 }}>SÍMBOLO</div>
          <PulsoMark size={88} />
          <div style={{ marginTop: 14, fontSize: 12, color: pulso.inkMute, lineHeight: 1.5, maxWidth: 220 }}>
            Onda concêntrica que parte de um ponto. Anima como pulso quando há eventos novos próximos.
          </div>
        </div>
        <div>
          <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.inkMute, letterSpacing: 1, marginBottom: 14 }}>WORDMARK</div>
          <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: -2, lineHeight: 0.9, color: pulso.ink, display: 'flex', alignItems: 'baseline' }}>
            dreamvy<span style={{ color: pulso.primary }}>.</span>
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: pulso.inkMute, lineHeight: 1.5, maxWidth: 220 }}>
            Space Grotesk Bold. O ponto lime é assinatura — sempre presente.
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${pulso.hairline}`, paddingTop: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ background: pulso.primary, padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PulsoMark size={28} lime={pulso.bg} />
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -1, color: pulso.bg, lineHeight: 0.9 }}>
              dreamvy<span>.</span>
            </div>
          </div>
        </div>
        <div style={{ background: pulso.ink, padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PulsoMark size={28} lime={pulso.bg} />
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -1, color: pulso.bg, lineHeight: 0.9 }}>
              dreamvy<span style={{ color: pulso.bg }}>.</span>
            </div>
          </div>
        </div>
      </div>
    </PulsoFrame>
  );
}

function PulsoColors() {
  return (
    <PulsoFrame>
      <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, letterSpacing: 1, marginBottom: 32 }}>
        // paleta
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.inkMute, letterSpacing: 1, marginBottom: 14 }}>PRIMÁRIAS</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <PSw c={pulso.bg} name="carvão" hex="#0A0A0A" />
          <PSw c={pulso.primary} name="lime" hex="#C4FF3D" />
          <PSw c={pulso.magenta} name="magenta" hex="#FF2E97" />
          <PSw c={pulso.ink} name="bone" hex="#F2F2EE" />
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.inkMute, letterSpacing: 1, marginBottom: 14 }}>SECUNDÁRIAS</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <PSw c={pulso.surface} name="surface" hex="#111111" />
          <PSw c={pulso.surface2} name="surface 2" hex="#1A1A1A" />
          <PSw c={pulso.primaryDeep} name="lime fundo" hex="#8FCC1A" />
          <PSw c={pulso.cyan} name="cyan" hex="#00E5D1" />
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${pulso.hairline}`, paddingTop: 20, fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, lineHeight: 1.7, maxWidth: 480 }}>
        // carvão = base. lime = ação, ao-vivo, primary CTA.<br/>
        // magenta = social, paixão, alertas afetivos.<br/>
        // cyan = info, links, tags neutras.<br/>
        // sem cinzas mortos. saturação alta, sempre.
      </div>
    </PulsoFrame>
  );
}

function PulsoType() {
  return (
    <PulsoFrame>
      <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, letterSpacing: 1, marginBottom: 32 }}>
        // tipografia
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -2, color: pulso.ink, lineHeight: 1 }}>
            Space Grotesk
          </div>
          <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute }}>display + ui</div>
        </div>
        <div style={{ fontSize: 12, color: pulso.inkMute }}>Geométrica com personalidade. Bold para gritar, regular para conversa.</div>
      </div>
      <div style={{ marginBottom: 32, borderTop: `1px solid ${pulso.hairline}`, paddingTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontFamily: pulso.mono, fontSize: 36, fontWeight: 500, color: pulso.primary, lineHeight: 1 }}>
            JetBrains Mono
          </div>
          <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute }}>meta · code</div>
        </div>
        <div style={{ fontSize: 12, color: pulso.inkMute }}>Para metadados, timestamps, contagens, status. Sinaliza estrutura.</div>
      </div>
      <div style={{ borderTop: `1px solid ${pulso.hairline}`, paddingTop: 20 }}>
        <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.inkMute, letterSpacing: 1, marginBottom: 16 }}>ESCALA</div>
        {[
          { sz: 44, w: 700, l: 'display/700', t: 'A noite É AGORA' },
          { sz: 28, w: 700, l: 'h1/700', t: 'Próximos eventos' },
          { sz: 18, w: 600, l: 'h2/600', t: 'Carrossel da Lapa' },
          { sz: 14, w: 400, l: 'body/400', t: 'O carrossel mais barulhento da cidade' },
          { sz: 11, w: 500, l: 'meta/mono', t: 'SEX 02·MAI · 22:00 · LAPA', mono: true },
        ].map((r) => (
          <div key={r.l} style={{ display: 'flex', alignItems: 'baseline', gap: 20, padding: '10px 0', borderBottom: `1px solid ${pulso.hairline}` }}>
            <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.inkMute, width: 96, flexShrink: 0 }}>{r.l}</div>
            <div style={{ fontSize: r.sz, fontWeight: r.w, letterSpacing: r.sz > 24 ? -1 : 0, color: r.mono ? pulso.primary : pulso.ink,
              lineHeight: 1.05, fontFamily: r.mono ? pulso.mono : pulso.font }}>
              {r.t}
            </div>
          </div>
        ))}
      </div>
    </PulsoFrame>
  );
}

function PulsoAppIcon() {
  return (
    <PulsoFrame pad={0} bg="#1a1a1c">
      <div style={{ position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 30% 30%, #2a2a2c, transparent 50%)`, opacity: 0.6 }} />
      <div style={{ position: 'absolute', inset: 0, padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, letterSpacing: 1 }}>
          // ícone do app
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 180, height: 180, borderRadius: 42, background: pulso.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            boxShadow: `0 30px 60px -20px ${pulso.primary}60, 0 12px 24px rgba(0,0,0,0.5)`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0,
              background: `radial-gradient(circle at 50% 100%, ${pulso.primary}30, transparent 60%)` }} />
            <svg width="120" height="120" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="3" fill={pulso.primary} />
              <path d="M 8 18 a 10 10 0 0 1 20 0" fill="none" stroke={pulso.primary} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 3 18 a 15 15 0 0 1 30 0" fill="none" stroke={pulso.primary} strokeWidth="2.4" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[64, 48, 32].map((sz) => (
              <div key={sz} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: sz, height: sz, borderRadius: sz * 0.23, background: pulso.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <PulsoMark size={sz * 0.62} lime={pulso.primary} />
                </div>
                <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.inkMute }}>{sz}px</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, lineHeight: 1.6, maxWidth: 360 }}>
          // base preta. sinal lime. ícone que parece estar emitindo. funciona em
          // qualquer escala porque é puramente estrutural.
        </div>
      </div>
    </PulsoFrame>
  );
}

function PulsoUI() {
  return (
    <PulsoFrame pad={0}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 20px 8px', display: 'flex', justifyContent: 'space-between', fontFamily: pulso.mono, fontSize: 11, color: pulso.ink }}>
          <span>22:48</span>
          <span style={{ display: 'flex', gap: 6 }}><span>•••</span><span>◐</span><span>▮</span></span>
        </div>
        <div style={{ padding: '12px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${pulso.hairline}` }}>
          <PulsoLogo size={0.55} />
          <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.primary, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: pulso.primary, boxShadow: `0 0 8px ${pulso.primary}` }} />
            42 AO VIVO
          </div>
        </div>
        <div style={{ padding: '12px 20px', display: 'flex', gap: 8, fontFamily: pulso.mono, fontSize: 10, overflowX: 'auto' }}>
          {['HOJE', 'SEX', 'SÁB', 'DOM', '+'].map((t, i) => (
            <div key={t} style={{ padding: '6px 12px',
              background: i === 0 ? pulso.primary : 'transparent',
              color: i === 0 ? pulso.bg : pulso.inkMute,
              border: i === 0 ? 'none' : `1px solid ${pulso.hairline}`, fontWeight: 600, letterSpacing: 1 }}>
              {t}
            </div>
          ))}
        </div>
        {/* Hero */}
        <div style={{ margin: '0 16px 14px', position: 'relative', height: 184,
          background: pulso.bg, border: `1px solid ${pulso.primary}`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 50% 100%, ${pulso.primary}40, transparent 60%)` }} />
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: pulso.mono, fontSize: 9, color: pulso.bg, background: pulso.primary, padding: '3px 8px', fontWeight: 700, letterSpacing: 1 }}>
              ● AO VIVO
            </div>
            <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.primary }}>R$ 45</div>
          </div>
          <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.8, color: pulso.ink, lineHeight: 1.05, marginBottom: 6 }}>
              B-Side: Italo Disco
            </div>
            <div style={{ fontFamily: pulso.mono, fontSize: 10, color: pulso.primary, letterSpacing: 1 }}>
              SÁB 03·MAI · 23H · MIRANTE 9
            </div>
          </div>
          {/* sound wave */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 24, display: 'flex', alignItems: 'flex-end', gap: 2, padding: '0 14px' }}>
            {Array.from({ length: 38 }).map((_, i) => {
              const h = 4 + Math.abs(Math.sin(i * 0.7) * 14) + Math.abs(Math.cos(i * 0.3) * 6);
              return <div key={i} style={{ flex: 1, height: h, background: pulso.primary, opacity: 0.6 }} />;
            })}
          </div>
        </div>
        {/* list */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {[
            { t: 'Cinema na Praça', d: 'DOM 04·MAI · 19H', meta: 'LARGO DO BOTICÁRIO', tag: 'GRÁTIS', color: pulso.cyan },
            { t: 'Pagode da Travessa', d: 'DOM 04·MAI · 16H', meta: 'TRAVESSA DA AMIZADE', tag: '32 AMIGOS', color: pulso.magenta },
          ].map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: 10,
              border: `1px solid ${pulso.hairline}`, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, flexShrink: 0, background: pulso.surface,
                border: `1px solid ${e.color}`, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 4, borderRadius: '50%',
                  background: `radial-gradient(circle, ${e.color}50, transparent)` }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: pulso.ink, marginBottom: 3 }}>{e.t}</div>
                <div style={{ fontFamily: pulso.mono, fontSize: 9, color: pulso.inkMute, letterSpacing: 0.8 }}>
                  {e.d} · {e.meta}
                </div>
              </div>
              <div style={{ fontFamily: pulso.mono, fontSize: 9, color: e.color, fontWeight: 700, letterSpacing: 1 }}>{e.tag}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 20px 16px', borderTop: `1px solid ${pulso.hairline}`,
          display: 'flex', justifyContent: 'space-around', fontFamily: pulso.mono, fontSize: 9, color: pulso.inkMute, letterSpacing: 1 }}>
          {['FEED', 'MAPA', '+', 'AGENDA', 'EU'].map((t, i) => (
            <div key={t} style={{ color: i === 0 ? pulso.primary : pulso.inkMute, fontWeight: 700,
              padding: i === 2 ? '4px 10px' : 0, background: i === 2 ? pulso.primary : 'transparent',
              ...(i === 2 ? { color: pulso.bg } : {}) }}>{t}</div>
          ))}
        </div>
      </div>
    </PulsoFrame>
  );
}

function PulsoDNA() {
  return (
    <PulsoFrame>
      <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, letterSpacing: 1, marginBottom: 32 }}>
        // elementos / DNA
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
        {/* waveform */}
        <div style={{ aspectRatio: '1', background: pulso.surface, padding: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const h = 10 + Math.abs(Math.sin(i * 0.5) * 60) + Math.abs(Math.cos(i * 0.3) * 30);
              return <div key={i} style={{ flex: 1, height: `${Math.min(h, 100)}%`, background: i % 7 === 0 ? pulso.magenta : pulso.primary, opacity: 0.85 }} />;
            })}
          </div>
        </div>
        {/* concentric pulse */}
        <div style={{ aspectRatio: '1', background: pulso.bg, position: 'relative', overflow: 'hidden' }}>
          {[1,2,3,4,5,6].map((r) => (
            <div key={r} style={{ position: 'absolute', top: '50%', left: '50%',
              width: r * 36, height: r * 36, borderRadius: '50%', transform: 'translate(-50%,-50%)',
              border: `1.5px solid ${pulso.primary}`, opacity: 0.7 - r * 0.1 }} />
          ))}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 12, height: 12, borderRadius: 6,
            background: pulso.primary, transform: 'translate(-50%,-50%)', boxShadow: `0 0 24px ${pulso.primary}` }} />
        </div>
        {/* terminal block */}
        <div style={{ aspectRatio: '1', background: pulso.surface2, padding: 14, fontFamily: pulso.mono, fontSize: 10, color: pulso.inkMute, lineHeight: 1.5, overflow: 'hidden' }}>
          <div style={{ color: pulso.primary }}>{'>'} eventos.proximos()</div>
          <div>↳ 142 resultados</div>
          <div>↳ raio: 5km</div>
          <div style={{ marginTop: 6 }}>
            <span style={{ color: pulso.magenta }}>SEX</span> 22:00 · Lapa<br/>
            <span style={{ color: pulso.magenta }}>SÁB</span> 23:00 · Mirante<br/>
            <span style={{ color: pulso.magenta }}>DOM</span> 19:00 · Boticário
          </div>
          <div style={{ marginTop: 6, color: pulso.primary }}>{'>'} _<span style={{ background: pulso.primary, color: pulso.bg }}>&nbsp;</span></div>
        </div>
        {/* ticker */}
        <div style={{ aspectRatio: '1', background: pulso.primary, color: pulso.bg, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '16px 0' }}>
          {['DREAMVY', 'AO VIVO', 'AGORA', 'DREAMVY'].map((t, i) => (
            <div key={i} style={{ fontSize: 24, fontWeight: 700, letterSpacing: -1, lineHeight: 1, transform: `translateX(${i * 8}px)`, fontStyle: i === 1 ? 'italic' : 'normal' }}>
              {t} · {t} · {t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, lineHeight: 1.6, maxWidth: 480 }}>
        // formas-de-onda · pulsos concêntricos · blocos terminal · tickers.<br/>
        // DNA: tudo emite, tudo vibra, tudo tem timestamp.
      </div>
    </PulsoFrame>
  );
}

function PulsoVoice() {
  return (
    <PulsoFrame>
      <div style={{ fontFamily: pulso.mono, fontSize: 11, color: pulso.inkMute, letterSpacing: 1, marginBottom: 32 }}>
        // tom de voz
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1.4, color: pulso.ink, lineHeight: 1.1, marginBottom: 12 }}>
          direta. <span style={{ color: pulso.primary }}>elétrica.</span><br/>
          sem firula.
        </div>
        <div style={{ fontFamily: pulso.mono, fontSize: 12, color: pulso.inkMute, lineHeight: 1.6, maxWidth: 420 }}>
          // frases curtas, verbos no presente. caixa baixa quase sempre.
          // metadata em monoespaço. urgência sem ansiedade.
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${pulso.hairline}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { ok: 'tem festa hoje. quer ir?', no: 'Descubra eventos incríveis na sua região!' },
          { ok: '32 amigos vão.', no: 'Seus amigos também estão participando deste evento' },
          { ok: 'salvar pra sexta', no: 'Adicionar aos favoritos' },
          { ok: 'começa em 2h', no: 'Não perca: faltam apenas 2 horas para o início!' },
        ].map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: 12, alignItems: 'baseline' }}>
            <div style={{ color: pulso.primary, fontFamily: pulso.mono, fontSize: 14 }}>+</div>
            <div style={{ fontSize: 15, color: pulso.ink, fontWeight: 500 }}>{p.ok}</div>
            <div style={{ color: pulso.inkFaint, fontFamily: pulso.mono, fontSize: 14 }}>−</div>
            <div style={{ fontSize: 12, color: pulso.inkFaint, textDecoration: 'line-through' }}>{p.no}</div>
          </div>
        ))}
      </div>
    </PulsoFrame>
  );
}

Object.assign(window, {
  PulsoHero, PulsoLogoSheet, PulsoColors, PulsoType,
  PulsoAppIcon, PulsoUI, PulsoDNA, PulsoVoice,
});
