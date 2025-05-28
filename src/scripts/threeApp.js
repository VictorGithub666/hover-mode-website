import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function initThreeApp() {
  const container = document.getElementById("three-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  camera.position.set(0, 1, 15);
  camera.lookAt(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(3, 5, 5);
  scene.add(directionalLight);

  scene.fog = new THREE.FogExp2(0xffffff, 0.01);

  const loader = new GLTFLoader();
  let drone;
  let isMobile = window.innerWidth <= 768; // Determine device on load

  loader.load("/models/sdc-drone.glb", (gltf) => {
    drone = gltf.scene;
    drone.scale.set(2, 2, 2);
    const box = new THREE.Box3().setFromObject(drone);
    const center = box.getCenter(new THREE.Vector3());
    drone.position.sub(center);
    drone.position.set(isMobile ? 0 : 8, 0, 0);
    scene.add(drone);
  });

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Update device type on resize
    isMobile = window.innerWidth <= 768;
  }
  window.addEventListener("resize", onWindowResize);

  function animate() {
    requestAnimationFrame(animate);
    if (drone) {
      drone.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
  }
  animate();

  return {
    updateDronePosition: (
      globalProgress,
      { sectionIndex, sectionProgress, targetSide }
    ) => {
      if (drone) {
        if (isMobile) {
          drone.position.set(0, 0, 0);
          drone.rotation.z = 0;
        } else {
          const targetX = targetSide * 8;
          const currentX = drone.position.x;
          const newX = currentX + (targetX - currentX) * 0.1;
          const waveY = Math.sin(globalProgress * Math.PI * 4) * 1.5;
          const depthZ = Math.sin(globalProgress * Math.PI * 2) * 3;

          drone.position.set(newX, waveY, depthZ);
          drone.rotation.z = (targetX - currentX) * 0.02;
        }
      }
    },
    onWindowResize,
  };
}
