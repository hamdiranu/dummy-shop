<template>
  <svg
    ref="svgEl"
    :class="['login-mascot', { 'is-blinking': isBlinking }]"
    viewBox="-24 -84 628 636"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <!-- Soft white plastic, lit from the top left -->
      <radialGradient id="lm-shell" cx="0.38" cy="0.3" r="0.85">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.55" stop-color="#f1f5fd" />
        <stop offset="1" stop-color="#c7d4f2" />
      </radialGradient>
      <!-- User-space so the eyelids pick up exactly the visor colour behind them -->
      <linearGradient
        id="lm-visor"
        gradientUnits="userSpaceOnUse"
        x1="386"
        y1="118"
        x2="386"
        y2="264"
      >
        <stop offset="0" stop-color="#22325a" />
        <stop offset="1" stop-color="#0a1129" />
      </linearGradient>
      <linearGradient id="lm-blue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#60a5fa" />
        <stop offset="1" stop-color="#1d4ed8" />
      </linearGradient>
      <radialGradient id="lm-sole" cx="0.42" cy="0.38" r="0.75">
        <stop offset="0" stop-color="#7cb4ff" />
        <stop offset="0.6" stop-color="#2f6ff0" />
        <stop offset="1" stop-color="#1d43b8" />
      </radialGradient>
      <radialGradient id="lm-eyeball" cx="0.45" cy="0.4" r="0.7">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#dfe6f3" />
      </radialGradient>
      <radialGradient id="lm-iris" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stop-color="#93c5fd" />
        <stop offset="0.5" stop-color="#2563eb" />
        <stop offset="1" stop-color="#1e3a8a" />
      </radialGradient>
      <linearGradient id="lm-joint" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#64748b" />
        <stop offset="1" stop-color="#334155" />
      </linearGradient>
      <linearGradient id="lm-laptop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#eef1f6" />
        <stop offset="1" stop-color="#a7b2c4" />
      </linearGradient>
      <linearGradient id="lm-leaf" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#15803d" />
        <stop offset="1" stop-color="#4ade80" />
      </linearGradient>
      <linearGradient id="lm-leaf-dark" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#14532d" />
        <stop offset="1" stop-color="#22c55e" />
      </linearGradient>
      <linearGradient id="lm-bag" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5b9bff" />
        <stop offset="1" stop-color="#1d4ed8" />
      </linearGradient>
      <linearGradient id="lm-pot" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f8fafc" />
        <stop offset="0.45" stop-color="#ffffff" />
        <stop offset="1" stop-color="#d5ddeb" />
      </linearGradient>
      <linearGradient id="lm-bubble" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e0ebff" stop-opacity="0.95" />
        <stop offset="1" stop-color="#a9c4ff" stop-opacity="0.8" />
      </linearGradient>
      <filter id="lm-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <filter id="lm-glow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="lm-soft" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#1e3a8a" flood-opacity="0.16" />
      </filter>
      <clipPath v-for="eye in EYES" :id="`lm-eye-${eye.id}`" :key="eye.id">
        <ellipse :cx="eye.cx" :cy="eye.cy" :rx="eye.rx" :ry="eye.ry" />
      </clipPath>
    </defs>

    <!-- Floor shadow -->
    <ellipse
      cx="290"
      cy="532"
      rx="300"
      ry="20"
      fill="#7f9cf0"
      fill-opacity="0.35"
      filter="url(#lm-blur)"
    />

    <!-- Speech bubble with a cart, floating above the head -->
    <g class="lm-float">
      <g transform="translate(154 -78)" filter="url(#lm-soft)">
        <path
          d="M34 0H126A34 34 0 0 1 160 34V104A34 34 0 0 1 126 138H124L118 160L92 138H34A34 34 0 0 1 0 104V34A34 34 0 0 1 34 0Z"
          fill="url(#lm-bubble)"
          stroke="#ffffff"
          stroke-opacity="0.9"
          stroke-width="2.5"
        />
        <path
          d="M18 42Q20 18 46 14"
          stroke="#ffffff"
          stroke-opacity="0.6"
          stroke-width="4"
          stroke-linecap="round"
        />
        <g transform="translate(48 37) scale(2.7)" stroke="#ffffff" stroke-width="1.8">
          <path
            d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="8" cy="21" r="1.4" fill="#ffffff" />
          <circle cx="19" cy="21" r="1.4" fill="#ffffff" />
        </g>
      </g>
    </g>

    <!-- Potted plant -->
    <g filter="url(#lm-soft)">
      <ellipse cx="54" cy="402" rx="42" ry="10" fill="#e2e8f0" />
      <ellipse cx="54" cy="402" rx="35" ry="6.5" fill="#3f4a5c" />
      <g class="lm-sway">
        <g
          v-for="leaf in LEAVES"
          :key="leaf.rotate"
          :transform="`translate(54 400) rotate(${leaf.rotate}) scale(${leaf.scale})`"
        >
          <!-- Broad rounded leaf on a thin stalk -->
          <path
            d="M0 0C12-6 26-24 54-25C84-26 100-8 104 0C100 8 84 26 54 25C26 24 12 6 0 0Z"
            :fill="leaf.dark ? 'url(#lm-leaf-dark)' : 'url(#lm-leaf)'"
          />
          <path
            d="M8 0Q56-2 98 0"
            stroke="#14532d"
            stroke-opacity="0.3"
            stroke-width="2"
            stroke-linecap="round"
          />
        </g>
      </g>
      <path
        d="M16 406H92L84 492Q82 506 68 506H40Q26 506 24 492Z"
        fill="url(#lm-pot)"
        stroke="#dbe3f1"
        stroke-width="1.5"
      />
      <path
        d="M12 402A42 10 0 0 0 96 402V410A42 10 0 0 1 12 410Z"
        fill="#ffffff"
        stroke="#dbe3f1"
        stroke-width="1.5"
      />
    </g>

    <!-- Shopping bag -->
    <g transform="translate(-70 12)" filter="url(#lm-soft)">
      <path
        d="M200 342C200 312 244 312 244 342"
        stroke="#1e40af"
        stroke-width="6"
        stroke-linecap="round"
      />
      <path d="M156 344L176 334H270L250 344Z" fill="#1e3a8a" />
      <path d="M250 344L270 334L276 480L256 496Z" fill="#1e40af" />
      <path d="M156 344H250L256 488Q256 496 248 496H164Q156 496 155 488Z" fill="url(#lm-bag)" />
      <path d="M166 354H176L172 480H162Z" fill="#ffffff" fill-opacity="0.15" />
      <path
        d="M176 356C176 318 228 318 228 356"
        stroke="#3b82f6"
        stroke-width="7"
        stroke-linecap="round"
      />
      <circle cx="176" cy="356" r="4" fill="#1e40af" />
      <circle cx="228" cy="356" r="4" fill="#1e40af" />
      <g
        transform="translate(180 398) scale(1.9)"
        stroke="#ffffff"
        stroke-opacity="0.85"
        stroke-width="1.9"
      >
        <path
          d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="8" cy="21" r="1.3" fill="#ffffff" fill-opacity="0.85" />
        <circle cx="19" cy="21" r="1.3" fill="#ffffff" fill-opacity="0.85" />
      </g>
    </g>

    <!-- Parcel in front of the bag -->
    <g transform="translate(-56 24)" filter="url(#lm-soft)">
      <path d="M240 452L254 442H302L288 452Z" fill="#ffffff" />
      <rect x="240" y="452" width="48" height="44" fill="#eef2f8" />
      <path d="M288 452L302 442V486L288 496Z" fill="#d3dcec" />
      <path d="M262 452V496" stroke="#dfe6f1" stroke-width="6" />
      <path d="M262 452L276 442" stroke="#e8edf5" stroke-width="6" />
    </g>

    <!-- Robot body: sits turned toward the form, legs stretched out to the right -->
    <g filter="url(#lm-soft)">
      <ellipse
        cx="392"
        cy="392"
        rx="100"
        ry="88"
        fill="url(#lm-shell)"
        stroke="#c3d0ee"
        stroke-width="1.5"
      />

      <!-- Thighs sit under the laptop -->
      <ellipse cx="340" cy="466" rx="54" ry="34" fill="url(#lm-shell)" stroke="#c3d0ee" />
      <ellipse
        cx="482"
        cy="462"
        rx="74"
        ry="34"
        fill="url(#lm-shell)"
        stroke="#c3d0ee"
        transform="rotate(-6 482 462)"
      />

      <!-- Collar with glowing chevron -->
      <rect x="330" y="296" width="120" height="36" rx="18" fill="url(#lm-joint)" />
      <path
        d="M374 312L390 326L406 312"
        stroke="#3b82f6"
        stroke-opacity="0.7"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#lm-glow)"
      />
      <path
        d="M374 312L390 326L406 312"
        stroke="#7cb4ff"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Shoulders and arms -->
      <circle cx="300" cy="362" r="22" fill="url(#lm-joint)" />
      <circle cx="476" cy="356" r="22" fill="url(#lm-joint)" />
      <g stroke-linecap="round">
        <path d="M300 364Q284 410 342 432" stroke="#c3d0ee" stroke-width="38" />
        <path d="M300 364Q284 410 342 432" stroke="#f6f8fe" stroke-width="34" />
        <path d="M476 358Q520 372 552 404" stroke="#c3d0ee" stroke-width="38" />
        <path d="M476 358Q520 372 552 404" stroke="#f6f8fe" stroke-width="34" />
      </g>

      <!-- Laptop, lid facing us -->
      <path
        d="M344 350L552 338L562 446L334 458Z"
        fill="url(#lm-laptop)"
        stroke="#c9d1de"
        stroke-width="6"
        stroke-linejoin="round"
      />
      <path d="M334 458L562 446L564 454L336 466Z" fill="#8b97ab" />
      <path d="M360 356L388 354L376 452L350 454Z" fill="#ffffff" fill-opacity="0.22" />
      <path
        d="M435.5 393.5L448.5 409.5L461.5 393.5"
        stroke="#94a3b8"
        stroke-opacity="0.5"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M434 392L447 408L460 392"
        stroke="#f8fafc"
        stroke-opacity="0.85"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Hands -->
      <circle cx="342" cy="432" r="19" fill="url(#lm-shell)" stroke="#c3d0ee" stroke-width="1.5" />
      <circle cx="556" cy="404" r="18" fill="url(#lm-shell)" stroke="#c3d0ee" stroke-width="1.5" />

      <!-- Feet, tall round soles toward us -->
      <ellipse
        cx="318"
        cy="478"
        rx="60"
        ry="62"
        fill="url(#lm-shell)"
        stroke="#c3d0ee"
        stroke-width="1.5"
      />
      <ellipse
        cx="314"
        cy="482"
        rx="44"
        ry="48"
        fill="url(#lm-sole)"
        stroke="#ffffff"
        stroke-opacity="0.5"
        stroke-width="3"
      />
      <ellipse cx="304" cy="468" rx="20" ry="16" fill="#9cc3ff" fill-opacity="0.5" />
      <ellipse
        cx="536"
        cy="476"
        rx="56"
        ry="60"
        fill="url(#lm-shell)"
        stroke="#c3d0ee"
        stroke-width="1.5"
      />
      <ellipse
        cx="540"
        cy="480"
        rx="40"
        ry="45"
        fill="url(#lm-sole)"
        stroke="#ffffff"
        stroke-opacity="0.5"
        stroke-width="3"
      />
      <ellipse cx="532" cy="466" rx="18" ry="15" fill="#9cc3ff" fill-opacity="0.5" />
    </g>

    <!-- Head: bobs gently and tilts toward what it's looking at -->
    <g class="lm-bob">
      <g class="lm-head" :style="{ transform: `rotate(${headTilt}deg)` }">
        <!-- Antenna -->
        <path d="M334 80L327 50" stroke="url(#lm-joint)" stroke-width="6" stroke-linecap="round" />
        <ellipse cx="334" cy="80" rx="12" ry="6" fill="#94a3b8" />
        <circle
          class="lm-pulse"
          cx="326"
          cy="46"
          r="26"
          fill="#60a5fa"
          fill-opacity="0.5"
          filter="url(#lm-blur)"
        />
        <circle cx="326" cy="46" r="15" fill="url(#lm-blue)" />
        <circle cx="321" cy="41" r="4.5" fill="#ffffff" fill-opacity="0.85" />

        <!-- Far ear cup, mostly hidden by the head -->
        <ellipse cx="516" cy="196" rx="24" ry="54" fill="url(#lm-blue)" />
        <ellipse cx="520" cy="196" rx="12" ry="36" fill="#1e40af" />

        <!-- Shell -->
        <rect
          x="222"
          y="76"
          width="300"
          height="232"
          rx="112"
          fill="url(#lm-shell)"
          stroke="#c3d0ee"
          stroke-width="1.5"
          filter="url(#lm-soft)"
        />

        <!-- Near ear cup -->
        <ellipse
          cx="230"
          cy="200"
          rx="40"
          ry="62"
          fill="url(#lm-shell)"
          stroke="#c3d0ee"
          stroke-width="1.5"
        />
        <ellipse cx="226" cy="200" rx="30" ry="50" fill="url(#lm-blue)" />
        <ellipse cx="222" cy="200" rx="15" ry="30" fill="#1e40af" fill-opacity="0.85" />
        <path
          d="M214 166Q206 186 210 210"
          stroke="#bfdbfe"
          stroke-opacity="0.6"
          stroke-width="4"
          stroke-linecap="round"
        />

        <!-- Visor with a soft blue rim glow -->
        <rect x="268" y="118" width="236" height="146" rx="70" fill="url(#lm-visor)" />
        <rect
          x="268"
          y="118"
          width="236"
          height="146"
          rx="70"
          stroke="#3b82f6"
          stroke-opacity="0.55"
          stroke-width="3"
          filter="url(#lm-glow)"
        />
        <rect
          x="268"
          y="118"
          width="236"
          height="146"
          rx="70"
          stroke="#60a5fa"
          stroke-opacity="0.35"
          stroke-width="1.5"
        />
        <path
          d="M292 166Q298 138 340 130"
          stroke="#ffffff"
          stroke-opacity="0.14"
          stroke-width="9"
          stroke-linecap="round"
        />

        <!-- Brows -->
        <g
          :class="['lm-brows', { 'is-relaxed': eyesClosed }]"
          stroke="#60a5fa"
          stroke-width="5.5"
          stroke-linecap="round"
        >
          <path d="M306 148Q322 137 340 144" />
          <path d="M396 140Q414 130 434 140" />
        </g>

        <!-- Eyes -->
        <g v-for="(eye, i) in EYES" :key="eye.id">
          <ellipse :cx="eye.cx" :cy="eye.cy" :rx="eye.rx" :ry="eye.ry" fill="url(#lm-eyeball)" />
          <g :clip-path="`url(#lm-eye-${eye.id})`">
            <g
              class="lm-pupil"
              :style="{ transform: `translate(${offsets[i].x}px, ${offsets[i].y}px)` }"
            >
              <circle :cx="eye.cx" :cy="eye.cy" :r="eye.rx * 0.68" fill="url(#lm-iris)" />
              <circle :cx="eye.cx" :cy="eye.cy" :r="eye.rx * 0.33" fill="#0a1129" />
              <circle
                :cx="eye.cx + eye.rx * 0.26"
                :cy="eye.cy - eye.ry * 0.26"
                :r="eye.rx * 0.19"
                fill="#ffffff"
              />
              <circle
                :cx="eye.cx - eye.rx * 0.22"
                :cy="eye.cy + eye.ry * 0.22"
                :r="eye.rx * 0.09"
                fill="#ffffff"
                fill-opacity="0.8"
              />
            </g>
            <rect
              class="lm-lid"
              :x="eye.cx - eye.rx - 2"
              :y="eye.cy - eye.ry - 2"
              :width="eye.rx * 2 + 4"
              :height="eye.ry * 2 + 4"
              fill="url(#lm-visor)"
              :style="{ transform: `scaleY(${lidScale[i]})` }"
            />
          </g>
          <!-- Happy closed-eye curve, shown once the lid is fully down -->
          <path
            :class="['lm-closed', { 'is-visible': closedCurve[i] }]"
            :d="`M${eye.cx - eye.rx * 0.58} ${eye.cy + 3}Q${eye.cx} ${eye.cy + eye.ry * 0.45} ${eye.cx + eye.rx * 0.58} ${eye.cy + 3}`"
            stroke="#93c5fd"
            stroke-width="5.5"
            stroke-linecap="round"
          />
        </g>

        <!-- Sparkles -->
        <g class="lm-twinkle" stroke="url(#lm-blue)" stroke-width="6" stroke-linecap="round">
          <path d="M502 60L514 36" />
          <path d="M520 82L542 68" />
        </g>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Point = { x: number; y: number }

const props = withDefaults(
  defineProps<{
    // Both eyes shut, e.g. while the password field has focus
    eyesClosed?: boolean
    // One eye opens a crack, e.g. while the password is shown in plain text
    peek?: boolean
    // Viewport point to look at instead of the cursor
    lookAt?: Point | null
  }>(),
  { eyesClosed: false, peek: false, lookAt: null },
)

// The face is turned three-quarters toward the right, so the far eye sits higher and a bit larger
const EYES = [
  { id: 'left', cx: 332, cy: 198, rx: 30, ry: 34 },
  { id: 'right', cx: 424, cy: 194, rx: 33, ry: 37 },
] as const
const LEAVES = [
  { rotate: -150, scale: 0.78, dark: true },
  { rotate: -121, scale: 0.95, dark: false },
  { rotate: -94, scale: 1.05, dark: true },
  { rotate: -67, scale: 0.95, dark: false },
  { rotate: -38, scale: 0.8, dark: true },
]
const MAX_PUPIL_OFFSET = 10
const MAX_HEAD_TILT = 5
const HEAD_PIVOT_X = 380
// With nothing to follow, it glances toward the sign-in card on the right
const RESTING_GAZE = { x: 5, y: 1 }

const svgEl = ref<SVGSVGElement | null>(null)
const pointer = ref<Point | null>(null)
const offsets = ref(EYES.map(() => ({ ...RESTING_GAZE })))
const headTilt = ref(0)
const isBlinking = ref(false)

// 0 = lid fully open, 1 = fully shut
const lidScale = computed(() =>
  EYES.map((_, i) => {
    if (props.eyesClosed) return 1
    if (props.peek) return i === 0 ? 1 : 0.45
    return isBlinking.value ? 1 : 0
  }),
)

const closedCurve = computed(() => EYES.map((_, i) => props.eyesClosed || (props.peek && i === 0)))

function updateGaze() {
  const target = props.lookAt ?? pointer.value
  const ctm = svgEl.value?.getScreenCTM()
  if (!target || !ctm) {
    offsets.value = EYES.map(() => ({ ...RESTING_GAZE }))
    headTilt.value = 0
    return
  }

  // Convert the viewport point into the SVG's own coordinates
  const p = new DOMPoint(target.x, target.y).matrixTransform(ctm.inverse())

  offsets.value = EYES.map(({ cx, cy, rx }) => {
    const dx = p.x - cx
    const dy = p.y - cy
    const distance = Math.hypot(dx, dy) || 1
    // Close targets get a smaller offset so the pupils don't snap to the edge
    const reach = Math.min(MAX_PUPIL_OFFSET * (rx / 33), distance / 14)
    return { x: (dx / distance) * reach, y: (dy / distance) * reach * 0.8 }
  })
  headTilt.value = Math.max(-MAX_HEAD_TILT, Math.min(MAX_HEAD_TILT, (p.x - HEAD_PIVOT_X) / 70))
}

function onPointerMove(event: PointerEvent) {
  pointer.value = { x: event.clientX, y: event.clientY }
  updateGaze()
}

watch(() => props.lookAt, updateGaze, { deep: true })

let blinkTimer: number | undefined

function scheduleBlink() {
  blinkTimer = window.setTimeout(
    () => {
      isBlinking.value = true
      blinkTimer = window.setTimeout(() => {
        isBlinking.value = false
        scheduleBlink()
      }, 140)
    },
    2500 + Math.random() * 3500,
  )
}

onMounted(() => {
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) scheduleBlink()
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.clearTimeout(blinkTimer)
})
</script>

<style scoped>
.login-mascot {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.lm-head {
  transform-box: view-box;
  transform-origin: 380px 308px;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.lm-pupil {
  transition: transform 0.12s ease-out;
}

.lm-lid {
  transform-box: fill-box;
  transform-origin: top;
  transition: transform 0.22s ease-in-out;
}
.is-blinking .lm-lid {
  transition-duration: 0.09s;
}

.lm-closed {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.lm-closed.is-visible {
  opacity: 1;
  transition-delay: 0.12s;
}

.lm-brows {
  transition: transform 0.22s ease;
}
.lm-brows.is-relaxed {
  transform: translateY(5px);
}

.lm-bob {
  animation: lm-bob 4.5s ease-in-out infinite;
}
.lm-float {
  animation: lm-float 5s ease-in-out infinite;
}
.lm-sway {
  transform-box: view-box;
  transform-origin: 54px 400px;
  animation: lm-sway 6s ease-in-out infinite;
}
.lm-pulse {
  animation: lm-pulse 2.4s ease-in-out infinite;
}
.lm-twinkle {
  animation: lm-twinkle 3s ease-in-out infinite;
}

@keyframes lm-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
@keyframes lm-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
@keyframes lm-sway {
  0%,
  100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}
@keyframes lm-pulse {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
@keyframes lm-twinkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lm-bob,
  .lm-float,
  .lm-sway,
  .lm-pulse,
  .lm-twinkle {
    animation: none;
  }
}
</style>
