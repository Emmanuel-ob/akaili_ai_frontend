<!-- halfheroslider component --><template>
  <div
    ref="sliderContainer"
    class="relative w-full h-[80vh] md:h-[70vh] overflow-hidden rounded-3xl"
  >
    <!-- Slide Tiles Layer -->
    <div
      ref="tileLayer"
      class="absolute inset-0 w-full h-full pointer-events-none rounded-3xl overflow-hidden"
    ></div>

    <!-- Text Layer (fades in after rebuild) -->
    <div
      ref="textLayer"
      class="absolute inset-0 flex flex-col items-center justify-center text-white z-20 opacity-0 
         bg-[rgba(0,0,0,0.75)] rounded-3xl p-4"
    >
      <h1 ref="heading" class="text-5xl font-bold px-6 bitcount-bold text-center"></h1>
    </div>

    <!-- Flash overlay for smoothness -->
    <div
      ref="flashOverlay"
      class="absolute inset-0 bg-white opacity-0 z-30 pointer-events-none rounded-3xl"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import SplitType from "split-type";

interface Section {
  image: string;
  title: string;
}

const props = defineProps<{ sections: Section[] }>();

// refs
const tileLayer = ref<HTMLElement | null>(null);
const textLayer = ref<HTMLElement | null>(null);
const heading = ref<HTMLElement | null>(null);
const flashOverlay = ref<HTMLElement | null>(null);

// state
const currentIndex = ref(0);
let split: SplitType | null = null; // <-- keep reference for cleanup

// Triangle tile config
const BASE_TILE_SIZE = 80; // smaller = more tiles
const MAX_TILES = 650; // performance cap

// MAIN: Trigger when index changes
function goToSlide(newIndex: number) {
  const oldIndex = currentIndex.value;
  currentIndex.value = newIndex;
  runTileTransition(oldIndex, newIndex);
}

// Generate triangle tiles for a given slide
function createTriangleTiles(section: Section) {
  const layer = tileLayer.value!;
  layer.innerHTML = "";

  const w = layer.clientWidth;
  const h = layer.clientHeight;

  const cols = Math.ceil(w / BASE_TILE_SIZE);
  const rows = Math.ceil(h / BASE_TILE_SIZE);

  const tiles: HTMLElement[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (tiles.length > MAX_TILES) break;

      const x = c * BASE_TILE_SIZE;
      const y = r * BASE_TILE_SIZE;

      // Two triangles per cell
      const t1 = document.createElement("div");
      const t2 = document.createElement("div");

      Object.assign(t1.style, tileStyle(section.image, x, y, w, h, true));
      Object.assign(t2.style, tileStyle(section.image, x, y, w, h, false));

      layer.appendChild(t1);
      layer.appendChild(t2);
      tiles.push(t1, t2);
    }
  }

  return tiles;
}

// Return CSS for triangular clip-path tile
function tileStyle(image: string, x: number, y: number, w: number, h: number, isFirst: boolean) {
  return {
    position: "absolute",
    width: `${BASE_TILE_SIZE}px`,
    height: `${BASE_TILE_SIZE}px`,
    left: `${x}px`,
    top: `${y}px`,
    backgroundImage: `url(${image})`,
    backgroundSize: `${w}px ${h}px`,
    backgroundPosition: `-${x}px -${y}px`,
    clipPath: isFirst
      ? "polygon(0 0, 100% 0, 0 100%)"
      : "polygon(100% 0, 100% 100%, 0 100%)",
    transformOrigin: "center",
    opacity: 1,
  } as any;
}

// CORE TRANSITION
async function runTileTransition(oldIndex: number, newIndex: number) {
  const oldSection = props.sections[oldIndex];
  const newSection = props.sections[newIndex];

  // fade out text first
  gsap.to(textLayer.value, { opacity: 0, duration: 0.2 });

  // create tiles for outgoing slide
  const tiles = createTriangleTiles(oldSection);

  // Step 1: Flash overlay
  gsap.to(flashOverlay.value, { opacity: 0.12, duration: 0.15 });

  // Step 2: SHATTER outgoing
  await gsap.to(tiles, {
    rotateX: () => gsap.utils.random(-360, 360),
    rotateY: () => gsap.utils.random(-360, 360),
    rotateZ: () => gsap.utils.random(-720, 720),
    x: () => gsap.utils.random(-400, 400),
    y: () => gsap.utils.random(-300, 300),
    z: () => gsap.utils.random(-1200, -2000),
    opacity: 0,
    duration: 0.7,
    stagger: 0.005,
    ease: "power2.in",
  });

  // Step 3: Switch tiles to NEW slide in scattered state
  tileLayer.value!.innerHTML = "";
  const newTiles = createTriangleTiles(newSection);

  gsap.set(newTiles, {
    rotateX: () => gsap.utils.random(-360, 360),
    rotateY: () => gsap.utils.random(-360, 360),
    rotateZ: () => gsap.utils.random(-720, 720),
    x: () => gsap.utils.random(-500, 500),
    y: () => gsap.utils.random(-400, 400),
    z: () => gsap.utils.random(-1500, -2000),
    opacity: 0,
  });

  // Step 4: REBUILD incoming
  await gsap.to(newTiles, {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    x: 0,
    y: 0,
    z: 0,
    opacity: 1,
    duration: 1.0,
    stagger: 0.008,
    ease: "power3.out",
  });

  // Clear previous SplitType if exists
  if (split) split.revert();

  // update heading text
  heading.value!.innerText = newSection.title;

  // split text for animation
  split = new SplitType(heading.value!, { types: "words" });

  gsap.fromTo(
    split.words,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "power3.out",
    }
  );

  // fade in text layer
  gsap.to(textLayer.value, { opacity: 1, duration: 0.3 });

  // fade out flash
  gsap.to(flashOverlay.value, { opacity: 0, duration: 0.3 });
}

onMounted(() => {
  // load first slide
  const first = props.sections[0];
  heading.value!.innerText = first.title;
  createTriangleTiles(first);
  gsap.to(textLayer.value, { opacity: 1, duration: 0.5 });

  // simple autoplay
  setInterval(() => {
    const next = (currentIndex.value + 1) % props.sections.length;
    goToSlide(next);
  }, 4000);
});
</script>

<style scoped>
/* optional: smoother 3D rotation for tiles */
div[ref="tileLayer"] > div {
  backface-visibility: hidden;
}

.bitcount-bold {
  font-family: "Bitcount Prop Double Ink", system-ui;
  font-optical-sizing: auto;
  font-weight: 700; /* you can choose 100–900 */
  font-style: normal;
  font-variation-settings:
    "slnt" 0,
    "CRSV" 0.5,
    "ELSH" 0,
    "ELXP" 0,
    "SZP1" 0,
    "SZP2" 0,
    "XPN1" 0,
    "XPN2" 0,
    "YPN1" 0,
    "YPN2" 0;
}
</style>
