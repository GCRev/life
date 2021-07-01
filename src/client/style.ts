export default function(styleString: string) {
  const styleEl = document.createElement('style')
  styleEl.innerHTML = styleString
  document.head.appendChild(styleEl)
}
