import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const CYAN = '#00E5FF';
const VIOLET = '#8B5CF6';
const RADIUS = 1.6;

/** Decorative node positions as [latitude, longitude]. NOT real data. */
const NODES: Array<[number, number]> = [
  [48, 2], [40, -74], [35, 139], [-23, -46], [-34, 151], [1, 103],
  [55, 37], [28, 77], [-1, 36], [37, -122], [52, 13], [25, 55],
];

/** Decorative links between node indexes. NOT real traffic. */
const LINKS: Array<[number, number]> = [
  [0, 1], [1, 9], [0, 6], [6, 7], [7, 2], [2, 4], [3, 1], [8, 0], [11, 7], [5, 4], [10, 0], [9, 3],
];

function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function arcPoints(a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3[] {
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(RADIUS * 1.35);
  return new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(36);
}

function circlePoints(r: number): THREE.Vector3[] {
  return Array.from({ length: 97 }, (_, i) => {
    const t = (i / 96) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(t) * r, 0, Math.sin(t) * r);
  });
}

interface OrbiterProps {
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  phase: number;
  color: string;
  animate: boolean;
}

/** A node that travels around a tilted orbit ring. */
function Orbiter({ radius, tiltX, tiltZ, speed, phase, color, animate }: OrbiterProps) {
  const spin = useRef<THREE.Group>(null);
  const ring = useMemo(() => circlePoints(radius), [radius]);

  useFrame((_, delta) => {
    if (animate && spin.current) spin.current.rotation.y += delta * speed;
  });

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <Line points={ring} color={color} lineWidth={1} transparent opacity={0.28} />
      <group ref={spin} rotation={[0, phase, 0]}>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

function GlobeBody({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);

  const nodePositions = useMemo(() => NODES.map(([lat, lon]) => latLonToVec3(lat, lon, RADIUS)), []);
  const arcs = useMemo(
    () => LINKS.map(([i, j]) => arcPoints(nodePositions[i], nodePositions[j])),
    [nodePositions],
  );

  useFrame((_, delta) => {
    if (animate && group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <>
      <group ref={group}>
        {/* Translucent core */}
        <mesh>
          <sphereGeometry args={[RADIUS * 0.985, 48, 48]} />
          <meshBasicMaterial color={VIOLET} transparent opacity={0.1} depthWrite={false} />
        </mesh>
        {/* Wireframe shell */}
        <mesh>
          <icosahedronGeometry args={[RADIUS, 3]} />
          <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.28} />
        </mesh>

        {/* Surface nodes */}
        {nodePositions.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color={i % 3 === 0 ? VIOLET : CYAN} />
          </mesh>
        ))}

        {/* Connecting arcs */}
        {arcs.map((pts, i) => (
          <Line
            key={i}
            points={pts}
            color={i % 2 === 0 ? CYAN : VIOLET}
            lineWidth={1.2}
            transparent
            opacity={0.65}
          />
        ))}
      </group>

      {/* Orbiting nodes */}
      <Orbiter radius={2.1} tiltX={0.5} tiltZ={0.2} speed={0.5} phase={0} color={CYAN} animate={animate} />
      <Orbiter radius={2.35} tiltX={-0.8} tiltZ={0.6} speed={-0.35} phase={2} color={VIOLET} animate={animate} />
      <Orbiter radius={2.6} tiltX={1.1} tiltZ={-0.4} speed={0.25} phase={4} color={CYAN} animate={animate} />
    </>
  );
}

interface HoloGlobeProps {
  animate: boolean;
}

export default function HoloGlobe({ animate }: HoloGlobeProps) {
  // On touch screens we skip drag controls so the page can still scroll.
  const coarsePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true }}
    >
      <GlobeBody animate={animate} />
      {!coarsePointer && (
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} enableDamping />
      )}
    </Canvas>
  );
}
