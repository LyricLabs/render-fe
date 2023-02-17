import React from 'react'
// import logo from '../../../public/assets/flowns_icon_gray_dark.svg'
import { timeformater } from '../../../utils/index'

// import emoji from 'react-easy-emoji'

export function Template(domainInfo, width = 400, height = 600) {
  let { name, owner, nameHash, expiredAt, id } = domainInfo
  const dateStr = timeformater(expiredAt, 'DD MMM YYYY')
  let len = name.split('.')[0].length
  if (len > 5) len = 1
  const colorMaps = {
    5: ['#9CB7FF', '#1F2545', '#43F4FF', '#00FFFF', '#169877'],
    4: ['#00E075', '#17233A', '#43F4FF', '#00FFFF', '#169877'],
    3: ['#0EDB8D', '#4313AB', 'white', '#00FFFF', '#169877'],
    2: ['#FF5F49', '#003DCA', '#C636D2', '#BDFFFF', '#169877'],
    1: ['#1E4C6F', '#072342', '#6189CF', 'white', '#FF6CCE'],
  }

  width = Number(width)
  height = Number(height)
  if (height <= 200) {
    height = 200
  }

  if (width <= 400) {
    width = 400
  }

  return (
    <svg
      width={width}
      height={height}
      style={{ backgroundColor: '#17233a' }}
      viewBox={`0 0 ${Number(width) + 80} ${Number(height) + 40}`}
      fill="none"
    >
      <g filter="url(#filter0_d_370_738)">
        <rect
          x="40"
          y="16"
          width={width}
          height={height}
          rx="24"
          fill="url(#paint0_linear_370_738)"
        />
        <rect
          x="40"
          y="16"
          width={width}
          height={height}
          rx="24"
          fill="url(#paint1_linear_370_738)"
          fillOpacity="0.2"
        />
      </g>
      <mask
        id="mask0_370_738"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="40"
        y="16"
        width={width}
        height={height}
      >
        <rect
          x="40"
          y="16"
          width={width}
          height={height}
          rx="24"
          fill="url(#paint2_linear_370_738)"
        />
        <rect
          x="40"
          y="16"
          width={width}
          height={height}
          rx="24"
          fill="url(#paint3_linear_370_738)"
          fillOpacity="0.2"
        />
      </mask>
      <g mask="url(#mask0_370_738)">
        <g filter="url(#filter1_d_370_738)">
          <rect
            x="40"
            y="16"
            width={width}
            height={height}
            rx="24"
            fill="url(#paint4_linear_370_738)"
          />
          <rect
            x="40"
            y="16"
            width={width}
            height={height}
            rx="24"
            fill="url(#paint5_linear_370_738)"
            fillOpacity="0.2"
          />
          <rect
            x="40.5"
            y="16.5"
            width={width - 1}
            height={height - 1}
            rx="23.5"
            stroke="#00E075"
            strokeOpacity="0.24"
          />
        </g>
        <rect
          x="60.5"
          y="36.5"
          width={width - 40}
          height={height - 40}
          rx="13.5"
          stroke="url(#paint6_linear_370_738)"
          strokeDasharray="4 4"
        />
        <text
          fill="#ffffff"
          fontSize="35"
          fontWeight="600"
          fontFamily="Poppins"
          x={width / 2 + 40}
          y={height / 3}
          style={{
            dominantBbaseline: 'middle',
            textAnchor: 'middle',
          }}
        >
          {/* {emoji(name, (code, string, offset) => {
            console.log(code, string, offset)
            return code.toString()
          })} */}
          {name}
        </text>

        <rect
          x={width / 4.5}
          y={height / 2 - 25}
          width={width - 100}
          height="35"
          rx="10"
          fill="#17233A"
          fillOpacity="0.5"
        />
        <text
          fill="#ffffff"
          fontSize="18"
          fontFamily="Poppins"
          x={width / 2 + 40}
          y={height / 2}
          style={{
            dominantBbaseline: 'middle',
            textAnchor: 'middle',
          }}
        >
          Owner: {owner}
        </text>

        <text
          fill="rgba(255, 255, 255, 0.36)"
          fontSize="14"
          fontFamily="Poppins"
          x={width / 4 + 60}
          y={height - 40}
          style={{
            dominantBbaseline: 'middle',
            textAnchor: 'middle',
          }}
        >
          Epx: {dateStr}
        </text>
        <text
          fill="rgba(255, 255, 255, 0.36)"
          textAnchor="end"
          fontSize="14"
          fontFamily="Poppins"
          x={width / 1.5 + 80}
          y={height - 40}
          width="1000"
          style={{
            dominantBbaseline: 'middle',
            textAnchor: 'middle',
          }}
        >
          No.{id}
        </text>

        <g
          style={{
            mixBlendMode: 'overlay',
          }}
        >
          <circle
            cx={width}
            cy={height / 2}
            r="180"
            fill="url(#paint7_radial_370_738)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_370_738"
          x="0"
          y="0"
          cx={width + 80}
          cy={height + 80}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="24" />
          <feGaussianBlur stdDeviation="20" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0901961 0 0 0 0 0.137255 0 0 0 0 0.227451 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_370_738"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_370_738"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_370_738"
          x="0"
          y="0"
          cx={width + 80}
          cy={height + 80}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="24" />
          <feGaussianBlur stdDeviation="20" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0901961 0 0 0 0 0.137255 0 0 0 0 0.227451 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_370_738"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_370_738"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_370_738"
          x1="240"
          y1="16"
          x2="240"
          y2="616"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00E075" />
          <stop offset="1" stopColor="#17233A" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_370_738"
          x1="224.167"
          y1="207.25"
          x2="453.24"
          y2="285.751"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#43F4FF" />
          <stop offset="1" stopColor="#17233A" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_370_738"
          x1="240"
          y1="16"
          x2="240"
          y2="616"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00E075" />
          <stop offset="1" stopColor="#17233A" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_370_738"
          x1="224.167"
          y1="207.25"
          x2="453.24"
          y2="285.751"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#43F4FF" />
          <stop offset="1" stopColor="#17233A" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_370_738"
          x1="240"
          y1="16"
          x2="240"
          y2="616"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={colorMaps[len][0]} />
          <stop offset="1" stopColor={colorMaps[len][1]} />
        </linearGradient>
        <linearGradient
          id="paint5_linear_370_738"
          x1="224.167"
          y1="207.25"
          x2="453.24"
          y2="285.751"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={colorMaps[len][2]} />
          <stop offset="1" stopColor="#17233A" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_370_738"
          x1="240"
          y1="36"
          x2="240"
          y2="596"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#17233A" />
          <stop offset="1" stopColor="white" stopOpacity="0.38" />
        </linearGradient>
        <radialGradient
          id="paint7_radial_370_738"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(420 316) rotate(180) scale(180)"
        >
          <stop stopColor={colorMaps[len][3]} />
          <stop offset="1" stopColor={colorMaps[len][4]} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* <image xlinkHref={logo.src} x='340' y='50' height='60' width='60' /> */}
    </svg>
  )
}
