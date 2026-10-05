import { AnimatePresence, motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import { locations } from '../data/content'
import { usePrefersReducedMotion } from '../hooks'
import RevealText from './RevealText'

type Loc = (typeof locations)[number]

const hq = locations[0]
const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]))

const pin = (l: Loc, on: boolean) =>
  L.divIcon({
    className: 'pin-wrap',
    iconSize: [0, 0],
    html: `<span class="pin${on ? ' on' : ''}${l.id === hq.id ? ' hq' : ''}"><span class="pin-dot"></span><span class="pin-label">${l.name}</span></span>`,
  })

const route = (l: Loc) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${l.street}, ${l.city}`)}`

/** Moves the map: overview of all branches, or close-up of the selected one. */
function View({ active, zoomed }: { active: Loc; zoomed: boolean }) {
  const map = useMap()
  const reduce = usePrefersReducedMotion()
  useEffect(() => {
    if (zoomed) map.flyTo([active.lat, active.lng], 11, { animate: !reduce, duration: 1.1 })
    else map.flyToBounds(bounds, { padding: [70, 70], animate: !reduce, duration: 1.1 })
  }, [map, active, zoomed, reduce])
  return null
}

export default function Locations() {
  const [activeId, setActiveId] = useState(hq.id)
  const [zoomed, setZoomed] = useState(false)
  const active = locations.find((l) => l.id === activeId)!
  const select = (id: string) => { setActiveId(id); setZoomed(true) }

  return (
    <section id="standorte" className="sec dark grid-dark" aria-labelledby="loc-title">
      <div className="wrap">
        <div className="sec-head">
          <RevealText id="loc-title" className="h2" text="Immer in Ihrer Nähe" />
          <p className="lead muted">Vom Hauptsitz in Nördlingen und unseren Filialen in München, Vöhringen und Kempten betreuen wir Kunden in ganz Süddeutschland – von Stuttgart bis München, von Nürnberg bis ins Allgäu.</p>
        </div>

        <div className="locs">
          <div className="map">
            <MapContainer bounds={bounds} boundsOptions={{ padding: [70, 70] }} scrollWheelZoom={false} aria-label="Karte unserer Standorte in Süddeutschland">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {locations.slice(1).map((l) => (
                <Polyline
                  key={l.id}
                  positions={[[hq.lat, hq.lng], [l.lat, l.lng]]}
                  pathOptions={{ color: '#F28C00', weight: l.id === activeId ? 3 : 2, opacity: l.id === activeId ? 0.9 : 0.35, dashArray: '6 8' }}
                />
              ))}
              {locations.map((l) => (
                <Marker
                  key={l.id}
                  position={[l.lat, l.lng]}
                  icon={pin(l, l.id === activeId)}
                  zIndexOffset={l.id === activeId ? 1000 : 0}
                  title={`${l.name} – ${l.role}`}
                  eventHandlers={{ click: () => select(l.id) }}
                />
              ))}
              <View active={active} zoomed={zoomed} />
            </MapContainer>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className="map-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="tech">{active.role}</span>
                <b>{active.name}</b>
                <span>{active.street}, {active.city}</span>
                <span className="map-card-actions">
                  <a href={active.phoneHref}>{active.phone}</a>
                  <a href={route(active)} target="_blank" rel="noopener noreferrer">Route planen →</a>
                </span>
              </motion.div>
            </AnimatePresence>

            {zoomed && (
              <button type="button" className="map-reset" onClick={() => setZoomed(false)}>Alle Standorte</button>
            )}
          </div>

          <div className="loc-list">
            {locations.map((l) => {
              const on = l.id === activeId
              return (
                <div key={l.id}>
                  <button type="button" className={`loc ${on ? 'on' : ''}`} aria-expanded={on} onClick={() => select(l.id)}>
                    <span className="loc-head"><b>{l.name}</b><span className="tech">{l.role}</span></span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          className="loc-body"
                          style={{ display: 'block' }}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <span className="loc-body-in">
                            <span>{l.street}<br />{l.city}</span>
                            <span>Telefon {l.phone}<br />Fax {l.fax}</span>
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              )
            })}
            <p className="muted" style={{ fontSize: 15, margin: '8px 0 0' }}>
              Direkt anrufen: <a href={active.phoneHref} style={{ color: '#fff', fontWeight: 700 }}>{active.phone}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
