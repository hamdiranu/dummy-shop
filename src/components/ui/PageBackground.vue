<template>
  <!-- Shapes from download_background_dummy_store.svg (320×150 viewBox), rebuilt in CSS and sized
       in vw so they keep their proportions on any screen. Fixed, so long pages scroll over it.
       Place it inside an `isolate` parent so -z-10 keeps it behind that parent's content. -->
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(to_bottom_right,#e7eeff,#f9faff_50%,#dde7ff)]"
  >
    <div
      class="absolute -bottom-[26.5625vw] -left-[23.4375vw] aspect-square w-[56.25vw] rounded-full bg-[#9db9ff] opacity-[0.28]"
    ></div>
    <div
      class="absolute -top-[30vw] -right-[23.75vw] aspect-square w-[55vw] rounded-full bg-[#a5bcff] opacity-30"
    ></div>
    <div
      class="absolute top-[60%] left-1/2 aspect-square w-[34.375vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-[0.22]"
    ></div>
    <div
      class="absolute top-[30%] left-[13.4375vw] h-[4.375vw] w-[18.125vw] origin-top-left -rotate-45 rounded-full bg-[#8fafff] opacity-[0.24]"
    ></div>
    <div
      class="absolute top-[68.67%] left-[73.75vw] h-[4.375vw] w-[18.125vw] origin-top-left -rotate-45 rounded-full bg-[#8fafff] opacity-[0.24]"
    ></div>
  </div>
</template>
