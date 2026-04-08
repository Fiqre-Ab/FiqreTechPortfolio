import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

/* ─── Stars background ─── */

function Stars({ count = 200 }) {
  const positions = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pts.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    return new Float32Array(pts);
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

/* ─── Core Globe ─── */

function CoreGlobe() {
  const outer = useRef();
  const inner = useRef();
  const core = useRef();
  const pulse = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    outer.current.rotation.y += 0.003;
    outer.current.rotation.x += 0.001;
    inner.current.rotation.y -= 0.005;
    inner.current.rotation.z += 0.002;
    core.current.rotation.y += 0.01;
    core.current.rotation.x += 0.006;
    // Pulsing atmosphere
    const s = 1 + Math.sin(t * 1.5) * 0.04;
    pulse.current.scale.set(s, s, s);
  });

  return (
    <group>
      {/* Atmosphere glow */}
      <mesh ref={pulse}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshStandardMaterial
          color="#3498db"
          emissive="#3498db"
          emissiveIntensity={0.08}
          transparent
          opacity={0.07}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Outer wireframe icosahedron */}
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.8, 3]} />
        <meshStandardMaterial color="#3498db" wireframe transparent opacity={0.45} />
      </mesh>
      {/* Inner wireframe icosahedron */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.1, 2]} />
        <meshStandardMaterial color="#da4ea2" wireframe transparent opacity={0.38} />
      </mesh>
      {/* Core dodecahedron */}
      <mesh ref={core}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#61dafb"
          emissive="#61dafb"
          emissiveIntensity={1.4}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

/* ─── Orbiting Orb with energy beam + tech label ─── */

function EnergyBeam({ orbRef, color }) {
  const geomRef = useRef();

  useFrame(() => {
    if (!geomRef.current || !orbRef.current) return;
    const pos = orbRef.current.position;
    const pts = new Float32Array([0, 0, 0, pos.x, pos.y, pos.z]);
    geomRef.current.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    geomRef.current.computeBoundingSphere();
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geomRef} />
      <lineBasicMaterial color={color} transparent opacity={0.2} />
    </lineSegments>
  );
}

function OrbitingOrb({ radius, speed, offset, color, size, tiltY = 0, label }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.6 + tiltY) * (radius * 0.35),
      Math.sin(t) * radius
    );
  });

  return (
    <group>
      <EnergyBeam orbRef={ref} color={color} />
      <mesh ref={ref}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
        {label && (
          <Html center distanceFactor={6} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            <span style={{
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              color: color,
              background: `${color}18`,
              border: `1px solid ${color}55`,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
            }}>
              {label}
            </span>
          </Html>
        )}
      </mesh>
    </group>
  );
}

/* ─── Spinning ring ─── */

function RingLine({ radius, axis = 'y', color, speed }) {
  const ref = useRef();

  useFrame(() => {
    if (axis === 'y') ref.current.rotation.y += speed;
    if (axis === 'x') ref.current.rotation.x += speed;
    if (axis === 'z') ref.current.rotation.z += speed;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.007, 8, 90]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.5} />
    </mesh>
  );
}

/* ─── Floating debris (small random shapes) ─── */

function Debris({ count = 12 }) {
  const meshes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      ],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      speed: 0.003 + Math.random() * 0.006,
      color: ['#3498db', '#da4ea2', '#61dafb', '#a78bfa'][i % 4],
      scale: 0.04 + Math.random() * 0.08,
    }));
  }, [count]);

  const refs = useRef(meshes.map(() => null));

  useFrame(() => {
    refs.current.forEach((r, i) => {
      if (r) {
        r.rotation.x += meshes[i].speed;
        r.rotation.y += meshes[i].speed * 0.7;
      }
    });
  });

  return (
    <>
      {meshes.map((d, i) => (
        <mesh
          key={i}
          ref={el => (refs.current[i] = el)}
          position={d.pos}
          rotation={d.rot}
          scale={d.scale}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={d.color} emissive={d.color} emissiveIntensity={0.7} wireframe />
        </mesh>
      ))}
    </>
  );
}

/* ─── Data ─── */

const ORBS = [
  { radius: 2.6, speed: 0.5,  offset: 0,   color: '#61dafb', size: 0.14, tiltY: 0,   label: 'React'      },
  { radius: 3.0, speed: 0.38, offset: 2.1, color: '#6cc24a', size: 0.12, tiltY: 1,   label: 'Node.js'    },
  { radius: 2.4, speed: 0.62, offset: 4.2, color: '#f89820', size: 0.11, tiltY: 2,   label: 'Java'       },
  { radius: 3.3, speed: 0.32, offset: 1.0, color: '#da4ea2', size: 0.13, tiltY: 0.5, label: 'MongoDB'    },
  { radius: 2.8, speed: 0.55, offset: 3.0, color: '#3178c6', size: 0.11, tiltY: 1.5, label: 'TypeScript' },
  { radius: 3.1, speed: 0.44, offset: 5.5, color: '#ff6b6b', size: 0.1,  tiltY: 3,   label: 'Express'    },
  { radius: 2.2, speed: 0.7,  offset: 0.8, color: '#a78bfa', size: 0.09, tiltY: 2.5, label: 'SQL'        },
];

const RINGS = [
  { radius: 2.3, axis: 'y', color: '#3498db', speed: 0.003 },
  { radius: 3.0, axis: 'x', color: '#da4ea2', speed: -0.002 },
  { radius: 2.7, axis: 'z', color: '#61dafb', speed: 0.0018 },
  { radius: 3.4, axis: 'y', color: '#a78bfa', speed: -0.0015 },
];

/* ─── Wrapper ─── */

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 460px;
`;

export default function Scene3D() {
  return (
    <CanvasWrapper>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[8, 8, 8]}   intensity={1.8} color="#3498db" />
        <pointLight position={[-8, -8, -8]} intensity={1.0} color="#da4ea2" />
        <pointLight position={[0, 6, -6]}   intensity={0.7} color="#61dafb" />
        <pointLight position={[0, -6, 6]}   intensity={0.4} color="#a78bfa" />

        <Suspense fallback={null}>
          <Stars count={220} />
          <CoreGlobe />
          {ORBS.map((orb, i) => <OrbitingOrb key={i} {...orb} />)}
          {RINGS.map((ring, i) => <RingLine key={i} {...ring} />)}
          <Debris count={14} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          maxPolarAngle={Math.PI / 1.4}
          minPolarAngle={Math.PI / 5}
        />
      </Canvas>
    </CanvasWrapper>
  );
}
