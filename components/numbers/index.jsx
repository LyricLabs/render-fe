
import dynamic from 'next/dynamic'
const AnimateNumber = dynamic(() => import('react-animated-numbers'), {
  ssr: false
})

export default function Comp(props) {
  const { number, fontStyle } = props

  return (
    <>
      <AnimateNumber
        includeComma
        animateToNumber={number}
        fontStyle={fontStyle}
        // configs={[
        //   { mass: 1, tension: 220, friction: 100 },
        //   { mass: 1, tension: 180, friction: 130 },
        //   { mass: 1, tension: 280, friction: 90 },
        //   { mass: 1, tension: 180, friction: 135 },
        //   { mass: 1, tension: 260, friction: 100 },
        //   { mass: 1, tension: 210, friction: 180 },
        // ]}
      />
    </>
  )
}
