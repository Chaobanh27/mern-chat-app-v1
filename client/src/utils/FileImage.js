import imgDefault from '~/assets/images/file/DEFAULT.png'
import imgDOCX from '~/assets/images/file/DOCX.png'
import imgPDF from '~/assets/images/file/PDF.png'
import imgPPTX from '~/assets/images/file/PPTX.png'
import imgTXT from '~/assets/images/file/TXT.png'

export const getFileImage = (value) => {
  switch (value) {
  case 'DOCX' :
    return imgDOCX
  case 'PDF' :
    return imgPDF
  case 'PPTX' :
    return imgPPTX
  case 'TXT' :
    return imgTXT
  default :
    return imgDefault
  }
}