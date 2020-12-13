const throttle = (func, ms = 50, context = window) => {
  let to
  let wait = false
  return (...args) => {
    let later = () => {
      func.apply(context, args)
    }
    if (!wait) {
      later()
      wait = true
      to = setTimeout(() => {
        wait = false
      }, ms)
    }
  }
}

const links = document.querySelectorAll("a.preload")

const preload = throttle((link) => {
  fetch(link.href, { cache: "force-cache" })
}, 750)

Array.from(links).forEach((link) => {
  link.addEventListener("mouseenter", preload.bind(null, link))
})
