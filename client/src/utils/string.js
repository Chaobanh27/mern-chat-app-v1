
//hàm này đươc sử dụng để chuẩn hóa viết hoa chữ cái đầu tiên của các từ
export const capitalize = (word) => {
  return word[0].toUpperCase() + word.substring(1).toLowerCase()
}
