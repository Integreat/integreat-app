import React, { ReactElement, useEffect, useCallback } from 'react'
import styled, { css } from 'styled-components'
import buildConfig from '../constants/buildConfig'
import Dompurify from 'dompurify'

const SandBox = styled.div<{ centered: boolean }>`
  font-family: ${props => props.theme.fonts.web.contentFont};
  font-size: ${props => props.theme.fonts.contentFontSize};
  line-height: ${props => props.theme.fonts.contentLineHeight};
  ${props =>
    props.centered &&
    css`
      text-align: center;
      list-style-position: inside;
    `}

  & img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  & table {
    display: block;
    width: 100% !important;
    height: auto !important; /* need important because of bad-formatted remote-content */
    overflow: auto;
  }

  & tbody,
  & thead {
    display: table; /* little bit hacky, but works in all browsers, even IE11 :O */
    width: 100%;
    box-sizing: border-box;
    border-collapse: collapse;
  }

  & tbody,
  & thead,
  & th,
  & td {
    border: 1px solid ${props => props.theme.colors.backgroundAccentColor};
  }

  & a {
    overflow-wrap: break-word;
  }

  & details > * {
    padding: 0 25px;
  }

  & details > summary {
    padding: 0;
  }

  & pre {
    overflow-x: auto;
  }
`

type PropsType = {
  html: string
  onInternalLinkClick: (url: string) => void
  centered?: boolean
}

const HIJACK = new RegExp(buildConfig().internalLinksHijackPattern)

const RemoteContent = ({ html, onInternalLinkClick, centered = false }: PropsType): ReactElement => {
  const sandBoxRef = React.createRef<HTMLDivElement>()

  const handleClick = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault ? event.preventDefault() : (event.returnValue = false)
      const target = event.currentTarget

      if (target instanceof HTMLAnchorElement) {
        const href = target.href
        onInternalLinkClick(decodeURIComponent(new URL(decodeURIComponent(href)).pathname))
      }
    },
    [onInternalLinkClick]
  )

  useEffect(() => {
    if (!sandBoxRef.current) {
      return
    }
    const collection = sandBoxRef.current.getElementsByTagName('a')
    Array.from(collection).forEach(node => {
      if (HIJACK.test(node.href)) {
        node.addEventListener('click', handleClick)
      }
    })
  }, [html, handleClick, sandBoxRef])

  const dangerouslySetInnerHTML = {
    __html: Dompurify.sanitize(html)
  }

  return <SandBox centered={centered} dangerouslySetInnerHTML={dangerouslySetInnerHTML} ref={sandBoxRef} />
}

export default RemoteContent
