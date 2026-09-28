/* eslint-disable react/no-unknown-property */
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box } from '@mui/material';

function LowPolyResume({ isDark }) {
  const group = useRef();

  // Floating animation for extra flair
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) / 4;
    group.current.rotation.z = Math.sin(t / 4) / 6;
  });

  const paperColor = '#ffffff';
  const lineColor = '#e0e0e0';
  const accentColor = '#000000';

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Paper Base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3, 4, 0.1]} />
        <meshStandardMaterial color={paperColor} roughness={0.8} />
      </mesh>

      {/* Profile Picture Placeholder */}
      <mesh position={[-0.8, 1.2, 0.06]}>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>

      {/* Name / Title block */}
      <mesh position={[0.4, 1.4, 0.06]}>
        <boxGeometry args={[1.2, 0.2, 0.05]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[0.2, 1.1, 0.06]}>
        <boxGeometry args={[0.8, 0.1, 0.05]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>

      {/* Section 1 */}
      <mesh position={[-1.2, 0.5, 0.06]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[-0.1, 0.5, 0.06]}>
        <boxGeometry args={[2.0, 0.1, 0.05]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>
      <mesh position={[-0.2, 0.3, 0.06]}>
        <boxGeometry args={[1.8, 0.1, 0.05]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>

      {/* Section 2 */}
      <mesh position={[-1.2, -0.2, 0.06]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[-0.1, -0.2, 0.06]}>
        <boxGeometry args={[2.0, 0.1, 0.05]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>
      <mesh position={[-0.2, -0.4, 0.06]}>
        <boxGeometry args={[1.8, 0.1, 0.05]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>
      <mesh position={[0.1, -0.6, 0.06]}>
        <boxGeometry args={[1.2, 0.1, 0.05]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>

      {/* Section 3 */}
      <mesh position={[-1.2, -1.1, 0.06]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[-0.1, -1.1, 0.06]}>
        <boxGeometry args={[2.0, 0.1, 0.05]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>
      <mesh position={[-0.2, -1.3, 0.06]}>
        <boxGeometry args={[1.8, 0.1, 0.05]} />
        <meshStandardMaterial color={lineColor} />
      </mesh>

      {/* Fold edge highlight / shading for low poly effect */}
      <mesh position={[1.48, 0, 0.06]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 4, 0.02]} />
        <meshStandardMaterial color={accentColor} opacity={0.1} transparent />
      </mesh>
    </group>
  );
}

export function ResumeModel() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        width: '100%',
        height: { md: '70%', xs: 200 },
        minHeight: isDesktop ? 600 : 200,
        cursor: 'default',
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={isDark ? 0.4 : 0.8} />
        <directionalLight position={[5, 5, 5]} intensity={isDark ? 1.5 : 1} castShadow />
        <directionalLight position={[-5, -5, 2]} intensity={0.5} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.1, 0.1]}>
          <LowPolyResume isDark={isDark} />
        </Float>
        <Environment preset="city" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
    </Box>
  );
}
