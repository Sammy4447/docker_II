export default function Steamer() {
  return (
    <figure className="hero-photo">
      <img src="/images/hero.jpg" alt="Steamed momo in a white bowl with steam rising" />
      <svg className="steam" viewBox="0 0 300 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <path className="wisp w1" d="M110 190 c-14 -18 14 -30 0 -50 s14 -30 0 -50" />
        <path className="wisp w2" d="M150 180 c-14 -18 14 -30 0 -50 s14 -30 0 -50" />
        <path className="wisp w3" d="M190 190 c-14 -18 14 -30 0 -50 s14 -30 0 -50" />
        <path className="wisp w4" d="M130 185 c-10 -16 10 -26 0 -42 s10 -26 0 -42" />
        <path className="wisp w5" d="M172 185 c-10 -16 10 -26 0 -42 s10 -26 0 -42" />
      </svg>
    </figure>
  )
}
