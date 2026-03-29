import "./index.css"

const RAIN_SELECTOR = ".rain-layer"
const CONTENT_MAX_WIDTH = 1152
const RAIN_INIT_ATTEMPTS = 40

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getDocumentHeight() {
  return Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    window.innerHeight
  )
}

function pickHorizontalStart(viewportWidth: number, size: number) {
  if (viewportWidth < 900) {
    if (Math.random() < 0.5) {
      return randomBetween(-size * 0.18, viewportWidth * 0.12)
    }

    return randomBetween(
      viewportWidth * 0.84 - size * 0.42,
      viewportWidth - size * 0.52
    )
  }

  const gutterWidth = Math.max((viewportWidth - CONTENT_MAX_WIDTH) / 2, 120)
  const leftMin = -size * 0.18
  const leftMax = Math.max(20, gutterWidth - size * 0.36)
  const rightMin = viewportWidth - gutterWidth - size * 0.64
  const rightMax = viewportWidth - size * 0.28

  if (Math.random() < 0.5) {
    return randomBetween(leftMin, leftMax)
  }

  return randomBetween(rightMin, rightMax)
}

function startRain() {
  const layer = document.querySelector<HTMLElement>(RAIN_SELECTOR)

  if (!layer || layer.dataset.initialized === "true") {
    return Boolean(layer)
  }

  const imageList = (layer.dataset.rainImages ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)

  if (!imageList.length) {
    return true
  }

  layer.dataset.initialized = "true"

  const burstTimeoutIds: number[] = []
  let spawnIntervalId = 0

  const syncLayerHeight = () => {
    layer.style.height = `${getDocumentHeight()}px`
  }

  const spawnSprite = () => {
    const viewportWidth = window.innerWidth
    const documentHeight = getDocumentHeight()
    const size = clamp(
      randomBetween(
        viewportWidth < 640 ? 220 : 270,
        viewportWidth < 640 ? 340 : 430
      ),
      220,
      460
    )

    const sprite = document.createElement("img")
    sprite.alt = ""
    sprite.className = "rain-sprite"
    sprite.src = imageList[Math.floor(Math.random() * imageList.length)]
    sprite.style.setProperty(
      "--left",
      `${pickHorizontalStart(viewportWidth, size)}px`
    )
    sprite.style.setProperty("--size", `${size}px`)
    sprite.style.setProperty("--drift", `${randomBetween(-18, 18)}px`)
    sprite.style.setProperty("--rotation", `${randomBetween(-14, 14)}deg`)
    sprite.style.setProperty("--duration", `${randomBetween(8.8, 13.6)}s`)
    sprite.style.setProperty(
      "--stop-y",
      `${documentHeight + size * randomBetween(0.18, 0.38)}px`
    )
    sprite.style.zIndex = "0"

    sprite.addEventListener(
      "animationend",
      () => {
        sprite.remove()
      },
      { once: true }
    )

    layer.appendChild(sprite)
    syncLayerHeight()
  }

  syncLayerHeight()

  for (let index = 0; index < 3; index += 1) {
    const timeoutId = window.setTimeout(() => {
      spawnSprite()
    }, index * 420)

    burstTimeoutIds.push(timeoutId)
  }

  spawnIntervalId = window.setInterval(
    () => {
      spawnSprite()
    },
    randomBetween(1850, 3200)
  )

  window.addEventListener("resize", syncLayerHeight)

  window.addEventListener(
    "pagehide",
    () => {
      burstTimeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      window.clearInterval(spawnIntervalId)
      window.removeEventListener("resize", syncLayerHeight)
    },
    { once: true }
  )

  return true
}

function ensureRainStarts(attempt = 0) {
  const didStart = startRain()

  if (didStart || attempt >= RAIN_INIT_ATTEMPTS) {
    return
  }

  window.setTimeout(() => {
    ensureRainStarts(attempt + 1)
  }, 120)
}

async function mountApp() {
  const rootElement = document.getElementById("root")

  if (!rootElement) {
    return
  }

  const [{ StrictMode }, { createRoot, hydrateRoot }, { default: App }] =
    await Promise.all([
      import("react"),
      import("react-dom/client"),
      import("./App"),
    ])

  if (import.meta.env.DEV) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  } else {
    hydrateRoot(rootElement, <App />)
  }

  window.requestAnimationFrame(() => {
    ensureRainStarts()
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void mountApp()
  }, { once: true })
} else {
  void mountApp()
}
