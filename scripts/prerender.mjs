import { readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const distDir = path.join(rootDir, "dist")
const htmlPath = path.join(distDir, "index.html")

async function findServerEntry(dirPath) {
  const directoryEntries = await readdir(dirPath, { withFileTypes: true })
  const candidatePaths = []

  for (const entry of directoryEntries) {
    const entryPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      candidatePaths.push(...(await findServerEntry(entryPath)))
      continue
    }

    if (/^entry-server(?:-[^.]+)?\.(?:c|m)?js$/.test(entry.name)) {
      candidatePaths.push(entryPath)
    }
  }

  return candidatePaths
}

const serverEntries = await findServerEntry(path.join(distDir, "server"))

if (!serverEntries.length) {
  throw new Error("Could not locate a built server entry under dist/server.")
}

serverEntries.sort((leftPath, rightPath) => {
  const leftExact = Number(path.basename(leftPath) === "entry-server.js")
  const rightExact = Number(path.basename(rightPath) === "entry-server.js")

  return rightExact - leftExact || leftPath.localeCompare(rightPath)
})

const serverEntryPath = pathToFileURL(serverEntries[0]).href

const template = await readFile(htmlPath, "utf8")
const { render } = await import(serverEntryPath)
const appHtml = render()
const scriptMatch = template.match(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/
)
const preloadTags = Array.from(
  appHtml.matchAll(/<link rel="preload"[^>]*\/>/g),
  (match) => match[0]
).join("")
const pageHtml = appHtml.replace(/^(?:<link rel="preload"[^>]*\/>)+/, "")
const withPreloads = template.replace("</head>", `${preloadTags}</head>`)
const withApp = withPreloads.replace(
  '<div id="root"></div>',
  `<div id="root">${pageHtml}</div>`
)

await writeFile(htmlPath, withApp, "utf8")
await rm(path.join(distDir, "server"), { force: true, recursive: true })
