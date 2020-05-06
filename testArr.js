const make2dArr = (line, column) => {
  const arr = new Array()
  for (let i = 0; i < line; i++) {
    arr[i] = new Array()
    for (let j = 0; j < column; j++) {
      arr[i][j] = null
    }
  }

  return arr
}

console.log('log => : make2dArr(2,2)', make2dArr(2, 2))
make2dArr(2, 2)