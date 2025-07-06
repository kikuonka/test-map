import { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import { Icon, Style } from 'ol/style'

const MapTest = () => {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapObj = useRef<Map | null>(null)
    const vectorSource = useRef(new VectorSource())

    const [coords, setCoords] = useState('')

    useEffect(() => {
        if (!mapRef.current) return

        const tileLayer = new TileLayer({
            source: new OSM(),
        })

        const markerLayer = new VectorLayer({
            source: vectorSource.current,
        })

        if (!mapRef.current) return

        mapObj.current = new Map({
            target: mapRef.current,
            layers: [tileLayer, markerLayer],
            view: new View({
                center: fromLonLat([0, 0]),
                zoom: 2,
            }),
            controls: [],
        })

        return () => {
            mapObj.current?.setTarget(undefined)
        }
    }, [])

    const handleAddMarker = () => {
        const [latStr, lonStr] = coords.split(',').map(s => s.trim())
        const latitude = parseFloat(latStr)
        const longitude = parseFloat(lonStr)

        if (isNaN(latitude) || isNaN(longitude)) {
            alert('Введите координаты в формате: широта, долгота')
            return
        }

        vectorSource.current.clear()

        const point = new Point(fromLonLat([longitude, latitude]))
        const marker = new Feature({ geometry: point })

        marker.setStyle(
            new Style({
                image: new Icon({
                    src: '/point.png',
                    anchor: [0.5, 1],
                    scale: 0.8,
                }),
            })
        )

        vectorSource.current.addFeature(marker)

        mapObj.current?.getView().animate({
            center: fromLonLat([longitude, latitude]),
            zoom: 15,
            duration: 500,
        })
    }

    return (
        <div style={{ position: 'relative', width: '99vw', height: '98vh' }}>
            <div
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    background: 'rgba(255,255,255,0.9)',
                    padding: '10px',
                    borderRadius: '8px',
                    zIndex: 1000,
                }}
            >
                <input
                    type='text'
                    placeholder='Широта, долгота'
                    value={coords}
                    onChange={(e) => setCoords(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddMarker()
                    }}
                    style={{ width: '220px', padding: '6px' }}
                />
                <button onClick={handleAddMarker} style={{ marginLeft: '8px', padding: '6px 12px' }}>
                    Показать
                </button>
            </div>

            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}

export default MapTest
