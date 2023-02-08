import moment from 'moment'

// import twemoji from 'twemoji'

// const twOptions = { folder: 'svg', ext: '.svg' };

// const emojify = (text) => twemoji.parse(text, twOptions);

const timeformater = (timestamp, formater) => {
  const time = Number(timestamp)
  if (time === 0) return ''
  return moment(time * 1000).format(formater || 'YYYY-MM-DD hh:mm:ss')
}

export default async (domain, domainInfo, styles) => {
  const domainArr = domain.split('.')
  const name = domainArr[0] || ''
  let { width = 400, height = 600 } = styles
  if (width < 150) {
    width = 150
  }
  if (height < 200) {
    height = 200
  }
  const highlightColor =
    'radial-gradient(50% 50% at 50% 50%, #00FFFF 0%, rgba(22, 152, 119, 0) 100%);'
  let backgroundColor = ''
  // const rootName = domainArr[1] || ''
  const len = name.length

  switch (len) {
    case 5:
      backgroundColor =
        'linear-gradient(117.2deg, rgba(67, 244, 255, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #9CB7FF 0%, #1F2545 100%);'
      break
    case 4:
      backgroundColor =
        'linear-gradient(117.2deg, rgba(67, 244, 255, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #00E075 0%, #17233A 100%);'
      break
    case 3:
      backgroundColor =
        'linear-gradient(117.2deg, rgba(255, 255, 255, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #0EDB8D 0%, #4313AB 100%);'
      break
    case 2:
      backgroundColor =
        'linear-gradient(117.2deg, rgba(198, 54, 210, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #FF5F49 0%, #003DCA 100%);'
      break
    default:
      backgroundColor =
        'linear-gradient(117.2deg, rgba(97, 137, 207, 0.2) 41.23%, rgba(23, 35, 58, 0) 83.5%), linear-gradient(180deg, #1E4C6F 0%, #072342 100%);'
  }

  const getStyle = () => {
    return `
    * {
    margin: 0;
    padding: 0;
  }
  
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  body {
   width: ${width}px;
   height: ${height}px;
   overflow: hidden;
   font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
   border-radius: 30px;
 }
  
  .domain-card {
    position: relative;
    overflow: hidden;
    width: ${width}px;
    height: ${height}px;
    background: ${backgroundColor}
  }
  
  .highlight {
    position: absolute;
    width: 360px;
    height: 360px;
    left: ${width / 2 + 20}px;
    top: ${height / 6}px;
  
    background: ${highlightColor}
    mix-blend-mode: overlay;
  }
  
  .container {
    position: relative;
    width: ${width - 40}px;
    height: ${height - 40}px;
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
    border: 1px dashed rgba(255, 255, 255, 0.2);
  }
  
 
  .info {
    margin-top: ${height / 10}px;
  }
  .label {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .label-content {
    padding: 0 5px;
    min-width: 30px;
    height: 24px;
    color: white;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    background: rgba(23, 35, 58, 0.6);
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .name {
    margin-top:${height / 6}px;
    width: 100%;
    word-break: break-word;
    text-align: center;
    font-weight: 500;
    padding: 0 5px;
    font-size: ${height / 10}px;
    // line-height: 26px;
    color: #ffffff;
  }

  .exp-date {
    position: absolute;
    bottom: 15px;
    left: 15px;
    color: rgba(255, 255, 255, 0.4);
    font-family: Roboto Mono;
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 16px;
    font-style:italic;
  }
  
  .flowns {
    position: absolute;
    bottom: 25px;
    right: 15px;
    color: rgba(255, 255, 255, 0.4);
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    font-style:italic;
  }

  .id {
    position: absolute;
    top: 15px;
    right: 0px;
    color: rgba(255, 255, 255, 0.6);
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 16px;
  }
    `
  }

  const getInfoLabel = (domainInfo) => {
    const isSmall = Number(width) <= 200
    const { owner } = domainInfo
    const ownerLabel = `${Number(width) <= 250 ? '' : 'Owner: '}${owner}`

    if (isSmall) {
      return ''
    }

    return `
    <div class='label'>
      <div class='label-content'>
        ${ownerLabel}
      </div>
    </div>`
  }
  const getBottom = (domainInfo) => {
    const isSmall = Number(width) <= 100
    const isMiddle = Number(width) <= 200
    const { expiredAt, id } = domainInfo

    const expTime = `
    <div class='exp-date'>
      Exp: ${timeformater(expiredAt, 'DD MMM YYYY')}
    </div>
    `
    const flowns = ` 
    <div class='flowns'>
      Flowns
      <div class='id'>No.${id}<div>
    </div>
    `

    if (isSmall) {
      return ''
    } else if (isMiddle) {
      return flowns
    } else {
      return expTime + flowns
    }
  }

  const getBody = () => {
    const { expiredAt = 0, id, owner } = domainInfo

    return `
    <html>

    <head>
    </head>
    
    <body>
      <div class='domain-card'>
        <div class='container'>
        <div class='highlight'></div>
          <div class='avatar'>
    
          </div>
          <div class='name'>
            ${domain}
          </div>
          <div class='info'>
          ${getInfoLabel(domainInfo)}
          </div>
          <div>
          ${getBottom(domainInfo)}
          </div>
         
    
        </div>
       
    
      </div>
    </body>
    
    </html>

    `
  }

  const html = `
  <html>
  <head>
    <style>
     ${getStyle()}
    </style>
  </head>
  <body>
  ${getBody()}
  </body>
</html>
  `

  return html
}
