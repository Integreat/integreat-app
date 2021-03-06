import { Parser, ParserOptions } from 'htmlparser2'

export const parseHTMLEntities = (html: string, options: ParserOptions = { decodeEntities: true }): string => {
  let decodedContent = ''

  const parser = new Parser(
    {
      ontext: data => {
        decodedContent += data
      }
    },
    options
  )

  parser.write(html)
  parser.end()

  return decodedContent
}
