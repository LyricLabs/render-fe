import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Poppins';
        src: url('/fonts/Poppins-Bold.ttf') format('truetype');
        src: url('/fonts/Poppins-Medium.ttf') format('truetype');
        src: url('/fonts/Poppins-Regular.ttf') format('truetype');
      }

      body::-webkit-scrollbar {
        width: 10px;
        height: 1px;
      }
      body::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: #5D6061;
      }
      body::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: #EDEDED;
      }
      `}
  />
)

export default Fonts
